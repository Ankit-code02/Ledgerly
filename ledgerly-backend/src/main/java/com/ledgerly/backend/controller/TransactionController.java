package com.ledgerly.backend.controller;

import com.ledgerly.backend.dto.TransactionRequest;
import com.ledgerly.backend.dto.TransactionResponse;
import com.ledgerly.backend.entity.TransactionType;
import com.ledgerly.backend.security.AuthenticatedUser;
import com.ledgerly.backend.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TransactionResponse create(
            @Valid @RequestBody TransactionRequest request
    ) {
        Long userId = AuthenticatedUser.getId();

        return transactionService.create(userId, request);
    }

    @GetMapping
    public List<TransactionResponse> getByUser(
            @RequestParam(required = false) TransactionType type,
            @RequestParam(required = false) LocalDate from,
            @RequestParam(required = false) LocalDate to
    ) {
        Long userId = AuthenticatedUser.getId();

        return transactionService.getFiltered(
                userId,
                type,
                from,
                to
        );
    }
    @GetMapping("/{id}")
    public TransactionResponse getById(
            @PathVariable Long id
    ) {
        Long userId = AuthenticatedUser.getId();

        return transactionService.getById(id, userId);
    }

    @PutMapping("/{id}")
    public TransactionResponse update(
            @PathVariable Long id,
            @Valid @RequestBody TransactionRequest request
    ) {
        Long userId = AuthenticatedUser.getId();

        return transactionService.update(id, userId, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable Long id
    ) {
        Long userId = AuthenticatedUser.getId();

        transactionService.delete(id, userId);
    }
}