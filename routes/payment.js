const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/", (req, res) => {

    const {
        total_harga,
        metode_pembayaran
    } = req.body;

    db.query(
        "SELECT * FROM cart",
        (err, cartData) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (cartData.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Cart kosong"
                });
            }

            db.query(
                `INSERT INTO booking
                (metode_pembayaran, total_harga)
                VALUES (?, ?)`,
                [
                    metode_pembayaran,
                    total_harga
                ],
                (err, bookingResult) => {

                    if (err) {
                        return res.status(500).json(err);
                    }

                    const bookingId = bookingResult.insertId;

                    let selesai = 0;

                    cartData.forEach(item => {

                        db.query(
                            `INSERT INTO booking_detail
                            (booking_id, lapangan_id, jadwal_id)
                            VALUES (?, ?, ?)`,
                            [
                                bookingId,
                                item.lapangan_id,
                                item.jadwal_id
                            ],
                            (err) => {

                                if (err) {
                                    return res.status(500).json(err);
                                }

                                selesai++;

                                if (selesai === cartData.length) {

                                    db.query(
                                        "DELETE FROM cart",
                                        (err) => {

                                            if (err) {
                                                return res.status(500).json(err);
                                            }

                                            res.json({
                                                success: true
                                            });

                                        }
                                    );

                                }

                            }
                        );

                    });

                }
            );

        }
    );

});

router.get("/", (req, res) => {

    db.query(
        "SELECT * FROM booking ORDER BY id DESC",
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(result);

        }
    );

});

module.exports = router;