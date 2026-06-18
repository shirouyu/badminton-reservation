// ============================================================
//  DATA.JS — In-memory data store (no database)
// ============================================================

const ADMINS = [
  {
    id: 1,
    username: "admin",
    password: "admin123",
    email: "admin@smashcourt.com",
    created_at: new Date("2026-06-16T18:03:45Z")
  }
];

const COURTS = [
  {
    id: 1,
    nama: "Lapangan A",
    lokasi: "Lantai 2 – Gedung Utama",
    harga: 75000,
    kuota: 10,
    gambar: "images/lapangan-a.jpg",
    tag: "Premium",
    tag_color: "gold",
    deskripsi: "Lapangan premium berstandar BWF dengan lantai kayu maple berkualitas tinggi. Pencahayaan LED 1000 lux memastikan visibilitas sempurna di setiap sudut.",
    tersedia: 1,
    fasilitas: ["Lantai Kayu Maple", "LED 1000 Lux", "AC Split", "Loker", "WiFi Gratis", "CCTV 24 Jam"]
  },
  {
    id: 2,
    nama: "Lapangan B",
    lokasi: "Lantai 2 – Gedung Utama",
    harga: 55000,
    kuota: 10,
    gambar: "images/lapangan-b.jpg",
    tag: "Reguler",
    tag_color: "green",
    deskripsi: "Lapangan reguler dengan lantai vinyl anti-slip berkualitas baik. Ideal untuk latihan rutin maupun pertandingan antar teman.",
    tersedia: 1,
    fasilitas: ["Lantai Vinyl", "LED 800 Lux", "Kipas Angin", "Loker", "WiFi Gratis"]
  },
  {
    id: 3,
    nama: "Lapangan C",
    lokasi: "Lantai 3 – Gedung Utama",
    harga: 100000,
    kuota: 10,
    gambar: "images/lapangan-c.jpg",
    tag: "VIP",
    tag_color: "purple",
    deskripsi: "Lapangan VIP eksklusif dengan ruang ganti pribadi, sound system, dan kaca tempered satu sisi untuk pelatih. Pengalaman bermain terbaik.",
    tersedia: 1,
    fasilitas: ["Lantai Kayu Maple", "LED 1200 Lux", "AC Central", "Ruang Ganti Pribadi", "Sound System", "Kaca Monitor"]
  },
  {
    id: 4,
    nama: "Lapangan D",
    lokasi: "Lantai 1 – Gedung B",
    harga: 55000,
    kuota: 10,
    gambar: "images/lapangan-d.jpg",
    tag: "Reguler",
    tag_color: "green",
    deskripsi: "Lapangan reguler yang luas dengan ventilasi alami yang baik. Cocok untuk sesi pagi dan latihan tim.",
    tersedia: 1,
    fasilitas: ["Lantai Vinyl", "LED 800 Lux", "Ventilasi Alami", "Bangku Penonton", "WiFi Gratis"]
  },
  {
    id: 5,
    nama: "Lapangan E",
    lokasi: "Lantai 1 – Gedung B",
    harga: 75000,
    kuota: 10,
    gambar: "images/lapangan-e.jpg",
    tag: "Premium",
    tag_color: "gold",
    deskripsi: "Lapangan premium dengan sistem pencahayaan otomatis dan lantai kayu premium. Dilengkapi papan skor digital.",
    tersedia: 1,
    fasilitas: ["Lantai Kayu", "LED 1000 Lux", "Papan Skor Digital", "AC Split", "Loker", "WiFi Gratis"]
  },
  {
    id: 6,
    nama: "Lapangan F",
    lokasi: "Area Outdoor – Belakang Gedung",
    harga: 40000,
    kuota: 10,
    gambar: "images/lapangan-f.jpg",
    tag: "Outdoor",
    tag_color: "blue",
    deskripsi: "Lapangan outdoor dengan atap canopy anti-hujan. Sensasi bermain di udara segar dengan sinar matahari pagi yang menyegarkan.",
    tersedia: 1,
    fasilitas: ["Lantai Semen Khusus", "Atap Canopy", "Lampu Malam", "Area Parkir", "Kantin Terdekat"]
  }
];

