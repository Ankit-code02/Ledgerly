package com.ledgerly.backend.dto;

import com.ledgerly.backend.entity.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDate;

public record TransactionResponse(
        Long id,
        BigDecimal amount,
        TransactionType type,
        String description,
        LocalDate transactionDate,
        Long categoryId,
        String categoryName
) {
}