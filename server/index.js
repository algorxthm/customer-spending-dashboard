import express from "express";

const app = express();
app.use(express.json());

// ----------------------
// Mock Data (shape matches brief) :contentReference[oaicite:1]{index=1}
// ----------------------
const customers = {
  "12345": {
    customerId: "12345",
    name: "John Doe",
    email: "john.doe@email.com",
    joinDate: "2023-01-15",
    accountType: "premium",
    totalSpent: 15420.5,
    currency: "ZAR",
  },
  "67890": {
    customerId: "67890",
    name: "Jane Smith",
    email: "jane.smith@email.com",
    joinDate: "2022-06-10",
    accountType: "standard",
    totalSpent: 9820.15,
    currency: "ZAR",
  },
};

const categoryMeta = [
  { name: "Groceries", color: "#FF6B6B", icon: "shopping-cart" },
  { name: "Entertainment", color: "#4ECDC4", icon: "film" },
  { name: "Transportation", color: "#45B7D1", icon: "car" },
  { name: "Dining", color: "#F7DC6F", icon: "utensils" },
  { name: "Shopping", color: "#BB8FCE", icon: "shopping-bag" },
  { name: "Utilities", color: "#85C1E9", icon: "zap" },
];

function daysAgoISO(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  // keep it stable-ish
  d.setHours(10, 0, 0, 0);
  return d.toISOString();
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function parseDateOnly(s) {
  // YYYY-MM-DD -> Date at 00:00
  if (!s) return null;
  const d = new Date(`${s}T00:00:00.000Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function inRange(dateIso, startDate, endDate) {
  const d = new Date(dateIso);
  if (Number.isNaN(d.getTime())) return false;

  const start = parseDateOnly(startDate);
  const end = parseDateOnly(endDate);

  if (start && d < start) return false;
  if (end) {
    // inclusive end date -> add 1 day
    const e = new Date(end);
    e.setUTCDate(e.getUTCDate() + 1);
    if (d >= e) return false;
  }
  return true;
}

function stableTransactions(customerId) {
  // deterministic-ish list per customer
  const base = customerId === "67890" ? 2000 : 1000;

  const merchants = [
    "Pick n Pay",
    "Checkers",
    "Netflix",
    "Uber",
    "Shell",
    "Mr Price",
    "Woolworths",
    "Eskom",
    "Vodacom",
    "Nando's",
    "KFC",
    "Dis-Chem",
  ];

  const paymentMethods = ["Credit Card", "Debit Card", "Debit Order", "EFT"];

  const rows = [];
  for (let i = 1; i <= 220; i++) {
    const meta = categoryMeta[i % categoryMeta.length];
    const amountBase = (i % 7) * 37 + (i % 13) * 11 + 50;
    const amount = Number((amountBase + (customerId === "67890" ? 15 : 0)).toFixed(2));
    const days = (i % 95) + 1;

    rows.push({
      id: `txn_${base + i}`,
      date: daysAgoISO(days),
      merchant: merchants[i % merchants.length],
      category: meta.name,
      amount,
      description: `Transaction ${i}`,
      paymentMethod: paymentMethods[i % paymentMethods.length],
      icon: meta.icon,
      categoryColor: meta.color,
    });
  }
  return rows;
}

const txCache = new Map();
function getTransactions(customerId) {
  if (!txCache.has(customerId)) txCache.set(customerId, stableTransactions(customerId));
  return txCache.get(customerId);
}

function getPeriodRange(period) {
  const now = new Date();
  const end = new Date(now);
  const start = new Date(now);

  const p = period || "30d";
  if (p === "7d") start.setDate(start.getDate() - 7);
  else if (p === "30d") start.setDate(start.getDate() - 30);
  else if (p === "90d") start.setDate(start.getDate() - 90);
  else if (p === "1y") start.setFullYear(start.getFullYear() - 1);
  else start.setDate(start.getDate() - 30);

  return { start, end };
}

function sumByCategory(transactions) {
  const totals = new Map();
  for (const t of transactions) {
    totals.set(t.category, (totals.get(t.category) || 0) + t.amount);
  }
  const totalAmount = Array.from(totals.values()).reduce((a, b) => a + b, 0);

  const categories = Array.from(totals.entries())
    .map(([name, amount]) => {
      const meta = categoryMeta.find((m) => m.name === name) || { color: "#94a3b8", icon: "tag" };
      const pct = totalAmount > 0 ? (amount / totalAmount) * 100 : 0;
      const txCount = transactions.filter((t) => t.category === name).length;
      return {
        name,
        amount: Number(amount.toFixed(2)),
        percentage: Number(pct.toFixed(1)),
        transactionCount: txCount,
        color: meta.color,
        icon: meta.icon,
      };
    })
    .sort((a, b) => b.amount - a.amount);

  return { totalAmount: Number(totalAmount.toFixed(2)), categories };
}

// ----------------------
// Routes :contentReference[oaicite:2]{index=2}
// ----------------------
app.get("/api/customers/:customerId/profile", (req, res) => {
  const { customerId } = req.params;
  const c = customers[customerId];
  if (!c) return res.status(404).json({ message: "Customer not found" });
  res.json(c);
});

app.get("/api/customers/:customerId/spending/summary", (req, res) => {
  const { customerId } = req.params;
  const period = req.query.period || "30d";

  const all = getTransactions(customerId);
  const { start, end } = getPeriodRange(period);

  const current = all.filter((t) => {
    const d = new Date(t.date);
    return d >= start && d <= end;
  });

  const totalSpent = current.reduce((a, b) => a + b.amount, 0);
  const transactionCount = current.length;
  const averageTransaction = transactionCount ? totalSpent / transactionCount : 0;

  const { categories } = sumByCategory(current);
  const topCategory = categories[0]?.name || "—";

  // previous period (same length)
  const prevEnd = new Date(start);
  const prevStart = new Date(start);
  const lengthDays = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
  prevStart.setDate(prevStart.getDate() - lengthDays);

  const prev = all.filter((t) => {
    const d = new Date(t.date);
    return d >= prevStart && d <= prevEnd;
  });

  const prevSpent = prev.reduce((a, b) => a + b.amount, 0);
  const prevCount = prev.length;

  const spentChange = prevSpent === 0 ? 0 : ((totalSpent - prevSpent) / prevSpent) * 100;
  const transactionChange = prevCount === 0 ? 0 : ((transactionCount - prevCount) / prevCount) * 100;

  res.json({
    period,
    totalSpent: Number(totalSpent.toFixed(2)),
    transactionCount,
    averageTransaction: Number(averageTransaction.toFixed(2)),
    topCategory,
    comparedToPrevious: {
      spentChange: Number(spentChange.toFixed(1)),
      transactionChange: Number(transactionChange.toFixed(1)),
    },
  });
});

app.get("/api/customers/:customerId/spending/categories", (req, res) => {
  const { customerId } = req.params;
  const period = req.query.period || "30d";
  const { start, end } = getPeriodRange(period);

  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  const all = getTransactions(customerId);
  const base = all.filter((t) => {
    const d = new Date(t.date);
    return d >= start && d <= end;
  });

  const filtered = base.filter((t) => inRange(t.date, startDate, endDate));

  const { totalAmount, categories } = sumByCategory(filtered);

  const responseStart = startDate || start.toISOString().slice(0, 10);
  const responseEnd = endDate || end.toISOString().slice(0, 10);

  res.json({
    dateRange: {
      startDate: responseStart,
      endDate: responseEnd,
    },
    totalAmount,
    categories,
  });
});

app.get("/api/customers/:customerId/spending/trends", (req, res) => {
  const { customerId } = req.params;
  const months = clamp(Number(req.query.months || 12), 1, 24);

  const all = getTransactions(customerId);

  // Group by month YYYY-MM over last N months
  const now = new Date();
  const trends = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    const yyyy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
    const key = `${yyyy}-${mm}`;

    const monthStart = new Date(Date.UTC(yyyy, d.getUTCMonth(), 1));
    const monthEnd = new Date(Date.UTC(yyyy, d.getUTCMonth() + 1, 1));

    const tx = all.filter((t) => {
      const td = new Date(t.date);
      return td >= monthStart && td < monthEnd;
    });

    const totalSpent = tx.reduce((a, b) => a + b.amount, 0);
    const transactionCount = tx.length;
    const averageTransaction = transactionCount ? totalSpent / transactionCount : 0;

    trends.push({
      month: key,
      totalSpent: Number(totalSpent.toFixed(2)),
      transactionCount,
      averageTransaction: Number(averageTransaction.toFixed(2)),
    });
  }

  res.json({ trends });
});

app.get("/api/customers/:customerId/transactions", (req, res) => {
  const { customerId } = req.params;

  const limit = clamp(Number(req.query.limit || 20), 1, 100);
  const offset = Math.max(0, Number(req.query.offset || 0));
  const category = req.query.category;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  const sortBy = req.query.sortBy || "date_desc";

  let rows = [...getTransactions(customerId)];

  if (category) rows = rows.filter((t) => t.category === category);
  if (startDate || endDate) rows = rows.filter((t) => inRange(t.date, startDate, endDate));

  // sorting per brief :contentReference[oaicite:3]{index=3}
  rows.sort((a, b) => {
    const ad = new Date(a.date).getTime();
    const bd = new Date(b.date).getTime();

    if (sortBy === "date_asc") return ad - bd;
    if (sortBy === "amount_desc") return b.amount - a.amount;
    if (sortBy === "amount_asc") return a.amount - b.amount;
    // default date_desc
    return bd - ad;
  });

  const total = rows.length;
  const page = rows.slice(offset, offset + limit);

  res.json({
    transactions: page,
    pagination: {
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    },
  });
});

app.get("/api/customers/:customerId/goals", (req, res) => {
  const goals = [
    {
      id: "goal_001",
      category: "Entertainment",
      monthlyBudget: 1000.0,
      currentSpent: 650.3,
      percentageUsed: 65.03,
      daysRemaining: 12,
      status: "on_track",
    },
    {
      id: "goal_002",
      category: "Groceries",
      monthlyBudget: 1500.0,
      currentSpent: 1450.8,
      percentageUsed: 96.72,
      daysRemaining: 12,
      status: "warning",
    },
  ];

  res.json({ goals });
});

app.get("/api/customers/:customerId/filters", (req, res) => {
  res.json({
    categories: categoryMeta,
    dateRangePresets: [
      { label: "Last 7 days", value: "7d" },
      { label: "Last 30 days", value: "30d" },
      { label: "Last 90 days", value: "90d" },
      { label: "Last year", value: "1y" },
    ],
  });
});

// Health
app.get("/api/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Mock API running on http://localhost:${PORT}`));
