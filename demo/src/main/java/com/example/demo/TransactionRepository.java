package com.example.demo;

import java.util.*;
import java.util.concurrent.atomic.AtomicLong;

public class TransactionRepository {
    private final List<Transaction> transactions = Collections.synchronizedList(new ArrayList<>());
    private final AtomicLong idCounter = new AtomicLong(1);

    public TransactionRepository() {}

    public Transaction save(Transaction t) {
        if (t.getId() == 0) {
            t.setId(idCounter.getAndIncrement());
        }
        transactions.add(t);
        return t;
    }

    public List<Transaction> findAll() {
        return new ArrayList<>(transactions);
    }

    // yearMonth format: "2025-12"
    public List<Transaction> findByMonth(String yearMonth) {
        List<Transaction> out = new ArrayList<>();

        for (Transaction t : transactions) {
            if (t.getDate() != null &&
                t.getDate().toString().startsWith(yearMonth)) {
                out.add(t);
            }
        }

        return out;
    }
}
