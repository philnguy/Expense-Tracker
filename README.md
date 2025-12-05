# Expense Tracker / Personal Finance Tracker

A full-stack **personal finance tracker** that allows users to log income and expenses, visualize spending patterns, and monitor trends through charts, category breakdowns, and time-based analytics (daily/weekly/monthly).  


---

## Features

### Dashboard Overview
- Monthly income and expense totals  
- Spending limit progress bar  
- Highest and lowest spending categories  
- Daily, weekly, and monthly summaries  
- Recent transactions table  
- Category totals list  
- Monthly trend line chart  

### Data Entry
- Add income (floating "+" button)  
- Add expense (floating "-" button)  
- Modal-based forms with inputs for amount, category, description, and date  

### Dynamic Calculations
- Totals update automatically, including:  
  - Monthly totals  
  - Category totals  
  - Trend chart  
  - High/low category  
  - Recent transaction list  

---

## Approach & Design
The project follows a clean, minimal REST-based architecture:​
Frontend (HTML/CSS/JS)​

Spring Boot REST API (Controllers → Service → Repository)​


## Architecture


### Project Structure: Frontend
#### index.html  
- Main application UI
#### style.css         
- Styling, layout, modals, tables, components
#### script.js      
- Logic for expenses, income, charts, UI updates

### Project Structure: Backend
#### Transaction.java​/Income.java​/Expense.java​
- entity models ​
#### TransactionRepository.java​   
- JPA repository​
#### TransactionService.java ​
- handles business logic​
#### TransactionController.java ​
- REST endpoints​
#### ExpenseBackendApplication.java​
- Runs the application​


## Testing and Verification

### Test 1: Add Income
1. Click the **Add Income** button
2. Input:
   - **Amount:** 2500
   - **Category:** Salary
   - **Date:** 2025-12-01
3. **Expected:**
   - Monthly income updates
   - Recent transactions table updates
   - Trend chart updates

### Test 2: Add Expense
1. Click the **Add Expense** button
2. Input:
   - **Amount:** 120
   - **Category:** Food & Health
   - **Date:** 2025-12-02
3. **Expected:**
   - Monthly expense updates
   - Category list recalculates
   - Progress bar updates

### Test 3: Category Aggregation
Add the following sample entries:

| Amount | Category       | Date       |
|--------|----------------|------------|
| 60     | Subscription   | 2025-12-02 |
| 400    | Shopping       | 2025-12-03 |
| 50     | Entertainment  | 2025-12-03 |

**Expected:**
- Accurate high/low spending category
- Updated category totals
- Updated dashboard numbers

### Test 4: Trend Chart Across Months
Add transactions from various months:

| Date       | Amount |
|------------|--------|
| 2025-01-10 | 500    |
| 2025-03-15 | 900    |
| 2025-08-04 | 200    |

**Expected:**
- Chart displays new data points
- Correct month-to-month trend line

**Validation Process​:**
- Dashboard Transaction Confirmation​

- Load the dashboard to confirm backend transactions are correctly displayed and updated in real-time.​

- Income and Expense Verification​

- Add income and expenses, then verify immediate updates to totals and category breakdowns for accuracy.​

- Trend Chart Analysis​

- Review the 12-month trend chart with interactive tooltips to ensure accurate data representation and user interaction.​

- Color-Coded Category Validation​

-Validate the color-coded category breakdown for clear visual distinctions and accurate financial categorization.​

