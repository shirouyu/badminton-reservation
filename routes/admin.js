// ============================================================
//  routes/admin.js — Admin panel routes (no database)
// ============================================================
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { ADMINS, COURTS, BOOKINGS, JADWAL } = require("../public/js/data");

// ── MULTER SETUP ─────────────────────────────────────────
const uploadsDir = path.join(__dirname, "../public/uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "court-" + unique + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ok = allowed.test(path.extname(file.originalname).toLowerCase()) &&
               allowed.test(file.mimetype);
    ok ? cb(null, true) : cb(new Error("Hanya file gambar yang diperbolehkan"));
  }
});

// ── AUTH ──────────────────────────────────────────────────

// POST /api/admin/login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const admin = ADMINS.find(a => a.email === email);

  if (!admin || admin.password !== password) {
    return res.status(401).json({
      success: false,
      message: "Email atau password salah"
    });
  }

  res.json({
    success: true,
    admin: {
      id: admin.id,
      username: admin.username,
      email: admin.email
    }
  });
});

// ── STATS ─────────────────────────────────────────────────

// GET /api/admin/stats
router.get("/stats", (req, res) => {
  const totalBookings = BOOKINGS.length;
  const pendingBookings = BOOKINGS.filter(b => b.status === "Pending").length;
  const confirmedBookings = BOOKINGS.filter(b => b.status === "Lunas").length;
  const totalRevenue = BOOKINGS
    .filter(b => b.status === "Lunas")
    .reduce((sum, b) => sum + b.total_harga, 0);

  res.json({
    success: true,
    stats: { totalBookings, pendingBookings, confirmedBookings, totalRevenue }
  });
});

// ── BOOKINGS ──────────────────────────────────────────────

// GET /api/admin/bookings
router.get("/bookings", (req, res) => {
  const result = [];

  BOOKINGS.forEach(booking => {
    const details = booking.details || [];

    details.forEach(detail => {
      const court = COURTS.find(c => c.id === detail.lapangan_id);
      const jadwal = JADWAL.find(j => j.id === detail.jadwal_id);

      result.push({
        booking_id: booking.id,
        nama_pemesan: booking.nama_pemesan,
        email: booking.email,
        no_hp: booking.no_hp,
        nama_lapangan: court ? court.nama : "-",
        lokasi: court ? court.lokasi : "-",
        tanggal: jadwal ? jadwal.tanggal : "-",
        jam: jadwal ? jadwal.jam : "-",
        metode_pembayaran: booking.metode_pembayaran,
        total_harga: booking.total_harga,
        status: booking.status,
        created_at: booking.created_at
      });
    });
  });

  // Sort by created_at DESC
  result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  res.json({ success: true, bookings: result });
});

// PUT /api/admin/bookings/:id — update status
router.put("/bookings/:id", (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;

  if (!status || !["Pending", "Lunas", "Batal"].includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Status tidak valid"
    });
  }

  const index = BOOKINGS.findIndex(b => b.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Booking tidak ditemukan"
    });
  }

  BOOKINGS[index].status = status;

  res.json({ success: true, message: "Status berhasil diubah" });
});

// DELETE /api/admin/bookings/:id
router.delete("/bookings/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = BOOKINGS.findIndex(b => b.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Booking tidak ditemukan"
    });
  }

  BOOKINGS.splice(index, 1);
  res.json({ success: true, message: "Booking berhasil dihapus" });
});

// ── COURTS (LAPANGAN) ─────────────────────────────────────

// GET /api/admin/lapangan — for frontend client
router.get("/lapangan", (req, res) => {
  const result = COURTS.map(court => {
    const schedules = JADWAL
      .filter(j => j.lapangan_id === court.id)
      .map(j => ({ id: j.id, label: j.jam }));

    return {
      id: court.id,
      name: court.nama,
      tag: court.tag,
      tagColor: court.tag_color,
      price: court.harga,
      image: court.gambar,
      description: court.deskripsi,
      location: court.lokasi,
      available: court.tersedia === 1,
      fasilitas: court.fasilitas,
      schedules
    };
  });

  res.json(result);
});

// GET /api/admin/courts — admin view with slot counts
router.get("/courts", (req, res) => {
  const courts = COURTS.map(court => {
    const totalSlots = JADWAL.filter(j => j.lapangan_id === court.id).length;
    const bookedSlots = JADWAL.filter(
      j => j.lapangan_id === court.id && j.status === "dibooking"
    ).length;

    return {
      ...court,
      total_slots: totalSlots,
      booked_slots: bookedSlots,
      is_full: bookedSlots >= totalSlots && totalSlots > 0
    };
  });

  res.json({ success: true, courts });
});

