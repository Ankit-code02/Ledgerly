package com.ledgerly.backend.dto;

import java.math.BigDecimal;
import java.util.Map;

public record DashboardResponse(
        BigDecimal totalIncome,
        BigDecimal totalExpense,
        BigDecimal balance,
        Map<String, BigDecimal> expenseByCategory
) {
}