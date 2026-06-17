-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 16, 2026 at 08:43 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `badminton`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `username`, `password`, `email`, `created_at`) VALUES
(1, 'admin', 'admin123', 'admin@smashcourt.com', '2026-06-16 18:03:45');

-- --------------------------------------------------------

--
-- Table structure for table `booking`
--

CREATE TABLE `booking` (
  `id` int(11) NOT NULL,
  `nama_pemesan` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `no_hp` varchar(20) DEFAULT NULL,
  `metode_pembayaran` varchar(50) DEFAULT NULL,
  `total_harga` int(11) NOT NULL,
  `status` enum('Pending','Lunas','Batal') DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `booking`
--

INSERT INTO `booking` (`id`, `nama_pemesan`, `email`, `no_hp`, `metode_pembayaran`, `total_harga`, `status`, `created_at`) VALUES
(1, 'Budi Santoso', 'budi@gmail.com', '08123456789', 'Transfer Bank', 50000, 'Lunas', '2026-06-16 18:03:45'),
(2, '', NULL, NULL, 'qris', 75000, 'Lunas', '2026-06-16 18:43:07');

-- --------------------------------------------------------

--
-- Table structure for table `booking_detail`
--

CREATE TABLE `booking_detail` (
  `id` int(11) NOT NULL,
  `booking_id` int(11) NOT NULL,
  `lapangan_id` int(11) NOT NULL,
  `jadwal_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `booking_detail`
--

INSERT INTO `booking_detail` (`id`, `booking_id`, `lapangan_id`, `jadwal_id`) VALUES
(2, 2, 1, 15);

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `lapangan_id` int(11) NOT NULL,
  `jadwal_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `fasilitas_lapangan`
--

CREATE TABLE `fasilitas_lapangan` (
  `id` int(11) NOT NULL,
  `lapangan_id` int(11) NOT NULL,
  `fasilitas` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `fasilitas_lapangan`
--

INSERT INTO `fasilitas_lapangan` (`id`, `lapangan_id`, `fasilitas`) VALUES
(1, 1, 'Lantai Kayu Maple'),
(2, 1, 'LED 1000 Lux'),
(3, 1, 'AC Split'),
(4, 1, 'Loker'),
(5, 1, 'WiFi Gratis'),
(6, 1, 'CCTV 24 Jam'),
(7, 2, 'Lantai Vinyl'),
(8, 2, 'LED 800 Lux'),
(9, 2, 'Kipas Angin'),
(10, 2, 'Loker'),
(11, 2, 'WiFi Gratis'),
(12, 3, 'Lantai Kayu Maple'),
(13, 3, 'LED 1200 Lux'),
(14, 3, 'AC Central'),
(15, 3, 'Ruang Ganti Pribadi'),
(16, 3, 'Sound System'),
(17, 3, 'Kaca Monitor'),
(18, 4, 'Lantai Vinyl'),
(19, 4, 'LED 800 Lux'),
(20, 4, 'Ventilasi Alami'),
(21, 4, 'Bangku Penonton'),
(22, 4, 'WiFi Gratis'),
(23, 5, 'Lantai Kayu'),
(24, 5, 'LED 1000 Lux'),
(25, 5, 'Papan Skor Digital'),
(26, 5, 'AC Split'),
(27, 5, 'Loker'),
(28, 5, 'WiFi Gratis'),
(29, 6, 'Lantai Semen Khusus'),
(30, 6, 'Atap Canopy'),
(31, 6, 'Lampu Malam'),
(32, 6, 'Area Parkir'),
(33, 6, 'Kantin Terdekat');

-- --------------------------------------------------------

--
-- Table structure for table `jadwal`
--

CREATE TABLE `jadwal` (
  `id` int(11) NOT NULL,
  `lapangan_id` int(11) NOT NULL,
  `tanggal` date NOT NULL,
  `jam` varchar(20) NOT NULL,
  `status` enum('tersedia','dibooking') DEFAULT 'tersedia'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `jadwal`
--

INSERT INTO `jadwal` (`id`, `lapangan_id`, `tanggal`, `jam`, `status`) VALUES
(15, 1, '2026-06-20', '08:00-09:00', 'tersedia'),
(16, 2, '2026-06-20', '08:00-09:00', 'tersedia'),
(17, 3, '2026-06-20', '08:00-09:00', 'tersedia'),
(18, 4, '2026-06-20', '08:00-09:00', 'tersedia'),
(19, 5, '2026-06-20', '08:00-09:00', 'tersedia'),
(20, 6, '2026-06-20', '08:00-09:00', 'tersedia'),
(21, 1, '2026-06-20', '09:00-10:00', 'tersedia'),
(22, 2, '2026-06-20', '09:00-10:00', 'tersedia'),
(23, 3, '2026-06-20', '09:00-10:00', 'tersedia'),
(24, 4, '2026-06-20', '09:00-10:00', 'tersedia'),
(25, 5, '2026-06-20', '09:00-10:00', 'tersedia'),
(26, 6, '2026-06-20', '09:00-10:00', 'tersedia'),
(27, 1, '2026-06-20', '10:00-11:00', 'tersedia'),
(28, 2, '2026-06-20', '10:00-11:00', 'tersedia'),
(29, 3, '2026-06-20', '10:00-11:00', 'tersedia'),
(30, 4, '2026-06-20', '10:00-11:00', 'tersedia'),
(31, 5, '2026-06-20', '10:00-11:00', 'tersedia'),
(32, 6, '2026-06-20', '10:00-11:00', 'tersedia'),
(33, 1, '2026-06-20', '11:00-12:00', 'tersedia'),
(34, 2, '2026-06-20', '11:00-12:00', 'tersedia'),
(35, 3, '2026-06-20', '11:00-12:00', 'tersedia'),
(36, 4, '2026-06-20', '11:00-12:00', 'tersedia'),
(37, 5, '2026-06-20', '11:00-12:00', 'tersedia'),
(38, 6, '2026-06-20', '11:00-12:00', 'tersedia'),
(39, 1, '2026-06-20', '12:00-13:00', 'tersedia'),
(40, 2, '2026-06-20', '12:00-13:00', 'tersedia'),
(41, 3, '2026-06-20', '12:00-13:00', 'tersedia'),
(42, 4, '2026-06-20', '12:00-13:00', 'tersedia'),
(43, 5, '2026-06-20', '12:00-13:00', 'tersedia'),
(44, 6, '2026-06-20', '12:00-13:00', 'tersedia'),
(45, 1, '2026-06-20', '13:00-14:00', 'tersedia'),
(46, 2, '2026-06-20', '13:00-14:00', 'tersedia'),
(47, 3, '2026-06-20', '13:00-14:00', 'tersedia'),
(48, 4, '2026-06-20', '13:00-14:00', 'tersedia'),
(49, 5, '2026-06-20', '13:00-14:00', 'tersedia'),
(50, 6, '2026-06-20', '13:00-14:00', 'tersedia'),
(51, 1, '2026-06-20', '14:00-15:00', 'tersedia'),
(52, 2, '2026-06-20', '14:00-15:00', 'tersedia'),
(53, 3, '2026-06-20', '14:00-15:00', 'tersedia'),
(54, 4, '2026-06-20', '14:00-15:00', 'tersedia'),
(55, 5, '2026-06-20', '14:00-15:00', 'tersedia'),
(56, 6, '2026-06-20', '14:00-15:00', 'tersedia'),
(57, 1, '2026-06-20', '15:00-16:00', 'tersedia'),
(58, 2, '2026-06-20', '15:00-16:00', 'tersedia'),
(59, 3, '2026-06-20', '15:00-16:00', 'tersedia'),
(60, 4, '2026-06-20', '15:00-16:00', 'tersedia'),
(61, 5, '2026-06-20', '15:00-16:00', 'tersedia'),
(62, 6, '2026-06-20', '15:00-16:00', 'tersedia');

-- --------------------------------------------------------

--
-- Table structure for table `jadwal_lapangan`
--

CREATE TABLE `jadwal_lapangan` (
  `id` int(11) NOT NULL,
  `lapangan_id` int(11) NOT NULL,
  `jam_mulai` time NOT NULL,
  `jam_selesai` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `jadwal_lapangan`
--

INSERT INTO `jadwal_lapangan` (`id`, `lapangan_id`, `jam_mulai`, `jam_selesai`) VALUES
(1, 1, '08:00:00', '09:00:00'),
(2, 2, '08:00:00', '09:00:00'),
(3, 3, '08:00:00', '09:00:00'),
(4, 4, '08:00:00', '09:00:00'),
(5, 5, '08:00:00', '09:00:00'),
(6, 6, '08:00:00', '09:00:00'),
(7, 1, '09:00:00', '10:00:00'),
(8, 2, '09:00:00', '10:00:00'),
(9, 3, '09:00:00', '10:00:00'),
(10, 4, '09:00:00', '10:00:00'),
(11, 5, '09:00:00', '10:00:00'),
(12, 6, '09:00:00', '10:00:00'),
(13, 1, '10:00:00', '11:00:00'),
(14, 2, '10:00:00', '11:00:00'),
(15, 3, '10:00:00', '11:00:00'),
(16, 4, '10:00:00', '11:00:00'),
(17, 5, '10:00:00', '11:00:00'),
(18, 6, '10:00:00', '11:00:00'),
(19, 1, '11:00:00', '12:00:00'),
(20, 2, '11:00:00', '12:00:00'),
(21, 3, '11:00:00', '12:00:00'),
(22, 4, '11:00:00', '12:00:00'),
(23, 5, '11:00:00', '12:00:00'),
(24, 6, '11:00:00', '12:00:00'),
(25, 1, '12:00:00', '13:00:00'),
(26, 2, '12:00:00', '13:00:00'),
(27, 3, '12:00:00', '13:00:00'),
(28, 4, '12:00:00', '13:00:00'),
(29, 5, '12:00:00', '13:00:00'),
(30, 6, '12:00:00', '13:00:00'),
(31, 1, '13:00:00', '14:00:00'),
(32, 2, '13:00:00', '14:00:00'),
(33, 3, '13:00:00', '14:00:00'),
(34, 4, '13:00:00', '14:00:00'),
(35, 5, '13:00:00', '14:00:00'),
(36, 6, '13:00:00', '14:00:00'),
(37, 1, '14:00:00', '15:00:00'),
(38, 2, '14:00:00', '15:00:00'),
(39, 3, '14:00:00', '15:00:00'),
(40, 4, '14:00:00', '15:00:00'),
(41, 5, '14:00:00', '15:00:00'),
(42, 6, '14:00:00', '15:00:00'),
(43, 1, '15:00:00', '16:00:00'),
(44, 2, '15:00:00', '16:00:00'),
(45, 3, '15:00:00', '16:00:00'),
(46, 4, '15:00:00', '16:00:00'),
(47, 5, '15:00:00', '16:00:00'),
(48, 6, '15:00:00', '16:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `lapangan`
--

CREATE TABLE `lapangan` (
  `id` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `lokasi` varchar(100) NOT NULL,
  `harga` int(11) NOT NULL,
  `kuota` int(11) DEFAULT 10,
  `gambar` varchar(255) DEFAULT NULL,
  `tag` varchar(50) DEFAULT NULL,
  `tag_color` varchar(30) DEFAULT NULL,
  `deskripsi` text DEFAULT NULL,
  `tersedia` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lapangan`
--

INSERT INTO `lapangan` (`id`, `nama`, `lokasi`, `harga`, `kuota`, `gambar`, `tag`, `tag_color`, `deskripsi`, `tersedia`) VALUES
(1, 'Lapangan A', 'Lantai 2 – Gedung Utama', 75000, 10, 'images/lapangan-a.jpg', 'Premium', 'gold', 'Lapangan premium berstandar BWF dengan lantai kayu maple berkualitas tinggi. Pencahayaan LED 1000 lux memastikan visibilitas sempurna di setiap sudut.', 1),
(2, 'Lapangan B', 'Lantai 2 – Gedung Utama', 55000, 10, 'images/lapangan-b.jpg', 'Reguler', 'green', 'Lapangan reguler dengan lantai vinyl anti-slip berkualitas baik. Ideal untuk latihan rutin maupun pertandingan antar teman.', 1),
(3, 'Lapangan C', 'Lantai 3 – Gedung Utama', 100000, 10, 'images/lapangan-c.jpg', 'VIP', 'purple', 'Lapangan VIP eksklusif dengan ruang ganti pribadi, sound system, dan kaca tempered satu sisi untuk pelatih. Pengalaman bermain terbaik.', 1),
(4, 'Lapangan D', 'Lantai 1 – Gedung B', 55000, 10, 'images/lapangan-d.jpg', 'Reguler', 'green', 'Lapangan reguler yang luas dengan ventilasi alami yang baik. Cocok untuk sesi pagi dan latihan tim.', 1),
(5, 'Lapangan E', 'Lantai 1 – Gedung B', 75000, 10, 'images/lapangan-e.jpg', 'Premium', 'gold', 'Lapangan premium dengan sistem pencahayaan otomatis dan lantai kayu premium. Dilengkapi papan skor digital.', 1),
(6, 'Lapangan F', 'Area Outdoor – Belakang Gedung', 40000, 10, 'images/lapangan-f.jpg', 'Outdoor', 'blue', 'Lapangan outdoor dengan atap canopy anti-hujan. Sensasi bermain di udara segar dengan sinar matahari pagi yang menyegarkan.', 1);

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_booking_admin`
-- (See below for the actual view)
--
CREATE TABLE `v_booking_admin` (
`booking_id` int(11)
,`nama_pemesan` varchar(100)
,`email` varchar(100)
,`no_hp` varchar(20)
,`nama_lapangan` varchar(100)
,`lokasi` varchar(100)
,`tanggal` date
,`jam` varchar(20)
,`metode_pembayaran` varchar(50)
,`total_harga` int(11)
,`status` enum('Pending','Lunas','Batal')
,`created_at` timestamp
);

-- --------------------------------------------------------

--
-- Structure for view `v_booking_admin`
--
DROP TABLE IF EXISTS `v_booking_admin`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_booking_admin`  AS SELECT `b`.`id` AS `booking_id`, `b`.`nama_pemesan` AS `nama_pemesan`, `b`.`email` AS `email`, `b`.`no_hp` AS `no_hp`, `l`.`nama` AS `nama_lapangan`, `l`.`lokasi` AS `lokasi`, `j`.`tanggal` AS `tanggal`, `j`.`jam` AS `jam`, `b`.`metode_pembayaran` AS `metode_pembayaran`, `b`.`total_harga` AS `total_harga`, `b`.`status` AS `status`, `b`.`created_at` AS `created_at` FROM (((`booking` `b` join `booking_detail` `bd` on(`b`.`id` = `bd`.`booking_id`)) join `lapangan` `l` on(`bd`.`lapangan_id` = `l`.`id`)) join `jadwal` `j` on(`bd`.`jadwal_id` = `j`.`id`)) ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `booking`
--
ALTER TABLE `booking`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `booking_detail`
--
ALTER TABLE `booking_detail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `booking_id` (`booking_id`),
  ADD KEY `lapangan_id` (`lapangan_id`),
  ADD KEY `jadwal_id` (`jadwal_id`);

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lapangan_id` (`lapangan_id`),
  ADD KEY `jadwal_id` (`jadwal_id`);

--
-- Indexes for table `fasilitas_lapangan`
--
ALTER TABLE `fasilitas_lapangan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lapangan_id` (`lapangan_id`);

--
-- Indexes for table `jadwal`
--
ALTER TABLE `jadwal`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lapangan_id` (`lapangan_id`);

--
-- Indexes for table `jadwal_lapangan`
--
ALTER TABLE `jadwal_lapangan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lapangan_id` (`lapangan_id`);

--
-- Indexes for table `lapangan`
--
ALTER TABLE `lapangan`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `booking`
--
ALTER TABLE `booking`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `booking_detail`
--
ALTER TABLE `booking_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `fasilitas_lapangan`
--
ALTER TABLE `fasilitas_lapangan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `jadwal`
--
ALTER TABLE `jadwal`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;

--
-- AUTO_INCREMENT for table `jadwal_lapangan`
--
ALTER TABLE `jadwal_lapangan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT for table `lapangan`
--
ALTER TABLE `lapangan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `booking_detail`
--
ALTER TABLE `booking_detail`
  ADD CONSTRAINT `booking_detail_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `booking` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `booking_detail_ibfk_2` FOREIGN KEY (`lapangan_id`) REFERENCES `lapangan` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `booking_detail_ibfk_3` FOREIGN KEY (`jadwal_id`) REFERENCES `jadwal` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`lapangan_id`) REFERENCES `lapangan` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`jadwal_id`) REFERENCES `jadwal` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `fasilitas_lapangan`
--
ALTER TABLE `fasilitas_lapangan`
  ADD CONSTRAINT `fasilitas_lapangan_ibfk_1` FOREIGN KEY (`lapangan_id`) REFERENCES `lapangan` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `jadwal`
--
ALTER TABLE `jadwal`
  ADD CONSTRAINT `jadwal_ibfk_1` FOREIGN KEY (`lapangan_id`) REFERENCES `lapangan` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `jadwal_lapangan`
--
ALTER TABLE `jadwal_lapangan`
  ADD CONSTRAINT `jadwal_lapangan_ibfk_1` FOREIGN KEY (`lapangan_id`) REFERENCES `lapangan` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
