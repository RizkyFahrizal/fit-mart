-- phpMyAdmin SQL Dump
-- Database: `db_fitmart`
-- Version: 5.2.1 / MariaDB 10.4.32 / PHP 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Charset
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- --------------------------------------------------------
-- Table: categories
-- --------------------------------------------------------

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `categories` (`id`, `name`, `description`) VALUES
(1, 'Alat Kesehatan', 'Alat medis dan pemeriksaan kesehatan'),
(2, 'Suplemen', 'Vitamin dan nutrisi penunjang kesehatan'),
(3, 'Perawatan Tubuh', 'Produk kebersihan dan perawatan diri'),
(4, 'Alat Kebugaran', 'Peralatan olahraga ringan dan fitness');

-- --------------------------------------------------------
-- Table: users
-- --------------------------------------------------------

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` enum('Laki-laki','Perempuan') DEFAULT NULL,
  `address` text DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `contact_no` varchar(20) DEFAULT NULL,
  `role` enum('customer','admin') DEFAULT 'customer',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `users` (`id`, `username`, `email`, `password`, `date_of_birth`, `gender`, `address`, `city`, `contact_no`, `role`, `created_at`) VALUES
(1, 'admin', 'admin@gmail.com', 'admin', '2004-08-12', 'Laki-laki', 'Petemon Kuburan 88a', 'surabaya', '085174316699', 'admin', '2025-04-30 11:59:29'),
(2, 'demeks', 'demek@gmail.com', '1212', '2000-03-23', 'Perempuan', 'Sidoarjo, Kahuripan Nirwarna', 'Sidoarjo', '083663661636', 'customer', '2025-05-02 08:17:10'),
(3, 'yuka', 'yuka@gmail.com', 'yuka', '2025-05-02', 'Perempuan', 'wonrejo', 'surabaya', '0816271271', 'customer', '2025-05-03 03:06:25'),
(4, 'rizal', 'rizal@gmail.com', 'rizal', '2004-12-08', 'Laki-laki', 'perum pondok jati', 'Sidoarjo', '0877366251312', 'admin', '2025-05-04 16:33:38'),
(5, 'faiq', 'faiq@gmail.com', 'faiq', '2012-12-12', 'Laki-laki', 'puncak bromo', 'Pasuruan', '083766471313', 'customer', '2025-05-04 16:34:59');

-- --------------------------------------------------------
-- Table: products
-- --------------------------------------------------------

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(150) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `products` (`id`, `name`, `price`, `description`, `image_url`, `category_id`, `created_at`) VALUES
(1, 'Tensimeter Digital', 350000.00, 'Alat ukur tekanan darah otomatis', 'tensimeter.jpg', 1, NOW()),
(2, 'Vitamin C 1000mg', 120000.00, 'Suplemen daya tahan tubuh', 'vitaminc.jpg', 2, NOW()),
(3, 'Hand Sanitizer 500ml', 35000.00, 'Pembersih tangan antiseptik', 'handsanitizer.jpg', 3, NOW()),
(4, 'Masker KN95', 50000.00, 'Masker pelindung partikel dan virus', 'masker.jpg', 3, NOW()),
(5, 'Matras Yoga', 200000.00, 'Matras anti-slip untuk olahraga ringan', 'matrasyoga.jpg', 4, NOW());

-- --------------------------------------------------------
-- Table: cart
-- --------------------------------------------------------

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `is_checked_out` tinyint(1) NOT NULL DEFAULT 0,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: orders
-- --------------------------------------------------------

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `total_price` decimal(10,2) DEFAULT NULL,
  `status` enum('packaging','shipped','cancelled','completed') DEFAULT 'packaging',
  `payment_method` enum('debit','credit','cod') DEFAULT 'debit',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: order_items
-- --------------------------------------------------------

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: feedback
-- --------------------------------------------------------

CREATE TABLE `feedback` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  `comment` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: guestbook
-- --------------------------------------------------------

CREATE TABLE `guestbook` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `guestbook` (`id`, `name`, `message`, `created_at`) VALUES
(1, 'demeks', 'terimakasih.. websitenya keren', '2025-05-03 03:26:26'),
(2, 'yuka', 'bagusss', '2025-05-03 06:24:55'),
(3, 'faiq', 'coba website ini', '2025-05-04 16:36:03');

-- --------------------------------------------------------
-- Table: shop_requests
-- --------------------------------------------------------

CREATE TABLE `shop_requests` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `shop_name` varchar(150) DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Indexes & Auto Increments
-- --------------------------------------------------------

ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

ALTER TABLE `categories` ADD PRIMARY KEY (`id`);
ALTER TABLE `feedback` ADD PRIMARY KEY (`id`), ADD KEY `user_id` (`user_id`), ADD KEY `product_id` (`product_id`);
ALTER TABLE `guestbook` ADD PRIMARY KEY (`id`);
ALTER TABLE `orders` ADD PRIMARY KEY (`id`), ADD KEY `user_id` (`user_id`);
ALTER TABLE `order_items` ADD PRIMARY KEY (`id`), ADD KEY `order_id` (`order_id`), ADD KEY `product_id` (`product_id`);
ALTER TABLE `products` ADD PRIMARY KEY (`id`), ADD KEY `category_id` (`category_id`);
ALTER TABLE `shop_requests` ADD PRIMARY KEY (`id`), ADD KEY `user_id` (`user_id`);
ALTER TABLE `users` ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `email` (`email`);

ALTER TABLE `cart` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `categories` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
ALTER TABLE `feedback` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `guestbook` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
ALTER TABLE `orders` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `order_items` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `products` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
ALTER TABLE `shop_requests` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `users` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

-- --------------------------------------------------------
-- Foreign Key Constraints
-- --------------------------------------------------------

ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

ALTER TABLE `feedback`
  ADD CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `feedback_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

ALTER TABLE `shop_requests`
  ADD CONSTRAINT `shop_requests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
