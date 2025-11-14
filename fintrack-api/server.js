import express from "express";
import cors from "cors";
import fs from "fs";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // your Vue app URL
    credentials: true, // allow cookies
  })
);
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

// Helpers
const getUsers = () => JSON.parse(fs.readFileSync("./data/users.json", "utf8"));
const saveUsers = users =>
  fs.writeFileSync("./data/users.json", JSON.stringify(users, null, 2));
const saveTransactions = transactions =>
  fs.writeFileSync(
    "./data/transactions.json",
    JSON.stringify(transactions, null, 2)
  );
// ---------------------- AUTH ROUTES ---------------------- //

// Register
app.post("/api/auth/register", async (req, res) => {
  const { email, password } = req.body;
  const users = getUsers();
  const exists = users.find(u => u.email === email);

  if (exists) return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: Date.now(), email, password: hashedPassword };
  users.push(newUser);
  saveUsers(users);

  res.status(201).json({ message: "User registered successfully" });
});

// Login
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const users = getUsers();
  const user = users.find(u => u.email === email);

  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(401).json({ message: "Invalid credentials password" });

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "2h",
  });

  // Store token in HTTP-only cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: false, // set to true in production with HTTPS
    sameSite: "lax",
    maxAge: 2 * 60 * 60 * 1000, // 2 hours
  });

  res.json({ message: "Login successful", user: { email: user.email } });
});

// Logout
app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

// Middleware to verify token
const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ---------------------- PROTECTED ROUTE EXAMPLE ---------------------- //

app.get("/api/auth/profile", authenticate, (req, res) => {
  res.json({ message: "Authenticated user", user: req.user });
});

// ---------------------- EXAMPLE FINANCE ROUTES ---------------------- //
const getTransactions = () =>
  JSON.parse(fs.readFileSync("./data/transactions.json", "utf8"));

app.get("/api/transactions", authenticate, (req, res) => {
  res.json(getTransactions());
});

// GET /api/transactions/search?query=value
app.get("/api/transactions/search", authenticate, (req, res) => {
  const transactions = getTransactions();
  const { query, type, minAmount, maxAmount, startDate, endDate } = req.query;
  // Filter transactions based on query params
  let results = transactions;
  if (query) {
    results = results.filter(
      t =>
        t.category?.toLowerCase().includes(query.toLowerCase())
    );
  }
  if (type) {
    results = results.filter(t => t.type === type); // e.g., "income" or "expense"
  }
  if (minAmount) {
    results = results.filter(t => Number(t.amount) >= Number(minAmount));
  }
  if (maxAmount) {
    results = results.filter(t => Number(t.amount) <= Number(maxAmount));
  }
  if (startDate) {
    results = results.filter(t => new Date(t.date) >= new Date(startDate));
  }
  if (endDate) {
    results = results.filter(t => new Date(t.date) <= new Date(endDate));
  }
  res.json(results);
});

app.post("/api/transactions", authenticate, (req, res) => {
  const transactions = getTransactions();
  const newTransaction = {
    id: Date.now(),
    ...req.body,
  };
  transactions.push(newTransaction);
  saveTransactions(transactions);
  res.status(201).json(newTransaction);
});

// PUT /api/transactions/:id
app.put("/api/transactions/:id", authenticate, (req, res) => {
  const transactions = getTransactions();
  const id = Number(req.params.id);
  const index = transactions.findIndex(t => t.id === id);

  if (index === -1)
    return res.status(404).json({ message: "Transaction not found" });

  // Merge updates from request body
  transactions[index] = { ...transactions[index], ...req.body };
  saveTransactions(transactions);

  res.json(transactions[index]);
});

// DELETE /api/transactions/:id
app.delete("/api/transactions/:id", authenticate, (req, res) => {
  const transactions = getTransactions();
  const id = Number(req.params.id);
  const filtered = transactions.filter(t => t.id !== id);

  if (transactions.length === filtered.length)
    return res.status(404).json({ message: "Transaction not found" });

  saveTransactions(filtered);
  res.json({ message: "Transaction deleted successfully" });
});

app.get("/", (req, res) => {
  res.send("💰 FinTrack API with Auth is running...");
});

app.listen(PORT, () => console.log(`✅ FinTrack API running on port ${PORT}`));