// Jadwal slots per lapangan (from SQL jadwal table, 8 slots per court for date 2026-06-20)
// id starts at 15 matching original SQL
const JADWAL = [
  // Lapangan 1
  { id: 15, lapangan_id: 1, tanggal: "2026-06-20", jam: "08:00-09:00", status: "tersedia" },
  { id: 21, lapangan_id: 1, tanggal: "2026-06-20", jam: "09:00-10:00", status: "tersedia" },
  { id: 27, lapangan_id: 1, tanggal: "2026-06-20", jam: "10:00-11:00", status: "tersedia" },
  { id: 33, lapangan_id: 1, tanggal: "2026-06-20", jam: "11:00-12:00", status: "tersedia" },
  { id: 39, lapangan_id: 1, tanggal: "2026-06-20", jam: "12:00-13:00", status: "tersedia" },
  { id: 45, lapangan_id: 1, tanggal: "2026-06-20", jam: "13:00-14:00", status: "tersedia" },
  { id: 51, lapangan_id: 1, tanggal: "2026-06-20", jam: "14:00-15:00", status: "tersedia" },
  { id: 57, lapangan_id: 1, tanggal: "2026-06-20", jam: "15:00-16:00", status: "tersedia" },
  // Lapangan 2
  { id: 16, lapangan_id: 2, tanggal: "2026-06-20", jam: "08:00-09:00", status: "tersedia" },
  { id: 22, lapangan_id: 2, tanggal: "2026-06-20", jam: "09:00-10:00", status: "tersedia" },
  { id: 28, lapangan_id: 2, tanggal: "2026-06-20", jam: "10:00-11:00", status: "tersedia" },
  { id: 34, lapangan_id: 2, tanggal: "2026-06-20", jam: "11:00-12:00", status: "tersedia" },
  { id: 40, lapangan_id: 2, tanggal: "2026-06-20", jam: "12:00-13:00", status: "tersedia" },
  { id: 46, lapangan_id: 2, tanggal: "2026-06-20", jam: "13:00-14:00", status: "tersedia" },
  { id: 52, lapangan_id: 2, tanggal: "2026-06-20", jam: "14:00-15:00", status: "tersedia" },
  { id: 58, lapangan_id: 2, tanggal: "2026-06-20", jam: "15:00-16:00", status: "tersedia" },
  // Lapangan 3
  { id: 17, lapangan_id: 3, tanggal: "2026-06-20", jam: "08:00-09:00", status: "tersedia" },
  { id: 23, lapangan_id: 3, tanggal: "2026-06-20", jam: "09:00-10:00", status: "tersedia" },
  { id: 29, lapangan_id: 3, tanggal: "2026-06-20", jam: "10:00-11:00", status: "tersedia" },
  { id: 35, lapangan_id: 3, tanggal: "2026-06-20", jam: "11:00-12:00", status: "tersedia" },
  { id: 41, lapangan_id: 3, tanggal: "2026-06-20", jam: "12:00-13:00", status: "tersedia" },
  { id: 47, lapangan_id: 3, tanggal: "2026-06-20", jam: "13:00-14:00", status: "tersedia" },
  { id: 53, lapangan_id: 3, tanggal: "2026-06-20", jam: "14:00-15:00", status: "tersedia" },
  { id: 59, lapangan_id: 3, tanggal: "2026-06-20", jam: "15:00-16:00", status: "tersedia" },
  // Lapangan 4
  { id: 18, lapangan_id: 4, tanggal: "2026-06-20", jam: "08:00-09:00", status: "tersedia" },
  { id: 24, lapangan_id: 4, tanggal: "2026-06-20", jam: "09:00-10:00", status: "tersedia" },
  { id: 30, lapangan_id: 4, tanggal: "2026-06-20", jam: "10:00-11:00", status: "tersedia" },
  { id: 36, lapangan_id: 4, tanggal: "2026-06-20", jam: "11:00-12:00", status: "tersedia" },
  { id: 42, lapangan_id: 4, tanggal: "2026-06-20", jam: "12:00-13:00", status: "tersedia" },
  { id: 48, lapangan_id: 4, tanggal: "2026-06-20", jam: "13:00-14:00", status: "tersedia" },
  { id: 54, lapangan_id: 4, tanggal: "2026-06-20", jam: "14:00-15:00", status: "tersedia" },
  { id: 60, lapangan_id: 4, tanggal: "2026-06-20", jam: "15:00-16:00", status: "tersedia" },
  // Lapangan 5
  { id: 19, lapangan_id: 5, tanggal: "2026-06-20", jam: "08:00-09:00", status: "tersedia" },
  { id: 25, lapangan_id: 5, tanggal: "2026-06-20", jam: "09:00-10:00", status: "tersedia" },
  { id: 31, lapangan_id: 5, tanggal: "2026-06-20", jam: "10:00-11:00", status: "tersedia" },
  { id: 37, lapangan_id: 5, tanggal: "2026-06-20", jam: "11:00-12:00", status: "tersedia" },
  { id: 43, lapangan_id: 5, tanggal: "2026-06-20", jam: "12:00-13:00", status: "tersedia" },
  { id: 49, lapangan_id: 5, tanggal: "2026-06-20", jam: "13:00-14:00", status: "tersedia" },
  { id: 55, lapangan_id: 5, tanggal: "2026-06-20", jam: "14:00-15:00", status: "tersedia" },
  { id: 61, lapangan_id: 5, tanggal: "2026-06-20", jam: "15:00-16:00", status: "tersedia" },
  // Lapangan 6
  { id: 20, lapangan_id: 6, tanggal: "2026-06-20", jam: "08:00-09:00", status: "tersedia" },
  { id: 26, lapangan_id: 6, tanggal: "2026-06-20", jam: "09:00-10:00", status: "tersedia" },
  { id: 32, lapangan_id: 6, tanggal: "2026-06-20", jam: "10:00-11:00", status: "tersedia" },
  { id: 38, lapangan_id: 6, tanggal: "2026-06-20", jam: "11:00-12:00", status: "tersedia" },
  { id: 44, lapangan_id: 6, tanggal: "2026-06-20", jam: "12:00-13:00", status: "tersedia" },
  { id: 50, lapangan_id: 6, tanggal: "2026-06-20", jam: "13:00-14:00", status: "tersedia" },
  { id: 56, lapangan_id: 6, tanggal: "2026-06-20", jam: "14:00-15:00", status: "tersedia" },
  { id: 62, lapangan_id: 6, tanggal: "2026-06-20", jam: "15:00-16:00", status: "tersedia" }
];

