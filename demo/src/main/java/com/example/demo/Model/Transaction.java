package com.example.demo;

import java.time.LocalDate;

public class Transaction {
    private long id;
    private double amount;
    private String category;
    private LocalDate date;
    private String type;
    private String status;

    public Transaction(long id, double amount, String category, LocalDate date, String type) {
        this.id = id;
        this.amount = amount;
        this.category = category;
        this.date = date;
        this.type = type;
        this.status = "Success";
    }

    public double getAmount() { return amount; }
    public String getCategory() { return category; }
    public LocalDate getDate() { return date; }
    public String getType() { return type; }
    public long getId() {return id;}
    public void setId(long id) {this.id = id;}

    public String getStatus() {return status;}
}
