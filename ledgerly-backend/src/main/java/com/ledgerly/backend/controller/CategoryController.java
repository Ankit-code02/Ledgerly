package com.ledgerly.backend.controller;

import com.ledgerly.backend.dto.CategoryRequest;
import com.ledgerly.backend.dto.CategoryResponse;
import com.ledgerly.backend.security.AuthenticatedUser;
import com.ledgerly.backend.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryResponse create(
            @Valid @RequestBody CategoryRequest request
    ) {
        Long userId = AuthenticatedUser.getId();

        return categoryService.create(userId, request);
    }

    @GetMapping
    public List<CategoryResponse> getByUser() {
        Long userId = AuthenticatedUser.getId();

        return categoryService.getByUser(userId);
    }

    @GetMapping("/{id}")
    public CategoryResponse getById(
            @PathVariable Long id
    ) {
        Long userId = AuthenticatedUser.getId();

        return categoryService.getById(id, userId);
    }

    @PutMapping("/{id}")
    public CategoryResponse update(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest request
    ) {
        Long userId = AuthenticatedUser.getId();

        return categoryService.update(id, userId, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable Long id
    ) {
        Long userId = AuthenticatedUser.getId();

        categoryService.delete(id, userId);
    }
}