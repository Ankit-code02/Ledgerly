package com.ledgerly.backend.repository;

import com.ledgerly.backend.entity.Transaction;
import com.ledgerly.backend.entity.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUserIdOrderByTransactionDateDesc(Long userId);

    Optional<Transaction> findByIdAndUserId(Long id, Long userId);

    @Query("""
            SELECT COALESCE(SUM(t.amount), 0)
            FROM Transaction t
            WHERE t.user.id = :userId
            AND t.type = :type
            """)
    BigDecimal sumAmountByUserIdAndType(
            Long userId,
            TransactionType type
    );

    @Query("""
            SELECT t.category.name, COALESCE(SUM(t.amount), 0)
            FROM Transaction t
            WHERE t.user.id = :userId
            AND t.type = 'EXPENSE'
            GROUP BY t.category.name
            """)
    List<Object[]> findExpenseByCategory(Long userId);

    @Query("""
            SELECT t
            FROM Transaction t
            WHERE t.user.id = :userId
            AND t.type = :type
            ORDER BY t.transactionDate DESC
            """)
    List<Transaction> findByUserIdAndType(
            Long userId,
            TransactionType type
    );

    @Query("""
            SELECT t
            FROM Transaction t
            WHERE t.user.id = :userId
            AND t.transactionDate >= :from
            ORDER BY t.transactionDate DESC
            """)
    List<Transaction> findByUserIdAndFromDate(
            Long userId,
            LocalDate from
    );

    @Query("""
            SELECT t
            FROM Transaction t
            WHERE t.user.id = :userId
            AND t.transactionDate <= :to
            ORDER BY t.transactionDate DESC
            """)
    List<Transaction> findByUserIdAndToDate(
            Long userId,
            LocalDate to
    );

    @Query("""
            SELECT t
            FROM Transaction t
            WHERE t.user.id = :userId
            AND t.transactionDate >= :from
            AND t.transactionDate <= :to
            ORDER BY t.transactionDate DESC
            """)
    List<Transaction> findByUserIdAndDateRange(
            Long userId,
            LocalDate from,
            LocalDate to
    );
}