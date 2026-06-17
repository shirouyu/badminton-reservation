const express = require("express");
const router = express.Router();
const db = require("../config/db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../public/uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'court-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Hanya file gambar yang diperbolehkan (jpeg, jpg, png, gif, webp)'));
        }
    }
});

// GET /api/admin/stats - Get dashboard statistics
router.get("/stats", (req, res) => {
    const stats = {};

    // Total bookings
    db.query("SELECT COUNT(*) as total FROM booking", (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Error server" });
        }
        stats.totalBookings = results[0].total;

        // Pending bookings
        db.query("SELECT COUNT(*) as total FROM booking WHERE status = 'Pending'", (err, results) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Error server" });
            }
            stats.pendingBookings = results[0].total;

            // Confirmed bookings
            db.query("SELECT COUNT(*) as total FROM booking WHERE status = 'Lunas'", (err, results) => {
                if (err) {
                    return res.status(500).json({ success: false, message: "Error server" });
                }
                stats.confirmedBookings = results[0].total;

                // Total revenue
                db.query("SELECT SUM(total_harga) as revenue FROM booking WHERE status = 'Lunas'", (err, results) => {
                    if (err) {
                        return res.status(500).json({ success: false, message: "Error server" });
                    }
                    stats.totalRevenue = results[0].revenue || 0;

                    res.json({ success: true, stats });
                });
            });
        });
    });
});

