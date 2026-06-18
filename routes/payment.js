const express = require("express");
const router = express.Router();

const {
    CART,
    BOOKINGS
} = require("../public/js/data");

router.post("/", (req, res) => {

    const {
        total_harga,
        metode_pembayaran
    } = req.body;
    console.log("CART PAYMENT =", CART);
    console.log("BODY =", req.body);
    console.log("CART =", CART);
    if (CART.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Cart kosong"
        });
    }

    CART.forEach(item => {

        BOOKINGS.push({
            id: Date.now() + Math.random(),
            lapangan_id: item.courtId,
            jadwal_id: item.slotId,
            total_harga,
            metode_pembayaran,
            created_at: new Date()
        });

    });

    CART.length = 0;

    res.json({
        success: true
    });

});

router.get("/", (req, res) => {
    res.json(BOOKINGS);
});

module.exports = router;