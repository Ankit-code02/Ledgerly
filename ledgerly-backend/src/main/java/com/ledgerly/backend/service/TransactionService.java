package com.ledgerly.backend.service;

import com.ledgerly.backend.dto.TransactionRequest;
import com.ledgerly.backend.dto.TransactionResponse;
import com.ledgerly.backend.entity.Category;
import com.ledgerly.backend.entity.Transaction;
import com.ledgerly.backend.entity.TransactionType;
import com.ledgerly.backend.entity.User;
import com.ledgerly.backend.repository.CategoryRepository;
import com.ledgerly.backend.repository.TransactionRepository;
import com.ledgerly.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    public TransactionService(
            TransactionRepository transactionRepository,
            UserRepository userRepository,
            CategoryRepository categoryRepository
    ) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional
    public TransactionResponse create(
            Long userId,
            TransactionRequest request
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found")
                );

        Category category = categoryRepository
                .findById(request.getCategoryId())
                .orElseThrow(() ->
                        new IllegalArgumentException("Category not found")
                );

        if (!category.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException(
                    "Category does not belong to user"
            );
        }

        Transaction transaction = new Transaction();

        transaction.setAmount(request.getAmount());
        transaction.setType(request.getType());
        transaction.setDescription(request.getDescription());
        transaction.setTransactionDate(request.getTransactionDate());
        transaction.setUser(user);
        transaction.setCategory(category);

        LocalDateTime now = LocalDateTime.now();

        transaction.setCreatedAt(now);
        transaction.setUpdatedAt(now);

        Transaction saved = transactionRepository.save(transaction);

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<TransactionResponse> getByUser(Long userId) {

        return transactionRepository
                .findByUserIdOrderByTransactionDateDesc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private TransactionResponse toResponse(Transaction transaction) {

        return new TransactionResponse(
                transaction.getId(),
                transaction.getAmount(),
                transaction.getType(),
                transaction.getDescription(),
                transaction.getTransactionDate(),
                transaction.getCategory().getId(),
                transaction.getCategory().getName()
        );
    }

    @Transactional(readOnly = true)
    public TransactionResponse getById(Long id, Long userId) {

        Transaction transaction = transactionRepository
                .findByIdAndUserId(id, userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Transaction not found")
                );

        return toResponse(transaction);
    }

    @Transactional
    public TransactionResponse update(
            Long id,
            Long userId,
            TransactionRequest request
    ) {

        Transaction transaction = transactionRepository
                .findByIdAndUserId(id, userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Transaction not found")
                );

        Category category = categoryRepository
                .findById(request.getCategoryId())
                .orElseThrow(() ->
                        new IllegalArgumentException("Category not found")
                );

        if (!category.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException(
                    "Category does not belong to user"
            );
        }

        transaction.setAmount(request.getAmount());
        transaction.setType(request.getType());
        transaction.setDescription(request.getDescription());
        transaction.setTransactionDate(request.getTransactionDate());
        transaction.setCategory(category);
        transaction.setUpdatedAt(LocalDateTime.now());

        return toResponse(
                transactionRepository.save(transaction)
        );
    }

    @Transactional
    public void delete(Long id, Long userId) {

        Transaction transaction = transactionRepository
                .findByIdAndUserId(id, userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Transaction not found")
                );

        transactionRepository.delete(transaction);
    }

    @Transactional(readOnly = true)
    public List<TransactionResponse> getFiltered(
            Long userId,
            TransactionType type,
            LocalDate from,
            LocalDate to
    ) {

        List<Transaction> transactions;

        if (type != null) {

            transactions = transactionRepository
                    .findByUserIdAndType(userId, type);

        } else if (from != null && to != null) {

            transactions = transactionRepository
                    .findByUserIdAndDateRange(userId, from, to);

        } else if (from != null) {

            transactions = transactionRepository
                    .findByUserIdAndFromDate(userId, from);

        } else if (to != null) {

            transactions = transactionRepository
                    .findByUserIdAndToDate(userId, to);

        } else {

            transactions = transactionRepository
                    .findByUserIdOrderByTransactionDateDesc(userId);
        }

        return transactions.stream()
                .map(this::toResponse)
                .toList();
    }
}