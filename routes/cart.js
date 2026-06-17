const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/", (req, res) => {

    const {
        courtId,
        slotId
    } = req.body;

    if (!courtId || !slotId) {
        return res.status(400).json({
            success: false,
            message: "Data tidak lengkap"
        });
    }

    console.log("COURT ID =", courtId);
    console.log("SLOT ID =", slotId);

    db.query(
        `INSERT INTO cart
        (lapangan_id, jadwal_id)
        VALUES (?, ?)`,
        [
            courtId,
            slotId
        ],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).json(err);
            }

            res.json({
                success: true
            });

        }
    );

});

router.delete("/", (req, res) => {

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

});

module.exports = router;