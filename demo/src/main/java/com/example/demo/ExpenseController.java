package com.example.demo;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://127.0.0.1:5500")  // <-- ADD THIS
public class ExpenseController {

    private final ExpenseService service;

    public ExpenseController(ExpenseService service) {
        this.service = service;
    }

    @GetMapping("/transactions")
    public List<Transaction> getAll() {
        return service.getAll();
    }

    @PostMapping("/income")
    public Transaction addIncome(@RequestBody Income income) {
        return service.addIncome(income);
    }

    @PostMapping("/expense")
    public Transaction addExpense(@RequestBody Expense expense) {
        return service.addExpense(expense);
    }
}