const BOOKINGS = [
  {
    id: 1,
    nama_pemesan: "Budi Santoso",
    email: "budi@gmail.com",
    no_hp: "08123456789",
    metode_pembayaran: "Transfer Bank",
    total_harga: 50000,
    status: "Lunas",
    created_at: new Date("2026-06-16T18:03:45Z"),
    details: [{ lapangan_id: 1, jadwal_id: 15 }]
  },
  {
    id: 2,
    nama_pemesan: "",
    email: null,
    no_hp: null,
    metode_pembayaran: "qris",
    total_harga: 75000,
    status: "Lunas",
    created_at: new Date("2026-06-16T18:43:07Z"),
    details: [{ lapangan_id: 1, jadwal_id: 15 }]
  }
];

const CART = [];

const PAYMENTS = [];

module.exports = {
  ADMINS,
  COURTS,
  JADWAL,
  BOOKINGS,
  CART,
  PAYMENTS
};

// Generate 8 schedule slots per court, 08:00 – 15:00 (60 min each)
function generateSchedules(courtId) {
  const base = 8; // 08:00
  return Array.from({ length: 8 }, (_, i) => {
    const startH = base + i;
    const endH = startH + 1;
    const fmt = (h) => `${String(h).padStart(2, "0")}:00`;
    return {
      id: `${courtId}-slot-${i}`,
      courtId,
      label: `${fmt(startH)} – ${fmt(endH)}`,
      start: fmt(startH),
      end: fmt(endH),
    };
  });
}

COURTS.forEach((c) => {
  c.schedules = generateSchedules(c.id);
});