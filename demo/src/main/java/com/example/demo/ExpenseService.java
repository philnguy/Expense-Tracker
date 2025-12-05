package com.example.demo;

import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class ExpenseService {

    private final List<Transaction> transactions = new ArrayList<>();

    public List<Transaction> getAll() {
        return transactions;
    }

    public Transaction addIncome(Income income) {
        Transaction t = new Transaction(
                transactions.size()+1,
                income.getAmount(),
                income.getCategory(),
                income.getDate(),
                "income"
            
        );
        transactions.add(t);
        return t;
    }

    public Transaction addExpense(Expense expense) {
        Transaction t = new Transaction(
                transactions.size()+1,
                expense.getAmount() * -1,
                expense.getCategory(),
                expense.getDate(),
                "expense"
        );
        transactions.add(t);
        return t;
    }
}
