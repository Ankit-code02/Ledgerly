package com.ledgerly.backend.service;

import com.ledgerly.backend.dto.DashboardResponse;
import com.ledgerly.backend.entity.TransactionType;
import com.ledgerly.backend.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class DashboardService {

    private final TransactionRepository transactionRepository;

    public DashboardService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard(Long userId) {

        BigDecimal totalIncome =
                transactionRepository.sumAmountByUserIdAndType(
                        userId,
                        TransactionType.INCOME
                );

        BigDecimal totalExpense =
                transactionRepository.sumAmountByUserIdAndType(
                        userId,
                        TransactionType.EXPENSE
                );

        if (totalIncome == null) {
            totalIncome = BigDecimal.ZERO;
        }

        if (totalExpense == null) {
            totalExpense = BigDecimal.ZERO;
        }

        BigDecimal balance = totalIncome.subtract(totalExpense);

        Map<String, BigDecimal> expenseByCategory = new LinkedHashMap<>();

        transactionRepository.findExpenseByCategory(userId)
                .forEach(row -> {
                    String category = (String) row[0];
                    BigDecimal amount = (BigDecimal) row[1];
                    expenseByCategory.put(category, amount);
                });

        return new DashboardResponse(
                totalIncome,
                totalExpense,
                balance,
                expenseByCategory
        );
    }
}
