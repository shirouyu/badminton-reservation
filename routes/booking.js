const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", (req, res) => {

    db.query(`
        SELECT
            b.id,
            b.metode_pembayaran,
            b.total_harga,
            b.created_at,
            bd.lapangan_id,
            bd.jadwal_id
        FROM booking b
        JOIN booking_detail bd
        ON b.id = bd.booking_id
        ORDER BY b.id DESC
    `,
    (err, result) => {

        if(err){
            return res.status(500).json(err);
        }

        res.json(result);
    });

});

router.get("/booked", (req,res)=>{

    db.query(
        "SELECT jadwal_id FROM booking_detail",
        (err,result)=>{

            if(err){
                return res.status(500).json(err);
            }

            res.json(result);

        }
    );

});

module.exports = router;