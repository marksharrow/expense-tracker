// --- Sounds ---
const cashSound = new Audio("./assets/cash.mp3"); // play on add
const coinSound = new Audio("./assets/coin.mp3"); // play on delete

// --- Elements ---
const form = document.getElementById("expense-form");
const nameInput = document.getElementById("expense-name");
const amountInput = document.getElementById("expense-amount");
const list = document.getElementById("expense-list");
const balanceDisplay = document.getElementById("balance");
const ctx = document.getElementById("expenseChart").getContext("2d");

let expenses = [];
let totalBalance = 0;

// --- Chart (money green theme) ---
let expenseChart = new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          "#00ff66",
          "#33cc66",
          "#66ff99",
          "#00cc44",
          "#009933",
          "#33ff77",
        ],
        borderWidth: 1,
        borderColor: "#0d1b0d",
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: { labels: { color: "#22ff55" } },
    },
  },
});

// --- Animate Balance ---
function animateBalance(newBalance) {
  let start = totalBalance;
  let end = newBalance;
  let duration = 600;
  let startTime = null;

  function update(currentTime) {
    if (!startTime) startTime = currentTime;
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const currentValue = start + (end - start) * progress;

    balanceDisplay.textContent = `$${currentValue.toFixed(2)}`;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
  totalBalance = newBalance;
}

// --- Update UI ---
function updateUI() {
  // List
  list.innerHTML = "";
  expenses.forEach((exp, index) => {
    const li = document.createElement("li");
    li.className = "expense-item";
    li.innerHTML = `
      <span>${exp.name}</span>
      <span class="expense-amount">$${exp.amount.toFixed(2)}</span>
      <button class="delete-btn" onclick="deleteExpense(${index})">✖</button>
    `;
    list.appendChild(li);
  });

  // Balance
  const newBalance = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  animateBalance(newBalance);

  // Chart
  expenseChart.data.labels = expenses.map((e) => e.name);
  expenseChart.data.datasets[0].data = expenses.map((e) => e.amount);
  expenseChart.update();
}

// --- Add Expense ---
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const amount = parseFloat(amountInput.value);

  if (!name || isNaN(amount) || amount <= 0) {
    alert("Please enter valid expense details!");
    return;
  }

  expenses.push({ name, amount });
  cashSound.currentTime = 0;
  cashSound.play();

  nameInput.value = "";
  amountInput.value = "";

  updateUI();
});

// --- Delete Expense ---
function deleteExpense(index) {
  expenses.splice(index, 1);
  coinSound.currentTime = 0;
  coinSound.play();
  updateUI();
}

// --- Initialize ---
updateUI();
