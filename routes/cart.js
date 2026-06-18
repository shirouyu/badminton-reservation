// ============================================================
//  routes/cart.js
// ============================================================
const express = require("express");
const router = express.Router();

const { CART } = require("../public/js/data");

// GET /api/cart
router.get("/", (req, res) => {
  res.json(CART);
});

// POST /api/cart — add item
router.post("/", (req, res) => {
  const { courtId, slotId } = req.body;

  if (!courtId || !slotId) {
    return res.status(400).json({
      success: false,
      message: "courtId dan slotId harus diisi"
    });
  }

  const newId = CART.length > 0 ? Math.max(...CART.map(x => x.id)) + 1 : 1;

  CART.push({
    id: newId,
    courtId,
    slotId,
    created_at: new Date()
  });

  res.json({ success: true, id: newId });
});

// DELETE /api/cart — clear all
router.delete("/", (req, res) => {
  CART.splice(0, CART.length);
  res.json({ success: true });
});

// DELETE /api/cart/:id — remove single item
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = CART.findIndex(item => item.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Item tidak ditemukan"
    });
  }

  CART.splice(index, 1);
  res.json({ success: true });
});

module.exports = router;