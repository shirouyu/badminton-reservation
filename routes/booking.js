// ============================================================
//  routes/booking.js
// ============================================================
const express = require("express");
const router = express.Router();

const { BOOKINGS } = require("../public/js/data");

// GET /api/booking
router.get("/", (req, res) => {
  res.json(BOOKINGS);
});

// GET /api/booking/booked — returns list of booked jadwal_ids
router.get("/booked", (req, res) => {
  const booked = [];

  BOOKINGS.forEach(booking => {
    if (booking.details && Array.isArray(booking.details)) {
      booking.details.forEach(detail => {
        booked.push({ jadwal_id: detail.jadwal_id });
      });
    }
  });

  res.json(booked);
});

module.exports = router;