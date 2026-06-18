// ============================================================
//  routes/lapangan.js — Court listing for user-facing pages
// ============================================================
const express = require("express");
const router = express.Router();

const { COURTS, JADWAL } = require("../public/js/data");

// GET /api/lapangan
router.get("/", (req, res) => {
  const result = COURTS.map(court => {
    const schedules = JADWAL
      .filter(j => j.lapangan_id === court.id)
      .map(j => ({
        id: j.id,
        label: j.jam
      }));

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

module.exports = router;