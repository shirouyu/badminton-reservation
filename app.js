// ============================================================
//  app.js — Express server entry point (no database)
// ============================================================
const express = require("express");
const path = require("path");

const app = express();

// ── MIDDLEWARE ───────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// ── ROUTES ───────────────────────────────────────────────
const adminRouter   = require("./routes/admin");
const lapanganRouter = require("./routes/lapangan");
const bookingRouter = require("./routes/booking");
const cartRouter    = require("./routes/cart");
const paymentRouter = require("./routes/payment");

app.use("/api/admin",   adminRouter);
app.use("/api/lapangan", lapanganRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/cart",    cartRouter);
app.use("/api/payment", paymentRouter);

app.get("/admin/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "admin-login.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "admin.html"));
});

app.get("/history", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "history.html"));
});

// ── CATCH-ALL → serve index.html ─────────────────────────
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// ── START ─────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SmashCourt berjalan di http://localhost:${PORT}`);
});