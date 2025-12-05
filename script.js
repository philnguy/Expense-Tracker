
let transactions = [];

async function loadTransactions() {
    try {
        const response = await fetch("http://localhost:8080/api/transactions");
        const data = await response.json();

        console.log("Loaded transactions:", data);

        
         transactions = Array.isArray(data) ? data : [];

        
        updateDashboard();
        updateTransactionsTable();
        updatePeriodTotalsUI();
        updateCategoryTotalsUI();
        updateHighLowUI();
        renderTrendChart();
        
    } catch (err) {
        console.error("Failed to load transactions", err);
    }
}

window.onload = loadTransactions;

const CATEGORY_COLORS = {
    "Food & Health": "#ea580c",
    "Entertainment": "#08bdeaff",
    "Shopping": "#eab308",
    "Investments": "#10b981",
    "Subscription": "#6366f1",
    "Transfer": "#ff09c1ff",
    "Other": "#6b7280"
};


// let monthlyIncome = 0;
// let monthlyExpenses = 1200;

function calculateMonthlyTotals() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    let income = 0;
    let expenses = 0;

    transactions.forEach(t => {
        const d = new Date(t.date);
        if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
            if (t.type === "income") income += t.amount;
            if (t.type === "expense") expenses += Math.abs(t.amount);
        }
    });

    return { income, expenses };
}



const today = new Date().toISOString().split('T')[0];
document.getElementById('incomeDate').value = today;
document.getElementById('expenseDate').value = today;

function openIncomeModal() {
    document.getElementById('incomeModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function openExpenseModal() {
    document.getElementById('expenseModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.style.overflow = 'auto';

    if (modalId == 'incomeModal') {
        document.getElementById('incomeForm').reset();
        document.getElementById('incomeDate').value = today;
    } else {
        document.getElementById('expenseForm').reset();
        document.getElementById('expenseDate').value = today;
    }
}

window.onclick = function(event) {
    const incomeModal = document.getElementById('incomeModal');
    const expenseModal = document.getElementById('expenseModal');

    if (event.target === incomeModal) {
        closeModal('incomeModal');
    }
    if (event.target === expenseModal) {
        closeModal('expenseModal');
    }
}

async function addIncome() {
    const income = {
        amount: parseFloat(document.getElementById("incomeAmount").value),
        category: document.getElementById("incomeCategory").value,
        description: document.getElementById("incomeDescription").value,
        date: document.getElementById("incomeDate").value
    };

    try {
        const response = await fetch("http://localhost:8080/api/income", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(income)
        });

        if (!response.ok) throw new Error("Failed to save income");

        console.log("Income saved!");
        closeModal("incomeModal");

        await loadTransactions();  // Refresh UI
        showNotification('Income added successfully!', 'success');
    } catch (err) {
        console.error(err);
        alert("Could not add income. Check backend.");
    }
    //monthlyIncome += amount;
}

async function addExpense() {
    const expense = {
        amount: parseFloat(document.getElementById("expenseAmount").value),
        category: document.getElementById("expenseCategory").value,
        description: document.getElementById("expenseDescription").value,
        date: document.getElementById("expenseDate").value
    };

    try {
        const response = await fetch("http://localhost:8080/api/expense", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(expense)
        });

        if (!response.ok) throw new Error("Failed to save expense");

        console.log("Expense saved!");
        closeModal("expenseModal");
        await loadTransactions();
        showNotification('expense added successfully!', 'success');
    } catch (err) {
        console.error(err);
        alert("Could not add expense. Check backend.");
    }
    //transactions.unshift(newTransaction);
    //monthlyExpenses += amount;
    
}



function updateDashboard() {
    const { income, expenses } = calculateMonthlyTotals();

    document.querySelector('.income-amount').textContent = `$${income.toLocaleString()}`;
    document.querySelector('.expense-amount').textContent = `$${expenses.toLocaleString()}`;

    const spendingLimit = 20000;
    const percentage = (expenses / spendingLimit) * 100;

    document.querySelector('.spending-limit').textContent =
        `$${(spendingLimit - expenses).toLocaleString()}`;
    
    document.querySelector('.progress-fill').style.width =
        `${Math.min(percentage, 100)}%`;

    updateCategoryTotalsUI();
    updateHighLowUI();
    renderTrendChart();
}



