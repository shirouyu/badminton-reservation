// ============================================================
//  DATA.JS — Static data for SmashCourt reservation app
// ============================================================

const COURTS = [
  {
    id: 1,
    name: "Lapangan A",
    tag: "Premium",
    tagColor: "gold",
    price: 75000,
    image: "images/lapangan-a.jpg",
    description:
      "Lapangan premium berstandar BWF dengan lantai kayu maple berkualitas tinggi. Pencahayaan LED 1000 lux memastikan visibilitas sempurna di setiap sudut.",
    fasilitas: ["Lantai Kayu Maple", "LED 1000 Lux", "AC Split", "Loker", "WiFi Gratis", "CCTV 24 Jam"],
    location: "Lantai 2 – Gedung Utama",
    available: true,
  },
  {
    id: 2,
    name: "Lapangan B",
    tag: "Reguler",
    tagColor: "green",
    price: 55000,
    image: "images/lapangan-b.jpg",
    description:
      "Lapangan reguler dengan lantai vinyl anti-slip berkualitas baik. Ideal untuk latihan rutin maupun pertandingan antar teman.",
    fasilitas: ["Lantai Vinyl", "LED 800 Lux", "Kipas Angin", "Loker", "WiFi Gratis"],
    location: "Lantai 2 – Gedung Utama",
    available: true,
  },
  {
    id: 3,
    name: "Lapangan C",
    tag: "VIP",
    tagColor: "purple",
    price: 100000,
    image: "images/lapangan-c.jpg",
    description:
      "Lapangan VIP eksklusif dengan ruang ganti pribadi, sound system, dan kaca tempered satu sisi untuk pelatih. Pengalaman bermain terbaik.",
    fasilitas: ["Lantai Kayu Maple", "LED 1200 Lux", "AC Central", "Ruang Ganti Pribadi", "Sound System", "Kaca Monitor"],
    location: "Lantai 3 – Gedung Utama",
    available: true,
  },
  {
    id: 4,
    name: "Lapangan D",
    tag: "Reguler",
    tagColor: "green",
    price: 55000,
    image: "images/lapangan-d.jpg",
    description:
      "Lapangan reguler yang luas dengan ventilasi alami yang baik. Cocok untuk sesi pagi dan latihan tim.",
    fasilitas: ["Lantai Vinyl", "LED 800 Lux", "Ventilasi Alami", "Bangku Penonton", "WiFi Gratis"],
    location: "Lantai 1 – Gedung B",
    available: true,
  },
  {
    id: 5,
    name: "Lapangan E",
    tag: "Premium",
    tagColor: "gold",
    price: 75000,
    image: "images/lapangan-e.jpg",
    description:
      "Lapangan premium dengan sistem pencahayaan otomatis dan lantai kayu premium. Dilengkapi papan skor digital.",
    fasilitas: ["Lantai Kayu", "LED 1000 Lux", "Papan Skor Digital", "AC Split", "Loker", "WiFi Gratis"],
    location: "Lantai 1 – Gedung B",
    available: true,
  },
  {
    id: 6,
    name: "Lapangan F",
    tag: "Outdoor",
    tagColor: "blue",
    price: 40000,
    image: "images/lapangan-f.jpg",
    description:
      "Lapangan outdoor dengan atap canopy anti-hujan. Sensasi bermain di udara segar dengan sinar matahari pagi yang menyegarkan.",
    fasilitas: ["Lantai Semen Khusus", "Atap Canopy", "Lampu Malam", "Area Parkir", "Kantin Terdekat"],
    location: "Area Outdoor – Belakang Gedung",
    available: true,
  },
];

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