// GET /api/admin/bookings - Get all bookings
router.get("/bookings", (req, res) => {
    const query = `
        SELECT 
            b.id AS booking_id,
            b.nama_pemesan,
            b.email,
            b.no_hp,
            l.nama AS nama_lapangan,
            l.lokasi,
            j.tanggal,
            j.jam,
            b.metode_pembayaran,
            b.total_harga,
            b.status,
            b.created_at
        FROM booking b
        JOIN booking_detail bd ON b.id = bd.booking_id
        JOIN lapangan l ON bd.lapangan_id = l.id
        JOIN jadwal j ON bd.jadwal_id = j.id
        ORDER BY b.created_at DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Error server" });
        }
        res.json({ success: true, bookings: results });
    });
});

// PUT /api/admin/bookings/:id - Update booking status
router.put("/bookings/:id", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['Pending', 'Lunas', 'Batal'].includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Status tidak valid"
        });
    }

    db.query(
        "UPDATE booking SET status = ? WHERE id = ?",
        [status, id],
        (err, results) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Error server" });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ success: false, message: "Booking tidak ditemukan" });
            }
            res.json({ success: true, message: "Status berhasil diubah" });
        }
    );
});

// DELETE /api/admin/bookings/:id - Delete booking
router.delete("/bookings/:id", (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM booking WHERE id = ?", [id], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Error server" });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Booking tidak ditemukan" });
        }
        res.json({ success: true, message: "Booking berhasil dihapus" });
    });
});

// GET /api/admin/courts - Get all courts with booking status
router.get("/courts", (req, res) => {

    const query = `
        SELECT 
            l.*,
            COUNT(DISTINCT j.id) as total_slots
        FROM lapangan l
        LEFT JOIN jadwal_lapangan j
            ON l.id = j.lapangan_id
        GROUP BY l.id
        ORDER BY l.id ASC
    `;

    db.query(query, (err, results) => {

        if (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: "Error server"
            });
        }

        const courts = results.map(court => ({
            ...court,
            booked_slots: 0,
            is_full: false
        }));

        res.json({
            success: true,
            courts
        });

    });

});

// GET /api/lapangan - untuk halaman user
router.get("/lapangan", (req, res) => {

    const query = `
        SELECT *
        FROM lapangan
        ORDER BY id ASC
    `;

    db.query(query, async (err, courts) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        const result = [];

        for (const row of courts) {

            const schedules = await new Promise((resolve, reject) => {

                db.query(
                    `
                    SELECT
                        id,
                        jam
                    FROM jadwal
                    WHERE lapangan_id = ?
                    ORDER BY id ASC
                    `,
                    [row.id],
                    (err, jadwal) => {

                        if (err) reject(err);

                        resolve(
                            jadwal.map(j => ({
                                id: j.id,
                                label: j.jam
                            }))
                        );
                    }
                );

            });

            result.push({
                id: row.id,
                name: row.nama,
                tag: row.tag,
                tagColor: row.tag_color,
                price: row.harga,
                image: row.gambar,
                description: row.deskripsi,
                location: row.lokasi,
                available: true,

                fasilitas: [
                    "WiFi Gratis",
                    "Loker",
                    "Pencahayaan LED"
                ],

                schedules
            });

        }

        res.json(result);

    });

});

// POST /api/admin/courts - Add new court
router.post("/courts", upload.single("gambar"), (req, res) => {
    const { nama, lokasi, harga } = req.body;
    
    if (!nama || !lokasi || !harga) {
        return res.status(400).json({
            success: false,
            message: "Nama, lokasi, dan harga harus diisi"
        });
    }
    
    // Get the uploaded file path or empty string
    const gambar = req.file ? `/uploads/${req.file.filename}` : '';
    
    const query = "INSERT INTO lapangan (nama, lokasi, harga, gambar) VALUES (?, ?, ?, ?)";
    
    db.query(query, [nama, lokasi, parseInt(harga), gambar], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Error server" });
        }
        res.json({ 
            success: true, 
            message: "Lapangan berhasil ditambahkan",
            id: results.insertId 
        });
    });
});

// DELETE /api/admin/courts/:id - Delete court
router.delete("/courts/:id", (req, res) => {
    const { id } = req.params;
    
    // Check if court has bookings
    const checkQuery = `
        SELECT COUNT(*) as count 
        FROM booking_detail bd
        JOIN jadwal j ON bd.jadwal_id = j.id
        WHERE bd.lapangan_id = ? AND j.status = 'dibooking'
    `;
    
    db.query(checkQuery, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Error server" });
        }
        
        if (results[0].count > 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Tidak dapat menghapus lapangan yang masih memiliki booking aktif" 
            });
        }
        
        const deleteQuery = "DELETE FROM lapangan WHERE id = ?";
        db.query(deleteQuery, [id], (err, results) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Error server" });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ success: false, message: "Lapangan tidak ditemukan" });
            }
            res.json({ success: true, message: "Lapangan berhasil dihapus" });
        });
    });
});

router.post("/login", (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email dan password harus diisi"
        });
    }

    db.query(
        "SELECT * FROM admin WHERE email = ?",
        [email],
        (err, results) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Error server"
                });
            }

            if (results.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: "Email atau password salah"
                });
            }

            const admin = results[0];

            // Simple password check (dalam production gunakan bcrypt)
            if (admin.password !== password) {
                return res.status(401).json({
                    success: false,
                    message: "Email atau password salah"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Login berhasil",
                admin: {
                    id: admin.id,
                    username: admin.username,
                    email: admin.email
                }
            });
        }
    );
});

// ============================
// ADMIN USER MANAGEMENT
// ============================

// GET /api/admin/users - Get all admin users
router.get("/users", (req, res) => {
    const query = "SELECT id, username, email, created_at FROM admin ORDER BY id ASC";
    
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Error server" });
        }
        res.json({ success: true, users: results });
    });
});

// PUT /api/admin/users/:id - Update admin user
router.put("/users/:id", (req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body;
    
    if (!username) {
        return res.status(400).json({
            success: false,
            message: "Username harus diisi"
        });
    }
    
    // Check if username already exists (exclude current)
    db.query("SELECT id FROM admin WHERE username = ? AND id != ?", [username, id], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Error server" });
        }
        if (results.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Username sudah digunakan"
            });
        }
        
        let query, params;
        if (password && password.trim() !== '') {
            query = "UPDATE admin SET username = ?, email = ?, password = ? WHERE id = ?";
            params = [username, email || null, password, id];
        } else {
            query = "UPDATE admin SET username = ?, email = ? WHERE id = ?";
            params = [username, email || null, id];
        }
        
        db.query(query, params, (err, results) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Error server" });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ success: false, message: "Admin tidak ditemukan" });
            }
            res.json({ success: true, message: "Admin berhasil diupdate" });
        });
    });
});

// DELETE /api/admin/users/:id - Delete admin user
router.delete("/users/:id", (req, res) => {
    const { id } = req.params;
    
    // Prevent deleting the last admin
    db.query("SELECT COUNT(*) as total FROM admin", (err, countResult) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Error server" });
        }
        if (countResult[0].total <= 1) {
            return res.status(400).json({
                success: false,
                message: "Tidak dapat menghapus admin terakhir"
            });
        }
        
        db.query("DELETE FROM admin WHERE id = ?", [id], (err, results) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Error server" });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ success: false, message: "Admin tidak ditemukan" });
            }
            res.json({ success: true, message: "Admin berhasil dihapus" });
        });
    });
});

module.exports = router;