function updateTransactionsTable() {
    const tbody = document.querySelector('.transactions-table tbody');
    tbody.innerHTML = '';

    const recentTransactions = transactions.slice(0,10);
    recentTransactions.forEach(transaction => {
        const row = document.createElement('tr');
        const formattedDate = new Date(transaction.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        const amountDisplay = transaction.amount > 0 
                    ? `+${transaction.amount.toLocaleString()}.00`
                    : `-${Math.abs(transaction.amount).toLocaleString()}.00`;
        
        row.innerHTML = `
                    <td>${formattedDate}</td>
                    <td>${transaction.category}</td>
                    <td style="color: ${transaction.amount > 0 ? '#10b981' : '#ef4444'}">${amountDisplay}</td>
                    <td><span class="status-success">${transaction.status}</span></td>
                    <td><button class="action-btn"><i class="fas fa-ellipsis-h"></i></button></td>
                `;
        
        tbody.appendChild(row);
    });
}


function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1001;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}


    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal('incomeModal');
            closeModal('expenseModal');
        }
        
        if (e.ctrlKey && e.key === 'i') {
            e.preventDefault();
            openIncomeModal();
        }
        
        if (e.ctrlKey && e.key === 'e') {
            e.preventDefault();
            openExpenseModal();
        }
    });

    
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            this.style.transition = 'all 0.2s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
        });
    });



function getCategoryTotals() {
    const totals = {};

    transactions.forEach(t => {
        if (t.type === "expense") {
            const cat = t.category;
            const amt = Math.abs(t.amount);
            totals[cat] = (totals[cat] || 0) + amt;
        }
    });

    return Object.entries(totals)
            .sort((a, b) => b[1] - a[1]); 
}


function getHighestSpendCategory() {
  const totals = getCategoryTotals();
  if (Object.keys(totals).length === 0) return null;

  return Object.entries(totals).sort((a, b) => b[1] - a[1])[0]; 
}

function getLowestSpendCategory() {
  const totals = getCategoryTotals();
  if (Object.keys(totals).length === 0) return null;

  return Object.entries(totals).sort((a, b) => a[1] - b[1])[0]; 
}


function getMonthlyTrend() {
  const monthly = {};

  transactions.forEach(t => {
    if (t.type === "expense") {
      const month = t.date.slice(0, 7); // "YYYY-MM"
      monthly[month] = (monthly[month] || 0) + Math.abs(t.amount);
    }
  });

  return monthly;
}



function renderTrendChart() {
    const svg = document.getElementById("trendLineChart");
    const tooltip = document.getElementById("trendTooltip");
    svg.innerHTML = "";

    const monthlyTotals = Array(12).fill(0);

    transactions.forEach(tx => {
        if (tx.type === "expense") {
            const month = new Date(tx.date).getMonth();
            monthlyTotals[month] += Math.abs(tx.amount);
        }
    });

    const maxExpense = Math.max(...monthlyTotals) || 1;
    const chartHeight = 300;
    const chartWidth = svg.clientWidth;
    const xStep = chartWidth / 11;

    const points = monthlyTotals.map((value, i) => {
        const x = i * xStep;
        const y = chartHeight - (value / maxExpense) * (chartHeight - 20);
        return { x, y, value, month: i };
    });

    // Draw path
    let path = "M" + points[0].x + " " + points[0].y;
    for (let i = 1; i < points.length; i++) {
        path += " L" + points[i].x + " " + points[i].y;
    }

    const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
    line.setAttribute("d", path);
    line.setAttribute("class", "trend-line");
    svg.appendChild(line);

    // Month names for tooltip
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    // Draw circles + add tooltip events
    points.forEach(pt => {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", pt.x);
        circle.setAttribute("cy", pt.y);
        circle.setAttribute("r", 5);
        circle.setAttribute("class", "trend-point");

        // Hover events
        circle.addEventListener("mouseenter", () => {
        tooltip.style.opacity = 1;
        tooltip.textContent = `${monthNames[pt.month]}: $${pt.value.toLocaleString()}`;
    });

    circle.addEventListener("mousemove", (e) => {
        const containerRect = svg.parentElement.getBoundingClientRect();
        tooltip.style.left = (e.clientX - containerRect.left + 12) + "px";
        tooltip.style.top = (e.clientY - containerRect.top - 20) + "px";
    });

    circle.addEventListener("mouseleave", () => {
        tooltip.style.opacity = 0;
    });


        svg.appendChild(circle);
    });
}