// POST /api/admin/courts — add new court
router.post("/courts", upload.single("gambar"), (req, res) => {
  const { nama, lokasi, harga, tag, tag_color, deskripsi } = req.body;

  if (!nama || !lokasi || !harga) {
    return res.status(400).json({
      success: false,
      message: "Nama, lokasi, dan harga harus diisi"
    });
  }

  const newId = COURTS.length > 0
    ? Math.max(...COURTS.map(c => c.id)) + 1
    : 1;

  const gambar = req.file ? `/uploads/${req.file.filename}` : "";

  const newCourt = {
    id: newId,
    nama,
    lokasi,
    harga: parseInt(harga),
    kuota: 10,
    gambar,
    tag: tag || "Reguler",
    tag_color: tag_color || "green",
    deskripsi: deskripsi || "",
    tersedia: 1,
    fasilitas: []
  };

  COURTS.push(newCourt);

  res.json({
    success: true,
    message: "Lapangan berhasil ditambahkan",
    id: newId
  });
});

// PUT /api/admin/courts/:id — update court
router.put("/courts/:id", upload.single("gambar"), (req, res) => {
  const id = Number(req.params.id);
  const index = COURTS.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Lapangan tidak ditemukan"
    });
  }

  const { nama, lokasi, harga, tag, tag_color, deskripsi } = req.body;

  if (nama) COURTS[index].nama = nama;
  if (lokasi) COURTS[index].lokasi = lokasi;
  if (harga) COURTS[index].harga = parseInt(harga);
  if (tag) COURTS[index].tag = tag;
  if (tag_color) COURTS[index].tag_color = tag_color;
  if (deskripsi) COURTS[index].deskripsi = deskripsi;
  if (req.file) COURTS[index].gambar = `/uploads/${req.file.filename}`;

  res.json({ success: true, message: "Lapangan berhasil diupdate" });
});

// DELETE /api/admin/courts/:id
router.delete("/courts/:id", (req, res) => {
  const id = Number(req.params.id);

  // Check for active bookings
  const hasActiveBooking = BOOKINGS.some(booking =>
    booking.details && booking.details.some(d => d.lapangan_id === id)
  );

  if (hasActiveBooking) {
    return res.status(400).json({
      success: false,
      message: "Tidak dapat menghapus lapangan yang masih memiliki booking aktif"
    });
  }

  const index = COURTS.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Lapangan tidak ditemukan"
    });
  }

  COURTS.splice(index, 1);
  res.json({ success: true, message: "Lapangan berhasil dihapus" });
});

// ── ADMIN USER MANAGEMENT ────────────────────────────────

// GET /api/admin/users
router.get("/users", (req, res) => {
  const users = ADMINS.map(a => ({
    id: a.id,
    username: a.username,
    email: a.email,
    created_at: a.created_at
  }));
  res.json({ success: true, users });
});

// POST /api/admin/users — add admin
router.post("/users", (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Username, email, dan password harus diisi"
    });
  }

  const exists = ADMINS.find(a => a.email === email);
  if (exists) {
    return res.status(400).json({
      success: false,
      message: "Email sudah digunakan"
    });
  }

  const newId = ADMINS.length > 0
    ? Math.max(...ADMINS.map(a => a.id)) + 1
    : 1;

  ADMINS.push({ id: newId, username, email, password, created_at: new Date() });

  res.json({ success: true, message: "Admin berhasil ditambahkan", id: newId });
});

// PUT /api/admin/users/:id
router.put("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = ADMINS.findIndex(a => a.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Admin tidak ditemukan"
    });
  }

  if (req.body.username) ADMINS[index].username = req.body.username;
  if (req.body.email)    ADMINS[index].email    = req.body.email;
  if (req.body.password) ADMINS[index].password = req.body.password;

  res.json({ success: true, message: "Admin berhasil diupdate" });
});

// DELETE /api/admin/users/:id
router.delete("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = ADMINS.findIndex(a => a.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Admin tidak ditemukan"
    });
  }

  ADMINS.splice(index, 1);
  res.json({ success: true, message: "Admin berhasil dihapus" });
});

module.exports = router;