function updateCategoryTotalsUI() {
  const list = document.querySelector(".expense-categories");
  const totalEl = document.querySelector(".total-expenses");

  if (!list) return;

  let totals = getCategoryTotals();

 
  if (!Array.isArray(totals)) {
    totals = Object.entries(totals);
  }

  totals.sort((a, b) => b[1] - a[1]);

  const totalExpense = totals.reduce((sum, c) => sum + c[1], 0);

  if (totalEl) totalEl.textContent = `$${totalExpense.toLocaleString()}`;

  list.innerHTML = "";

  totals.forEach(([category, amount]) => {
    const color = CATEGORY_COLORS[category] || "#6b7280";

    const li = document.createElement("li");
    li.className = "expense-category";
    li.innerHTML = `
      <div class="category-info">
        <div class="category-dot" style="background:${color}"></div>
        <span>${category}</span>
      </div>
      <span>$${amount.toLocaleString()}</span>
    `;
    list.appendChild(li);
  });

  updateColorBar(totals, totalExpense);
}

function updateColorBar(totals, total) {
  const bar = document.querySelector(".color-bar");
  if (!bar) return;

  if (!Array.isArray(totals)) totals = Object.entries(totals);

  if (!total || total === 0 || totals.length === 0) {
    bar.style.background = "#e5e7eb"; 
    return;
  }


  let cumulative = 0;
  const stops = totals.map(([cat, amt]) => {
    const color = CATEGORY_COLORS[cat] || "#6b7280";
    const pct = (amt / total) * 100;
    const start = cumulative;
    const end = cumulative + pct;
    cumulative = end;
    
    return `${color} ${start.toFixed(2)}% ${Math.min(end, 100).toFixed(2)}%`;
  });


  if (cumulative < 100) {
    
    const lastIndex = stops.length - 1;
    stops[lastIndex] = stops[lastIndex].replace(/([0-9.]+)%\s*$/, "100.00%");
  }

  bar.style.background = `linear-gradient(to right, ${stops.join(", ")})`;
}



const REFERENCE_DATE = new Date("2025-12-03");


function isSameWeek(date1, date2) {
    const startOfWeek = (d) => {
        const copy = new Date(d);
        const day = copy.getDay(); 
        copy.setHours(0, 0, 0, 0);
        copy.setDate(copy.getDate() - day);
        return copy;
    };

    return startOfWeek(date1).getTime() === startOfWeek(date2).getTime();
}


function calculatePeriodTotals() {
    let daily = 0, weekly = 0, monthly = 0;

    transactions.forEach(e => {

        if (e.type !== "expense") return;

        const date = new Date(e.date);
        const amt = Math.abs(e.amount);

        // Daily
        if (
            date.getFullYear() === REFERENCE_DATE.getFullYear() &&
            date.getMonth() === REFERENCE_DATE.getMonth() &&
            date.getDate() === REFERENCE_DATE.getDate()
        ) {
            daily += amt;
        }

        // Weekly
        if (isSameWeek(date, REFERENCE_DATE)) {
            weekly += amt;
        }

        // Monthly
        if (
            date.getFullYear() === REFERENCE_DATE.getFullYear() &&
            date.getMonth() === REFERENCE_DATE.getMonth()
        ) {
            monthly += amt;
        }
    });

    return { daily, weekly, monthly };
}


function updatePeriodTotalsUI() {
    const { daily, weekly, monthly } = calculatePeriodTotals();

    document.querySelector(".period-values span:nth-child(1)").textContent =
        `$${daily.toLocaleString()}`;

    document.querySelector(".period-values span:nth-child(2)").textContent =
        `$${weekly.toLocaleString()}`;

    document.querySelector(".period-values span:nth-child(3)").textContent =
        `$${monthly.toLocaleString()}`;
}



function updateHighLowUI() {
  const high = getHighestSpendCategory();
  const low = getLowestSpendCategory();

  const highEl = document.getElementById("highestCategory");
  const lowEl = document.getElementById("lowestCategory");

  if (highEl && high) {
    highEl.textContent = `${high[0]} ($${high[1].toLocaleString()})`;
  }
  if (lowEl && low) {
    lowEl.textContent = `${low[0]} ($${low[1].toLocaleString()})`;
  }
}



  

