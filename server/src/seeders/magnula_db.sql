-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Aug 01, 2026 at 07:59 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `magnula_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `category_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `deleted_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `category_name`, `description`, `is_active`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 'Sofa', 'A long, comfortable, upholstered piece of furniture designed for sitting and lying down.', 1, NULL, '2026-06-20 07:19:44', '2026-08-01 07:39:07'),
(2, 'Cushion', 'A soft, plush bag filled with feathers, foam, or fiber, designed to provide ergonomic support, adjust seating comfort, or add a decorative accent to furniture', 1, NULL, '2026-06-20 07:21:50', '2026-08-01 07:45:54');

-- --------------------------------------------------------

--
-- Table structure for table `collections`
--

CREATE TABLE `collections` (
  `id` int(11) NOT NULL,
  `collection_name` varchar(100) NOT NULL,
  `color_hex` varchar(7) NOT NULL,
  `description` text DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `collections`
--

INSERT INTO `collections` (`id`, `collection_name`, `color_hex`, `description`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 'Ellora', '#D6C4B3', 'Ellora collection is shaped around calm, balance, and ease. Soft, generous volumes create a welcoming presence, while refined geometry maintains architectural clarity. Seating proportions are deliberately relaxed, allowing the body to settle naturally without adjustment or tension.', NULL, '2026-06-19 16:38:12', '2026-08-01 11:03:42'),
(2, 'Beluga', '#8F5D41', 'The Beluga Collection by Magnula features modern deep-seat sofas with signature curved silhouettes designed to visually soften interiors and embrace the body with effortless comfort. Crafted with premium foam layering and custom upholstery, Beluga blends refined craftsmanship with a calming, sculptural aesthetic created to hold your everyday moments, quiet pauses, and personal comfort.', NULL, '2026-06-19 16:38:12', '2026-06-19 16:38:12'),
(3, 'Magnes', '#75472F', 'Experience the Magnes Sofa Collection, where modern design meets timeless craftsmanship. Each sofa is thoughtfully created to bring quiet elegance, comfort, and balance into contemporary homes. From statement three-seaters to modular configurations, our luxury sofa range embodies refined proportions, premium materials, and enduring comfort. Every design celebrates simplicity — removing the excess to reveal only what’s essential.', NULL, '2026-06-19 16:38:12', '2026-06-19 16:38:12');

-- --------------------------------------------------------

--
-- Table structure for table `collection_images`
--

CREATE TABLE `collection_images` (
  `id` int(11) NOT NULL,
  `collection_id` int(11) NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `collection_images`
--

INSERT INTO `collection_images` (`id`, `collection_id`, `image_url`, `created_at`, `updated_at`) VALUES
(7, 2, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/69384579e9e50_BelugaComposition01.png', '2026-06-20 13:05:38', '2026-06-20 13:05:38'),
(8, 2, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/693845a563a1e_BelugaComposition02.png', '2026-06-20 13:05:38', '2026-06-20 13:05:38'),
(9, 2, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/693845cd82348_BelugaComposition03.png', '2026-06-20 13:05:38', '2026-06-20 13:05:38'),
(10, 2, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/6938460e97c35_BelugaComposition04.png', '2026-06-20 13:05:38', '2026-06-20 13:05:38'),
(11, 2, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/69384645c2a62_BelugaComposition05.png', '2026-06-20 13:05:38', '2026-06-20 13:05:38'),
(12, 2, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/6938468b690b7_BelugaComposition06.png', '2026-06-20 13:05:38', '2026-06-20 13:05:38'),
(13, 2, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/693846c14623b_BelugaComposition07.png', '2026-06-20 13:05:38', '2026-06-20 13:05:38'),
(14, 2, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/693846f9847ff_BelugaComposition08.png', '2026-06-20 13:05:38', '2026-06-20 13:05:38'),
(15, 2, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/6938473bc5c8c_BelugaComposition09.png', '2026-06-20 13:05:38', '2026-06-20 13:05:38'),
(16, 3, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/691612733dcb1_Magnessofawithchaiselounge02.png', '2026-06-20 13:11:06', '2026-06-20 13:11:06'),
(17, 3, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/691612bb10bd8_Magnessofawithchairottoman01.png', '2026-06-20 13:11:06', '2026-06-20 13:11:06'),
(18, 3, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/6916133df1ebe_Magnesmodularsofaunitwithottoman01.png', '2026-06-20 13:11:06', '2026-06-20 13:11:06'),
(19, 3, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/6916136c68660_Magnesmodularsofaunit01.png', '2026-06-20 13:11:06', '2026-06-20 13:11:06'),
(20, 3, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/69161392afdad_Magnesmodularsofaunitwiththreeseaterchair01.png', '2026-06-20 13:11:06', '2026-06-20 13:11:06'),
(49, 1, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/6986aa0ec8dfd_Composition7.png', '2026-08-01 11:03:42', '2026-08-01 11:03:42'),
(50, 1, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/6986a768a5e60_Composition6.png', '2026-08-01 11:03:42', '2026-08-01 11:03:42'),
(51, 1, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/6986a7eed2349_Composition4.png', '2026-08-01 11:03:42', '2026-08-01 11:03:42'),
(52, 1, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/6986a8d4ae5da_Composition1.png', '2026-08-01 11:03:42', '2026-08-01 11:03:42'),
(53, 1, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/6986a93e33bc4_Composition2.png', '2026-08-01 11:03:42', '2026-08-01 11:03:42'),
(54, 1, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/6986adbd34b21_Composition8.png', '2026-08-01 11:03:42', '2026-08-01 11:03:42');

-- --------------------------------------------------------

--
-- Table structure for table `fabric_types`
--

CREATE TABLE `fabric_types` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `deleted_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `fabric_types`
--

INSERT INTO `fabric_types` (`id`, `name`, `description`, `is_active`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 'Polyester', 'Upholstered in premium polyester fabric, this sofa offers the perfect blend of comfort and durability. The tightly woven fibers provide a soft-to-the-touch feel while remaining highly resistant to stains, fading, and daily wear. It’s an ideal, low-maintenance choice for modern living rooms that require both style and long-lasting resilience', 1, NULL, '2026-06-19 16:52:59', '2026-06-29 12:07:52'),
(2, 'Bouclé', 'Elevate your living space with the timeless elegance of Bouclé fabric. Characterized by its signature looped yarns and plush, textured surface, this fabric offers an invitingly soft feel and a sophisticated, high-end look. It perfectly balances cozy comfort with modern, sculptural design, making any sofa an instant centerpiece.', 1, '2026-06-22 16:57:32', '2026-06-19 16:59:20', '2026-06-22 16:57:32'),
(3, 'Canvas', 'Crafted from heavy-duty canvas fabric, this sofa brings a perfect blend of rugged durability and casual comfort to your home. Known for its thick, tightly woven texture, canvas is exceptionally resilient against daily wear, tearing, and pilling. It’s an ideal choice for busy households seeking a stylish, low-maintenance centerpiece with a timeless, earthy charm.', 1, '2026-06-20 09:09:42', '2026-06-19 17:30:36', '2026-06-20 09:09:42');

-- --------------------------------------------------------

--
-- Table structure for table `materials`
--

CREATE TABLE `materials` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `deleted_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `materials`
--

INSERT INTO `materials` (`id`, `name`, `description`, `is_active`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 'Hardwood/Plywood Frame | HR Foam & Fiber | Spring & Webbing Suspension', 'Design for everyday comfort and durability. The high-resilience foam provides supportive, bounce-back seating that retains its shape over years of heavy use.', 1, NULL, '2026-06-19 17:39:58', '2026-06-19 17:39:58'),
(2, 'Hardwood/Plywood Frame | Down Feather & Foam | 8-Way Hand-Tied Springs', 'The ultimate luxury seating experience. Premium down feather blending offers a plush, sink-in feel, paired with masterfully crafted 8-way hand-tied springs for maximum, long-lasting flexibility.', 0, NULL, '2026-06-19 17:40:18', '2026-06-29 12:09:23');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `order_code` varchar(50) NOT NULL,
  `customer_name` varchar(100) NOT NULL,
  `customer_email` varchar(100) NOT NULL,
  `customer_phone` varchar(15) NOT NULL,
  `country_region` varchar(100) NOT NULL,
  `state_province` varchar(100) NOT NULL,
  `shipping_address` text NOT NULL,
  `total_price` decimal(15,2) NOT NULL,
  `payment_method_id` int(11) DEFAULT NULL,
  `status` enum('Pending','Processing','Shipping','Completed','Cancelled') NOT NULL DEFAULT 'Pending',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_variant_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price_at_purchase` decimal(15,2) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment_methods`
--

CREATE TABLE `payment_methods` (
  `id` int(11) NOT NULL,
  `code` varchar(50) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `deleted_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment_methods`
--

INSERT INTO `payment_methods` (`id`, `code`, `name`, `description`, `is_active`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 'INT_CARD', 'International Credit & Debit Cards', 'Supports Visa, Mastercard, JCB.', 1, NULL, '2026-06-23 16:02:16', '2026-06-23 16:02:16'),
(2, 'COD', 'Cash on Delivery (COD)', 'Pay with cash upon receiving your order.', 1, NULL, '2026-06-23 16:04:06', '2026-06-27 16:00:53');

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` int(11) NOT NULL,
  `permission_key` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `permission_key`, `description`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'users:create', 'only admin can create new user', '2026-06-19 11:22:33', '2026-06-19 12:20:04', NULL),
(2, 'users:read', 'only admin can read user list', '2026-06-19 11:22:33', '2026-06-19 12:20:29', NULL),
(3, 'users:update_password', 'only admin can update password', '2026-06-19 11:22:33', '2026-06-19 12:21:08', NULL),
(4, 'users:update_status', 'only admin can activate/deactivate user account', '2026-06-19 11:22:33', '2026-06-19 12:23:09', NULL),
(5, 'roles:create', 'only admin can create new role', '2026-06-19 11:22:33', '2026-06-19 12:23:24', NULL),
(6, 'roles:read', 'only admin can read role list', '2026-06-19 11:22:33', '2026-06-19 12:24:30', NULL),
(7, 'roles:update', 'only admin can update role', '2026-06-19 11:22:33', '2026-06-19 11:22:33', NULL),
(8, 'roles:delete', 'only admin can delete role', '2026-06-19 11:22:33', '2026-06-19 11:22:33', NULL),
(11, 'permissions:create', 'only admin can create new permission', '2026-06-19 12:40:08', '2026-06-19 12:40:08', NULL),
(12, 'permissions:read', 'only admin can read permissions list', '2026-06-19 12:40:20', '2026-06-19 16:03:03', NULL),
(13, 'permissions:update', 'only admin can update permission', '2026-06-19 12:40:28', '2026-06-19 12:40:28', NULL),
(14, 'permissions:delete', 'only admin can delete permission', '2026-06-19 12:40:34', '2026-06-19 12:40:34', NULL),
(15, 'collections:create', 'every roles can create new collection', '2026-06-19 12:41:45', '2026-06-19 12:41:45', NULL),
(16, 'collections:read', 'every roles can read collection', '2026-06-19 12:41:57', '2026-06-19 12:41:57', NULL),
(17, 'collections:update', 'every roles can update collection', '2026-06-19 12:42:03', '2026-06-19 12:42:03', NULL),
(18, 'collections:delete', 'every roles can delete collection', '2026-06-19 12:42:11', '2026-06-19 12:42:11', NULL),
(19, 'products:create', 'every roles can create product item', '2026-06-19 12:43:23', '2026-06-19 12:43:23', NULL),
(20, 'products:read', 'every roles can read products list', '2026-06-19 12:43:34', '2026-06-19 12:43:34', NULL),
(21, 'products:update', 'every roles can update product item', '2026-06-19 12:43:54', '2026-06-19 12:43:54', NULL),
(22, 'products:delete', 'every roles can delete product item', '2026-06-19 12:44:06', '2026-06-19 12:44:06', NULL),
(23, 'fabric_type:create', 'every roles can create fabric type', '2026-06-19 12:46:38', '2026-06-19 12:46:38', NULL),
(24, 'fabric_type:read', 'every roles can read fabric type', '2026-06-19 12:46:47', '2026-06-19 12:46:47', NULL),
(25, 'fabric_type:update', 'every roles can update fabric type', '2026-06-19 12:46:54', '2026-06-19 12:46:54', NULL),
(26, 'fabric_type:update_status', 'every roles can activate/deactivate/restore fabric type', '2026-06-19 12:57:10', '2026-06-19 12:57:10', NULL),
(27, 'fabric_type:delete', 'every roles can delete fabric type', '2026-06-19 13:00:28', '2026-06-19 13:00:28', NULL),
(28, 'material:create', 'every roles can create material', '2026-06-19 13:00:36', '2026-06-19 13:00:36', NULL),
(29, 'material:read', 'every roles can read material', '2026-06-19 13:00:42', '2026-06-19 13:00:42', NULL),
(30, 'material:update', 'every roles can update material', '2026-06-19 13:00:42', '2026-06-19 13:00:42', NULL),
(31, 'material:update_status', 'every roles can activate/deactivate/restore material', '2026-06-19 13:07:05', '2026-06-19 13:07:05', NULL),
(32, 'material:delete', 'every roles can delete material', '2026-06-19 13:07:51', '2026-06-19 13:07:51', NULL),
(33, 'room_suitabilities:create', 'every roles can create room suitabilities', '2026-06-19 13:08:39', '2026-06-19 13:08:39', NULL),
(34, 'room_suitabilities:read', 'every roles can read room suitabilities', '2026-06-19 13:08:48', '2026-06-19 13:08:48', NULL),
(35, 'room_suitabilities:update', 'every roles can update room suitabilities', '2026-06-19 13:08:58', '2026-06-19 13:08:58', NULL),
(36, 'room_suitabilities:update_status', 'every roles can activate/deactivate/restore room suitabilities', '2026-06-19 13:09:20', '2026-06-19 13:09:20', NULL),
(37, 'room_suitabilities:delete', 'every roles can delete room suitabilities', '2026-06-19 13:10:13', '2026-06-19 13:10:13', NULL),
(38, 'orders:create', 'every roles can create order', '2026-06-19 13:10:48', '2026-06-19 13:10:48', NULL),
(39, 'orders:read', 'every roles can read order', '2026-06-19 13:11:01', '2026-06-19 13:11:01', NULL),
(40, 'orders:update', 'every roles can update order', '2026-06-19 13:11:10', '2026-06-19 13:11:10', NULL),
(41, 'orders_requets:create', 'every roles can create order request', '2026-06-19 13:12:15', '2026-06-19 13:12:15', NULL),
(42, 'orders_requets:read', 'every roles can read order request', '2026-06-19 13:12:22', '2026-06-19 13:12:22', NULL),
(43, 'orders_requets:update', 'every roles can update order request', '2026-06-19 13:12:44', '2026-06-19 13:12:44', NULL),
(44, 'payment_method:create', 'only admin can create payment method', '2026-06-19 13:13:56', '2026-06-19 13:13:56', NULL),
(45, 'payment_method:read', 'every role can read payment method', '2026-06-19 13:14:13', '2026-06-19 13:14:13', NULL),
(46, 'payment_method:update', 'only admin can update payment method', '2026-06-19 13:15:22', '2026-06-19 13:15:22', NULL),
(47, 'payment_method:update_status', 'only admin can activate/deactivate/restore payment method', '2026-06-19 13:15:37', '2026-06-19 13:15:37', NULL),
(48, 'payment_method:delete', 'only admin can delete payment method', '2026-06-19 13:15:49', '2026-06-19 13:15:49', NULL),
(49, 'test:delete permission', 'only admin can delete payment method', '2026-06-19 16:00:46', '2026-06-19 16:01:28', '2026-06-19 16:01:28'),
(50, 'collections:restore', 'every roles can restore collection', '2026-06-19 17:22:36', '2026-06-19 17:22:36', NULL),
(51, 'category:create', 'every role can create category', '2026-06-20 06:37:05', '2026-06-20 06:37:05', NULL),
(52, 'category:read', 'every role can read categories list', '2026-06-20 06:37:19', '2026-06-20 06:37:19', NULL),
(53, 'category:update', 'every role can update category', '2026-06-20 06:37:33', '2026-06-20 06:37:33', NULL),
(54, 'category:update_status', 'every role can activate/deactivate/restore category', '2026-06-20 06:38:22', '2026-06-20 06:38:22', NULL),
(55, 'category:delete', 'every role can delete category', '2026-06-20 06:38:31', '2026-06-20 06:38:31', NULL),
(56, 'roles:grant_role_to_user', 'only admin can grant role to user', '2026-06-20 06:52:16', '2026-06-20 06:52:16', NULL),
(57, 'permission:grant_permission_to_role', 'only admin can grant permission to role', '2026-06-20 06:52:37', '2026-06-20 06:52:37', NULL),
(58, 'payment_methods:create', 'only admin can create payment method', '2026-06-23 15:56:50', '2026-06-23 15:56:50', NULL),
(59, 'payment_methods:read', 'every role can read payment method', '2026-06-23 15:57:06', '2026-06-23 15:57:06', NULL),
(60, 'payment_methods:update', 'only admin can update payment method', '2026-06-23 15:57:30', '2026-06-23 15:57:30', NULL),
(61, 'payment_methods:delete', 'only admin can delete payment method', '2026-06-23 15:57:40', '2026-06-23 15:57:40', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `collection_id` int(11) DEFAULT NULL,
  `product_name` varchar(150) NOT NULL,
  `material_id` int(11) NOT NULL,
  `fabric_type_id` int(11) NOT NULL,
  `room_suitability_id` int(11) NOT NULL,
  `status` enum('in stock','out of stock','discontinued') NOT NULL DEFAULT 'in stock',
  `deleted_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `category_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `collection_id`, `product_name`, `material_id`, `fabric_type_id`, `room_suitability_id`, `status`, `deleted_at`, `created_at`, `updated_at`, `category_id`) VALUES
(1, 1, 'Ellora Ottoman', 1, 1, 1, 'in stock', NULL, '2026-06-20 08:06:11', '2026-07-01 11:02:44', 1),
(2, 1, 'Ellora Armless Chair', 1, 1, 1, 'in stock', NULL, '2026-06-20 13:13:47', '2026-06-29 13:34:26', 1),
(3, 1, 'Ellora Sofa (L/R)', 1, 1, 1, 'in stock', NULL, '2026-06-20 13:15:00', '2026-06-20 13:15:00', 1),
(4, 1, 'Ellora Chaise Lounge (L/R)', 1, 1, 2, 'in stock', NULL, '2026-06-20 13:16:20', '2026-06-20 13:16:20', 1),
(5, 1, 'Ellora Corner Chair (L/R)', 1, 1, 2, 'in stock', NULL, '2026-06-20 13:17:38', '2026-06-20 13:17:38', 1),
(6, 1, 'Ellora Armchair', 1, 1, 2, 'in stock', NULL, '2026-06-20 13:20:26', '2026-06-20 13:20:26', 1),
(7, 1, 'Ellora Loveseat', 1, 1, 3, 'in stock', NULL, '2026-06-20 13:21:50', '2026-06-20 13:21:50', 1),
(8, 2, 'Beluga Ottoman', 1, 1, 1, 'in stock', NULL, '2026-06-20 13:23:32', '2026-06-20 13:26:16', 1),
(9, 2, 'Beluga Armless Chair', 1, 1, 1, 'in stock', NULL, '2026-06-20 13:28:12', '2026-06-20 13:28:12', 1),
(10, 2, 'Beluga Sofa (L/R)', 1, 1, 1, 'in stock', NULL, '2026-06-20 13:32:50', '2026-06-20 13:32:50', 1),
(11, 2, 'Beluga Chaise Lounge (L/R)', 1, 1, 2, 'in stock', NULL, '2026-06-20 13:35:22', '2026-06-20 13:35:22', 1),
(12, 2, 'Beluga Corner Chair (L/R)', 1, 1, 2, 'in stock', NULL, '2026-06-20 13:36:21', '2026-06-20 13:36:21', 1),
(13, 2, 'Beluga Chair', 1, 1, 1, 'in stock', NULL, '2026-06-20 13:37:42', '2026-06-20 13:37:42', 1),
(14, 2, 'Beluga Loveseat', 1, 1, 3, 'in stock', NULL, '2026-06-20 13:38:31', '2026-06-20 13:38:31', 1),
(15, 2, 'Beluga 2 Seater Sectional (L/R)', 1, 1, 4, 'in stock', NULL, '2026-06-20 13:39:42', '2026-06-20 13:39:42', 1),
(16, 3, 'Magnes Ottoman', 1, 1, 1, 'in stock', NULL, '2026-06-20 13:41:42', '2026-06-20 13:41:42', 1),
(17, 3, 'Magnes Chair', 1, 1, 1, 'in stock', NULL, '2026-06-20 13:42:53', '2026-06-20 13:42:53', 1),
(18, 3, 'Magnes Chair', 1, 1, 2, 'in stock', NULL, '2026-06-20 13:44:23', '2026-06-20 13:44:23', 1),
(19, 3, 'Magnes Loveseat', 1, 1, 3, 'in stock', NULL, '2026-06-20 13:45:31', '2026-06-20 13:45:31', 1),
(20, 3, 'Magnes Loveseat', 1, 1, 4, 'in stock', NULL, '2026-06-20 13:46:17', '2026-06-20 13:46:17', 1),
(21, 1, 'Ellora Standard Cushion', 1, 1, 1, 'in stock', NULL, '2026-06-22 12:49:47', '2026-06-22 12:49:47', 2),
(22, 1, 'Ellora Core Overlapping Cushion', 1, 1, 1, 'in stock', NULL, '2026-06-22 12:50:37', '2026-06-22 12:50:37', 2),
(23, 1, 'Ellora Wide Cushion', 1, 1, 1, 'in stock', NULL, '2026-06-22 12:51:19', '2026-06-22 12:51:19', 2),
(24, 2, 'Beluga Standard Cushion', 1, 1, 1, 'in stock', NULL, '2026-06-22 12:55:13', '2026-06-22 12:55:13', 2),
(25, 2, 'Beluga Core Overlapping Cushion', 1, 1, 1, 'in stock', NULL, '2026-06-22 12:56:32', '2026-06-22 12:56:32', 2),
(26, 2, 'Beluga Wide Cushion', 1, 1, 1, 'in stock', NULL, '2026-06-22 12:57:05', '2026-06-22 12:57:05', 2),
(27, 3, 'Magnes Standard Cushion', 1, 1, 1, 'in stock', NULL, '2026-06-22 12:58:33', '2026-06-22 12:58:33', 2),
(28, 3, 'Magnes Core Cushion', 1, 1, 1, 'in stock', NULL, '2026-06-22 12:58:59', '2026-06-22 12:58:59', 2),
(29, 3, 'Magnes Wide Cushion', 1, 1, 1, 'in stock', NULL, '2026-06-22 12:59:25', '2026-06-28 16:01:43', 2),
(34, NULL, 'Test', 1, 1, 2, 'in stock', '2026-08-01 13:01:31', '2026-07-31 17:46:37', '2026-08-01 13:01:31', 1),
(35, 1, 'test', 1, 1, 3, 'in stock', '2026-07-31 18:12:32', '2026-07-31 18:12:12', '2026-07-31 18:12:32', 1),
(36, 2, 'test', 1, 1, 3, 'in stock', '2026-08-01 12:15:57', '2026-07-31 19:32:41', '2026-08-01 12:15:57', 1),
(37, 2, 'test', 1, 1, 1, 'in stock', '2026-08-01 12:15:54', '2026-07-31 19:34:20', '2026-08-01 12:15:54', 1),
(38, 2, 'test', 1, 1, 2, 'in stock', '2026-08-01 12:15:52', '2026-08-01 12:14:59', '2026-08-01 12:15:52', 1);

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `is_main` tinyint(1) DEFAULT 0,
  `deleted_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `image_url`, `is_main`, `deleted_at`, `created_at`, `updated_at`) VALUES
(3, 2, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/6981c567f06a5_ElloraArmlesschair01.png', 1, NULL, '2026-06-20 13:13:47', '2026-06-20 13:13:47'),
(4, 2, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/6981c58098a15_ElloraArmlesschair02.png', 0, NULL, '2026-06-20 13:13:47', '2026-06-20 13:13:47'),
(5, 3, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/6981c03286f77_ElloraRightHandchair01.png', 1, NULL, '2026-06-20 13:15:00', '2026-06-20 13:15:00'),
(6, 3, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/6981c0640d8d1_ElloraRightHandchair02.png', 0, NULL, '2026-06-20 13:15:00', '2026-06-20 13:15:00'),
(7, 4, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/6981c3dc655a4_ElloraChaiseLounge01.png', 1, NULL, '2026-06-20 13:16:20', '2026-06-20 13:16:20'),
(8, 4, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/6981c3f62f17e_ElloraChaiseLounge03.png', 0, NULL, '2026-06-20 13:16:20', '2026-06-20 13:16:20'),
(9, 5, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/6981c455c4a4a_ElloraCornerchair02.png', 1, NULL, '2026-06-20 13:17:38', '2026-06-20 13:17:38'),
(10, 5, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/6981c4765037d_ElloraCornerchair01.png', 0, NULL, '2026-06-20 13:17:38', '2026-06-20 13:17:38'),
(11, 6, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/6981c3335701f_ElloraArmchair011.png', 1, NULL, '2026-06-20 13:20:26', '2026-06-20 13:20:26'),
(12, 6, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/6981c34c70a95_ElloraArmchair021.png', 0, NULL, '2026-06-20 13:20:26', '2026-06-20 13:20:26'),
(13, 7, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/6981c1b1f3d73_ElloraLoveseat01.png', 1, NULL, '2026-06-20 13:21:50', '2026-06-20 13:21:50'),
(14, 7, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/6981c1ca8a013_ElloraLoveseat02.png', 0, NULL, '2026-06-20 13:21:50', '2026-06-20 13:21:50'),
(15, 8, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/6938528b6522d_BelugaOttoman01.png', 1, NULL, '2026-06-20 13:23:32', '2026-06-20 13:23:32'),
(16, 8, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/693852a426df6_BelugaOttoman02.png', 0, NULL, '2026-06-20 13:23:32', '2026-06-20 13:23:32'),
(17, 9, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/6962530880571_BelugaArmlesschair01.png', 1, NULL, '2026-06-20 13:28:12', '2026-06-20 13:28:12'),
(18, 9, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/69625328ef0e0_BelugaArmlesschair02.png', 0, NULL, '2026-06-20 13:28:12', '2026-06-20 13:28:12'),
(19, 10, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/696250f66fb04_BelugaRightArmchair01.png', 1, NULL, '2026-06-20 13:32:50', '2026-06-20 13:32:50'),
(20, 10, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/6962510dbc03d_BelugaLeftArmchair01.png', 0, NULL, '2026-06-20 13:32:50', '2026-06-20 13:32:50'),
(21, 11, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/69384ffb14380_BelugaChaiseLounge02.png', 1, NULL, '2026-06-20 13:35:22', '2026-06-20 13:35:22'),
(22, 11, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/69384fdc31d16_BelugaChaiseLounge01.png', 0, NULL, '2026-06-20 13:35:22', '2026-06-20 13:35:22'),
(23, 12, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/6938518181147_BelugaCornerChair01.png', 1, NULL, '2026-06-20 13:36:21', '2026-06-20 13:36:21'),
(24, 12, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/693851ab1db66_BelugaCornerChair02.png', 0, NULL, '2026-06-20 13:36:21', '2026-06-20 13:36:21'),
(25, 13, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/69384e8644b12_BelugaArmchair01.png', 1, NULL, '2026-06-20 13:37:42', '2026-06-20 13:37:42'),
(26, 13, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/69384eb5685b2_BelugaArmchair02.png', 0, NULL, '2026-06-20 13:37:42', '2026-06-20 13:37:42'),
(27, 14, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/69384d457456a_BelugaLoveseat01.png', 1, NULL, '2026-06-20 13:38:31', '2026-06-20 13:38:31'),
(28, 14, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/69384d922e374_BelugaLoveseat02.png', 0, NULL, '2026-06-20 13:38:31', '2026-06-20 13:38:31'),
(29, 15, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/693850b754db6_BelugaSectionalSofa02.png', 1, NULL, '2026-06-20 13:39:42', '2026-06-20 13:39:42'),
(30, 15, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/6938509008432_BelugaSectionalSofa01.png', 0, NULL, '2026-06-20 13:39:42', '2026-06-20 13:39:42'),
(31, 16, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/69160f60084b4_MagnulaMagnesOttoman01.png', 1, NULL, '2026-06-20 13:41:42', '2026-06-20 13:41:42'),
(32, 16, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/69160f82edbf9_MagnulaMagnesOttoman02.png', 0, NULL, '2026-06-20 13:41:42', '2026-06-20 13:41:42'),
(33, 17, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/69160dbec82ea_MagnulaMagnesChair01.png', 1, NULL, '2026-06-20 13:42:53', '2026-06-20 13:42:53'),
(34, 17, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/69160ddabe992_MagnulaMagnesChair02.png', 0, NULL, '2026-06-20 13:42:53', '2026-06-20 13:42:53'),
(35, 18, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/69160e8f1e418_MagnulaMagnesChaiseLounge01.png', 1, NULL, '2026-06-20 13:44:23', '2026-06-20 13:44:23'),
(36, 18, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/69160ec001cea_MagnulaMagnesChaiseLounge02.png', 0, NULL, '2026-06-20 13:44:23', '2026-06-20 13:44:23'),
(37, 19, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/69160cb02cc55_MagnulaMagnesLoveseat01.png', 1, NULL, '2026-06-20 13:45:31', '2026-06-20 13:45:31'),
(38, 19, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/69160cd0df149_MagnulaMagnesLoveseat02.png', 0, NULL, '2026-06-20 13:45:31', '2026-06-20 13:45:31'),
(39, 20, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/69160bc558748_MagnulaMagnesSofa01.png', 1, NULL, '2026-06-20 13:46:17', '2026-06-20 13:46:17'),
(40, 20, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/69160beb9ea33_MagnulaMagnesSofa02.png', 0, NULL, '2026-06-20 13:46:17', '2026-06-20 13:46:17'),
(41, 21, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/6986aee1e6a16_Cushionset2.png', 0, NULL, '2026-06-22 12:49:47', '2026-06-22 12:49:47'),
(42, 22, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/6986af2a553cb_Cushionset1.png', 0, NULL, '2026-06-22 12:50:37', '2026-06-22 12:50:37'),
(43, 23, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/6986af66f26fa_Cushionset3.png', 0, NULL, '2026-06-22 12:51:19', '2026-06-22 12:51:19'),
(44, 24, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/693935ca36bf5_untitled165.png', 0, NULL, '2026-06-22 12:55:13', '2026-06-22 12:55:13'),
(45, 25, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/6939360b109f4_untitled164.png', 0, NULL, '2026-06-22 12:56:32', '2026-06-22 12:56:32'),
(46, 26, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/69393698846b1_untitled166.png', 0, NULL, '2026-06-22 12:57:05', '2026-06-22 12:57:05'),
(47, 27, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/698726d1eee7c_MagnesCushion1.png', 0, NULL, '2026-06-22 12:58:33', '2026-06-22 12:58:33'),
(48, 28, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/698726efcd473_MagnesCushion2.png', 0, NULL, '2026-06-22 12:58:59', '2026-06-22 12:58:59'),
(49, 29, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/6987270c33e3d_MagnesCushion3.png', 0, NULL, '2026-06-22 12:59:25', '2026-06-22 12:59:25'),
(51, 1, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/6981c50e81500_ElloraOttoman01.png', 0, NULL, '2026-06-27 18:32:11', '2026-06-27 18:32:11'),
(52, 1, 'https://d1yei2z3i6k35z.cloudfront.net/14433334/6981c52e24bb7_ElloraOttoman02.png', 0, NULL, '2026-06-27 18:32:24', '2026-06-27 18:32:24'),
(57, 34, 'https://pub-c0d91e27663a41a5a1671bb31cabfb2a.r2.dev/1785519977760-g7jz8o-summerdream-02.png', 0, NULL, '2026-07-31 17:46:37', '2026-07-31 17:46:37'),
(59, 35, 'https://pub-c0d91e27663a41a5a1671bb31cabfb2a.r2.dev/1785521530819-enk125-founder.png', 0, NULL, '2026-07-31 18:12:12', '2026-07-31 18:12:12'),
(60, 36, 'https://pub-c0d91e27663a41a5a1671bb31cabfb2a.r2.dev/1785526359601-jd2ggp-nutrition-mobile_1.png', 0, NULL, '2026-07-31 19:32:41', '2026-07-31 19:32:41'),
(61, 37, 'https://pub-c0d91e27663a41a5a1671bb31cabfb2a.r2.dev/1785526457893-6955v9-nutrition-mobile_1.png', 0, NULL, '2026-07-31 19:34:20', '2026-07-31 19:34:20'),
(62, 38, 'https://pub-c0d91e27663a41a5a1671bb31cabfb2a.r2.dev/1785586495292-qsuiej-summerdream2_2x.png', 0, NULL, '2026-08-01 12:14:59', '2026-08-01 12:14:59');

-- --------------------------------------------------------

--
-- Table structure for table `product_requests`
--

CREATE TABLE `product_requests` (
  `id` int(11) NOT NULL,
  `customer_name` varchar(100) NOT NULL,
  `customer_phone` varchar(15) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `product_variant_id` int(11) DEFAULT NULL,
  `requested_quantity` int(11) DEFAULT 1,
  `description` longtext DEFAULT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `deleted_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_variants`
--

CREATE TABLE `product_variants` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `overall_size` varchar(100) NOT NULL,
  `seat_size` varchar(100) DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL,
  `price` decimal(15,2) NOT NULL,
  `stock_quantity` int(11) DEFAULT 0,
  `deleted_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_variants`
--

INSERT INTO `product_variants` (`id`, `product_id`, `overall_size`, `seat_size`, `color`, `price`, `stock_quantity`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 1, 'W30 x D28 x H17', 'W30 x D28 x H17', '#D6C4B3', 80.00, 7, NULL, '2026-06-20 08:06:11', '2026-08-01 09:12:35'),
(2, 2, 'W36 x D38 x H27', 'W36 x D28 x H17', '#D6C4B3', 120.00, 8, NULL, '2026-06-20 13:13:47', '2026-08-01 09:54:43'),
(3, 3, 'W43 x D38 x H27', 'W35 x D28 x H17', '#D6C4B3', 160.00, 5, NULL, '2026-06-20 13:15:00', '2026-06-29 14:28:18'),
(4, 4, 'W43 x D72 x H27', 'W35 x D62 x H17', '#D6C4B3', 180.00, 10, NULL, '2026-06-20 13:16:20', '2026-06-20 13:16:20'),
(5, 5, 'W48 x D48 x H27', 'W38 x D38 x H17', '#D6C4B3', 220.00, 10, NULL, '2026-06-20 13:17:38', '2026-06-20 13:17:38'),
(6, 6, 'W44 x D38 x H27', 'W28 x D28 x H17', '#D6C4B3', 280.00, 8, NULL, '2026-06-20 13:20:26', '2026-07-31 17:02:50'),
(7, 7, 'W44 x D38 x H27', 'W28 x D28 x H17', '#D6C4B3', 400.00, 10, NULL, '2026-06-20 13:21:50', '2026-06-20 13:21:50'),
(8, 8, 'W30 x D28 x H27', 'W30 x D28 x H17', '#8F5D41', 80.00, 7, NULL, '2026-06-20 13:23:32', '2026-06-28 10:33:51'),
(9, 9, 'W38 x D38 x H27', 'W38 x D28 x H17', '#8F5D41', 120.00, 10, NULL, '2026-06-20 13:28:12', '2026-06-20 13:28:12'),
(10, 10, 'W48 x D38 x H27', 'W38 x D28 x H17', '#8F5D41', 160.00, 10, NULL, '2026-06-20 13:32:50', '2026-06-20 13:32:50'),
(11, 11, 'W48 x D72 x H27', 'W38 x D62 x H17', '#8F5D41', 180.00, 10, NULL, '2026-06-20 13:35:22', '2026-06-20 13:35:22'),
(12, 12, 'W48 x D48 x H27', 'W38 x D38 x H17', '#8F5D41', 220.00, 10, NULL, '2026-06-20 13:36:21', '2026-06-20 13:36:21'),
(13, 13, 'W48 x D48 x H27', 'W38 x D38 x H17', '#8F5D41', 280.00, 10, NULL, '2026-06-20 13:37:42', '2026-06-20 13:37:42'),
(14, 14, 'W72 x D38 x H27', ' W52 x D28 x H17', '#8F5D41', 400.00, 10, NULL, '2026-06-20 13:38:31', '2026-06-20 13:38:31'),
(15, 15, 'W86 x D28 x H27', 'W76 x D28 x H17', '#8F5D41', 600.00, 8, NULL, '2026-06-20 13:39:42', '2026-07-31 19:40:26'),
(16, 16, 'W36 x D36 x H16', 'W36 x D36 x H16', '#75472F', 80.00, 10, NULL, '2026-06-20 13:41:42', '2026-06-20 13:41:42'),
(17, 17, 'W36 x D43.5 x H30', 'W36 x D28 x H16.5', '#75472F', 160.00, 7, NULL, '2026-06-20 13:42:53', '2026-07-01 09:56:38'),
(18, 18, 'W36 x D66 x H30', 'W36 x D51 x H16.5', '#75472F', 220.00, 10, NULL, '2026-06-20 13:44:23', '2026-06-20 13:44:23'),
(19, 19, 'W60 x D43.5 x H30', 'W60 x D28 x H16.5', '#75472F', 400.00, 10, NULL, '2026-06-20 13:45:31', '2026-06-20 13:45:31'),
(20, 20, 'W84 x D43.5 x H30', 'W84 x D28 x H16.5', '#75472F', 600.00, 10, NULL, '2026-06-20 13:46:17', '2026-06-20 13:46:17'),
(21, 21, 'W18 x H16', NULL, '#D6C4B3', 20.00, 10, NULL, '2026-06-22 12:49:47', '2026-06-22 12:49:47'),
(22, 22, 'W22 x H16', NULL, '#D6C4B3', 26.00, 10, NULL, '2026-06-22 12:50:37', '2026-06-22 12:50:37'),
(23, 23, 'Custom Width x H16', NULL, '#D6C4B3', 32.00, 6, NULL, '2026-06-22 12:51:19', '2026-08-01 16:51:13'),
(24, 24, 'W18 x H16', NULL, '#8F5D41', 20.00, 10, NULL, '2026-06-22 12:55:13', '2026-06-22 12:55:13'),
(25, 25, 'W22 x H16', NULL, '#8F5D41', 26.00, 10, NULL, '2026-06-22 12:56:32', '2026-06-22 12:56:32'),
(26, 26, 'Custom Width x H16', NULL, '#8F5D41', 32.00, 9, NULL, '2026-06-22 12:57:05', '2026-08-01 14:54:22'),
(27, 27, 'W18 x H16', NULL, '#75472F', 20.00, 10, NULL, '2026-06-22 12:58:33', '2026-06-22 12:58:33'),
(28, 28, 'W22 x H16', NULL, '#75472F', 26.00, 10, NULL, '2026-06-22 12:58:59', '2026-06-22 12:58:59'),
(29, 29, 'Custom Width x H16', NULL, '#75472F', 32.00, 10, NULL, '2026-06-22 12:59:25', '2026-06-22 12:59:25'),
(33, 34, '12', '12', '#000000', 12.00, 12, NULL, '2026-07-31 17:46:37', '2026-07-31 17:46:37'),
(34, 35, '12', '12', '#232323', 12.00, 12, NULL, '2026-07-31 18:12:12', '2026-07-31 18:12:12'),
(35, 36, '12', '12', '#121212', 12.00, 12, NULL, '2026-07-31 19:32:41', '2026-07-31 19:32:41'),
(36, 37, '12', '12', '#232323', 12.00, 12, NULL, '2026-07-31 19:34:20', '2026-07-31 19:34:20'),
(37, 38, '12', '12', '#121212', 22.00, 12, NULL, '2026-08-01 12:14:59', '2026-08-01 12:14:59');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `role_name` varchar(100) NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `role_name`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 'Administrator', NULL, '2026-06-19 11:22:33', '2026-06-19 16:32:44'),
(2, 'Staff', NULL, '2026-06-19 11:45:40', '2026-06-29 11:06:22');

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

CREATE TABLE `role_permissions` (
  `role_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `role_permissions`
--

INSERT INTO `role_permissions` (`role_id`, `permission_id`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(1, 7),
(1, 8),
(1, 11),
(1, 12),
(1, 13),
(1, 14),
(1, 15),
(1, 16),
(1, 17),
(1, 18),
(1, 19),
(1, 20),
(1, 21),
(1, 22),
(1, 23),
(1, 24),
(1, 25),
(1, 26),
(1, 27),
(1, 28),
(1, 29),
(1, 30),
(1, 31),
(1, 32),
(1, 33),
(1, 34),
(1, 35),
(1, 36),
(1, 37),
(1, 38),
(1, 39),
(1, 40),
(1, 41),
(1, 42),
(1, 43),
(1, 44),
(1, 45),
(1, 46),
(1, 47),
(1, 48),
(1, 50),
(1, 51),
(1, 52),
(1, 53),
(1, 54),
(1, 55),
(1, 56),
(1, 57),
(1, 58),
(1, 59),
(1, 60),
(1, 61),
(2, 15),
(2, 16),
(2, 17),
(2, 18),
(2, 19),
(2, 20),
(2, 21),
(2, 22),
(2, 23),
(2, 24),
(2, 25),
(2, 26),
(2, 27),
(2, 28),
(2, 29),
(2, 30),
(2, 31),
(2, 32),
(2, 33),
(2, 34),
(2, 35),
(2, 36),
(2, 37),
(2, 38),
(2, 39),
(2, 40),
(2, 41),
(2, 42),
(2, 43),
(2, 45),
(2, 51),
(2, 52),
(2, 53),
(2, 54),
(2, 55);

-- --------------------------------------------------------

--
-- Table structure for table `room_suitabilities`
--

CREATE TABLE `room_suitabilities` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `deleted_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `room_suitabilities`
--

INSERT INTO `room_suitabilities` (`id`, `name`, `description`, `is_active`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 'Small (< 15 m²)', 'Tailored for cozy, efficient spaces. Ideal for studio apartments, compact bedrooms, reading nooks, or home offices where maximizing floor area is key.', 1, NULL, '2026-06-19 17:50:42', '2026-06-19 17:50:42'),
(2, 'Medium (15 - 25 m²)', 'Perfect for standard urban living. Optimally sized for typical 1-2 bedroom apartments, townhouses, and dedicated family rooms looking for a balanced footprint.', 1, NULL, '2026-06-19 17:51:19', '2026-06-19 17:53:49'),
(3, 'Large (25 - 40 m²)', 'Designed for generous layouts. Well-suited for spacious multi-bedroom homes, open-plan living areas, and formal lounges that call for a substantial focal point.', 1, NULL, '2026-06-19 17:51:26', '2026-06-19 17:51:26'),
(4, 'Grand (> 40 m²)', 'Crafted for expansive architectural spaces. Majestic scale ideal for luxury villas, open-concept penthouses, double-height ceilings, and high-end commercial lobbies.', 1, NULL, '2026-06-19 17:51:33', '2026-06-29 12:01:35');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE `user_roles` (
  `user_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_category_name_not_deleted` (`category_name`);

--
-- Indexes for table `collections`
--
ALTER TABLE `collections`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_collection_name_active` (`collection_name`,`deleted_at`);

--
-- Indexes for table `collection_images`
--
ALTER TABLE `collection_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `collection_id` (`collection_id`);

--
-- Indexes for table `fabric_types`
--
ALTER TABLE `fabric_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_fabric_type_name_active` (`name`,`deleted_at`);

--
-- Indexes for table `materials`
--
ALTER TABLE `materials`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_material_name_active` (`name`,`deleted_at`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_code` (`order_code`),
  ADD UNIQUE KEY `order_code_2` (`order_code`),
  ADD UNIQUE KEY `order_code_3` (`order_code`),
  ADD UNIQUE KEY `order_code_4` (`order_code`),
  ADD UNIQUE KEY `order_code_5` (`order_code`),
  ADD UNIQUE KEY `order_code_6` (`order_code`),
  ADD UNIQUE KEY `order_code_7` (`order_code`),
  ADD UNIQUE KEY `order_code_8` (`order_code`),
  ADD UNIQUE KEY `order_code_9` (`order_code`),
  ADD UNIQUE KEY `order_code_10` (`order_code`),
  ADD UNIQUE KEY `order_code_11` (`order_code`),
  ADD UNIQUE KEY `order_code_12` (`order_code`),
  ADD UNIQUE KEY `order_code_13` (`order_code`),
  ADD UNIQUE KEY `order_code_14` (`order_code`),
  ADD UNIQUE KEY `order_code_15` (`order_code`),
  ADD UNIQUE KEY `order_code_16` (`order_code`),
  ADD UNIQUE KEY `order_code_17` (`order_code`),
  ADD UNIQUE KEY `order_code_18` (`order_code`),
  ADD UNIQUE KEY `order_code_19` (`order_code`),
  ADD UNIQUE KEY `order_code_20` (`order_code`),
  ADD UNIQUE KEY `order_code_21` (`order_code`),
  ADD UNIQUE KEY `order_code_22` (`order_code`),
  ADD UNIQUE KEY `order_code_23` (`order_code`),
  ADD UNIQUE KEY `order_code_24` (`order_code`),
  ADD UNIQUE KEY `order_code_25` (`order_code`),
  ADD UNIQUE KEY `order_code_26` (`order_code`),
  ADD UNIQUE KEY `order_code_27` (`order_code`),
  ADD UNIQUE KEY `order_code_28` (`order_code`),
  ADD UNIQUE KEY `order_code_29` (`order_code`),
  ADD UNIQUE KEY `order_code_30` (`order_code`),
  ADD UNIQUE KEY `order_code_31` (`order_code`),
  ADD UNIQUE KEY `order_code_32` (`order_code`),
  ADD UNIQUE KEY `order_code_33` (`order_code`),
  ADD UNIQUE KEY `order_code_34` (`order_code`),
  ADD UNIQUE KEY `order_code_35` (`order_code`),
  ADD UNIQUE KEY `order_code_36` (`order_code`),
  ADD UNIQUE KEY `order_code_37` (`order_code`),
  ADD UNIQUE KEY `order_code_38` (`order_code`),
  ADD UNIQUE KEY `order_code_39` (`order_code`),
  ADD UNIQUE KEY `order_code_40` (`order_code`),
  ADD UNIQUE KEY `order_code_41` (`order_code`),
  ADD UNIQUE KEY `order_code_42` (`order_code`),
  ADD UNIQUE KEY `order_code_43` (`order_code`),
  ADD UNIQUE KEY `order_code_44` (`order_code`),
  ADD UNIQUE KEY `order_code_45` (`order_code`),
  ADD UNIQUE KEY `order_code_46` (`order_code`),
  ADD UNIQUE KEY `order_code_47` (`order_code`),
  ADD UNIQUE KEY `order_code_48` (`order_code`),
  ADD UNIQUE KEY `order_code_49` (`order_code`),
  ADD UNIQUE KEY `order_code_50` (`order_code`),
  ADD UNIQUE KEY `order_code_51` (`order_code`),
  ADD UNIQUE KEY `order_code_52` (`order_code`),
  ADD UNIQUE KEY `order_code_53` (`order_code`),
  ADD UNIQUE KEY `order_code_54` (`order_code`),
  ADD UNIQUE KEY `order_code_55` (`order_code`),
  ADD UNIQUE KEY `order_code_56` (`order_code`),
  ADD UNIQUE KEY `order_code_57` (`order_code`),
  ADD UNIQUE KEY `order_code_58` (`order_code`),
  ADD UNIQUE KEY `order_code_59` (`order_code`),
  ADD UNIQUE KEY `order_code_60` (`order_code`),
  ADD UNIQUE KEY `order_code_61` (`order_code`),
  ADD UNIQUE KEY `order_code_62` (`order_code`),
  ADD KEY `payment_method_id` (`payment_method_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `product_variant_id` (`product_variant_id`);

--
-- Indexes for table `payment_methods`
--
ALTER TABLE `payment_methods`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD UNIQUE KEY `code_2` (`code`),
  ADD UNIQUE KEY `code_3` (`code`),
  ADD UNIQUE KEY `code_4` (`code`),
  ADD UNIQUE KEY `code_5` (`code`),
  ADD UNIQUE KEY `code_6` (`code`),
  ADD UNIQUE KEY `code_7` (`code`),
  ADD UNIQUE KEY `code_8` (`code`),
  ADD UNIQUE KEY `code_9` (`code`),
  ADD UNIQUE KEY `code_10` (`code`),
  ADD UNIQUE KEY `code_11` (`code`),
  ADD UNIQUE KEY `code_12` (`code`),
  ADD UNIQUE KEY `code_13` (`code`),
  ADD UNIQUE KEY `code_14` (`code`),
  ADD UNIQUE KEY `code_15` (`code`),
  ADD UNIQUE KEY `code_16` (`code`),
  ADD UNIQUE KEY `code_17` (`code`),
  ADD UNIQUE KEY `code_18` (`code`),
  ADD UNIQUE KEY `code_19` (`code`),
  ADD UNIQUE KEY `code_20` (`code`),
  ADD UNIQUE KEY `code_21` (`code`),
  ADD UNIQUE KEY `code_22` (`code`),
  ADD UNIQUE KEY `code_23` (`code`),
  ADD UNIQUE KEY `code_24` (`code`),
  ADD UNIQUE KEY `code_25` (`code`),
  ADD UNIQUE KEY `code_26` (`code`),
  ADD UNIQUE KEY `code_27` (`code`),
  ADD UNIQUE KEY `code_28` (`code`),
  ADD UNIQUE KEY `code_29` (`code`),
  ADD UNIQUE KEY `code_30` (`code`),
  ADD UNIQUE KEY `code_31` (`code`),
  ADD UNIQUE KEY `code_32` (`code`),
  ADD UNIQUE KEY `code_33` (`code`),
  ADD UNIQUE KEY `code_34` (`code`),
  ADD UNIQUE KEY `code_35` (`code`),
  ADD UNIQUE KEY `code_36` (`code`),
  ADD UNIQUE KEY `code_37` (`code`),
  ADD UNIQUE KEY `code_38` (`code`),
  ADD UNIQUE KEY `code_39` (`code`),
  ADD UNIQUE KEY `code_40` (`code`),
  ADD UNIQUE KEY `code_41` (`code`),
  ADD UNIQUE KEY `code_42` (`code`),
  ADD UNIQUE KEY `code_43` (`code`),
  ADD UNIQUE KEY `code_44` (`code`),
  ADD UNIQUE KEY `code_45` (`code`),
  ADD UNIQUE KEY `code_46` (`code`),
  ADD UNIQUE KEY `code_47` (`code`),
  ADD UNIQUE KEY `code_48` (`code`),
  ADD UNIQUE KEY `code_49` (`code`),
  ADD UNIQUE KEY `code_50` (`code`),
  ADD UNIQUE KEY `code_51` (`code`),
  ADD UNIQUE KEY `code_52` (`code`),
  ADD UNIQUE KEY `code_53` (`code`),
  ADD UNIQUE KEY `code_54` (`code`),
  ADD UNIQUE KEY `code_55` (`code`),
  ADD UNIQUE KEY `code_56` (`code`),
  ADD UNIQUE KEY `code_57` (`code`),
  ADD UNIQUE KEY `code_58` (`code`),
  ADD UNIQUE KEY `code_59` (`code`),
  ADD UNIQUE KEY `code_60` (`code`),
  ADD UNIQUE KEY `code_61` (`code`),
  ADD UNIQUE KEY `code_62` (`code`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permission_key` (`permission_key`),
  ADD UNIQUE KEY `permission_key_2` (`permission_key`),
  ADD UNIQUE KEY `permission_key_3` (`permission_key`),
  ADD UNIQUE KEY `permission_key_4` (`permission_key`),
  ADD UNIQUE KEY `permission_key_5` (`permission_key`),
  ADD UNIQUE KEY `permission_key_6` (`permission_key`),
  ADD UNIQUE KEY `permission_key_7` (`permission_key`),
  ADD UNIQUE KEY `permission_key_8` (`permission_key`),
  ADD UNIQUE KEY `permission_key_9` (`permission_key`),
  ADD UNIQUE KEY `permission_key_10` (`permission_key`),
  ADD UNIQUE KEY `permission_key_11` (`permission_key`),
  ADD UNIQUE KEY `permission_key_12` (`permission_key`),
  ADD UNIQUE KEY `permission_key_13` (`permission_key`),
  ADD UNIQUE KEY `permission_key_14` (`permission_key`),
  ADD UNIQUE KEY `permission_key_15` (`permission_key`),
  ADD UNIQUE KEY `permission_key_16` (`permission_key`),
  ADD UNIQUE KEY `permission_key_17` (`permission_key`),
  ADD UNIQUE KEY `permission_key_18` (`permission_key`),
  ADD UNIQUE KEY `permission_key_19` (`permission_key`),
  ADD UNIQUE KEY `permission_key_20` (`permission_key`),
  ADD UNIQUE KEY `permission_key_21` (`permission_key`),
  ADD UNIQUE KEY `permission_key_22` (`permission_key`),
  ADD UNIQUE KEY `permission_key_23` (`permission_key`),
  ADD UNIQUE KEY `permission_key_24` (`permission_key`),
  ADD UNIQUE KEY `permission_key_25` (`permission_key`),
  ADD UNIQUE KEY `permission_key_26` (`permission_key`),
  ADD UNIQUE KEY `permission_key_27` (`permission_key`),
  ADD UNIQUE KEY `permission_key_28` (`permission_key`),
  ADD UNIQUE KEY `permission_key_29` (`permission_key`),
  ADD UNIQUE KEY `permission_key_30` (`permission_key`),
  ADD UNIQUE KEY `permission_key_31` (`permission_key`),
  ADD UNIQUE KEY `permission_key_32` (`permission_key`),
  ADD UNIQUE KEY `permission_key_33` (`permission_key`),
  ADD UNIQUE KEY `permission_key_34` (`permission_key`),
  ADD UNIQUE KEY `permission_key_35` (`permission_key`),
  ADD UNIQUE KEY `permission_key_36` (`permission_key`),
  ADD UNIQUE KEY `permission_key_37` (`permission_key`),
  ADD UNIQUE KEY `permission_key_38` (`permission_key`),
  ADD UNIQUE KEY `permission_key_39` (`permission_key`),
  ADD UNIQUE KEY `permission_key_40` (`permission_key`),
  ADD UNIQUE KEY `permission_key_41` (`permission_key`),
  ADD UNIQUE KEY `permission_key_42` (`permission_key`),
  ADD UNIQUE KEY `permission_key_43` (`permission_key`),
  ADD UNIQUE KEY `permission_key_44` (`permission_key`),
  ADD UNIQUE KEY `permission_key_45` (`permission_key`),
  ADD UNIQUE KEY `permission_key_46` (`permission_key`),
  ADD UNIQUE KEY `permission_key_47` (`permission_key`),
  ADD UNIQUE KEY `permission_key_48` (`permission_key`),
  ADD UNIQUE KEY `permission_key_49` (`permission_key`),
  ADD UNIQUE KEY `permission_key_50` (`permission_key`),
  ADD UNIQUE KEY `permission_key_51` (`permission_key`),
  ADD UNIQUE KEY `permission_key_52` (`permission_key`),
  ADD UNIQUE KEY `permission_key_53` (`permission_key`),
  ADD UNIQUE KEY `permission_key_54` (`permission_key`),
  ADD UNIQUE KEY `permission_key_55` (`permission_key`),
  ADD UNIQUE KEY `permission_key_56` (`permission_key`),
  ADD UNIQUE KEY `permission_key_57` (`permission_key`),
  ADD UNIQUE KEY `permission_key_58` (`permission_key`),
  ADD UNIQUE KEY `permission_key_59` (`permission_key`),
  ADD UNIQUE KEY `permission_key_60` (`permission_key`),
  ADD UNIQUE KEY `permission_key_61` (`permission_key`),
  ADD UNIQUE KEY `permission_key_62` (`permission_key`),
  ADD UNIQUE KEY `permission_key_63` (`permission_key`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `products_category_id_foreign_idx` (`category_id`),
  ADD KEY `collection_id` (`collection_id`),
  ADD KEY `material_id` (`material_id`),
  ADD KEY `fabric_type_id` (`fabric_type_id`),
  ADD KEY `room_suitability_id` (`room_suitability_id`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `product_requests`
--
ALTER TABLE `product_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `product_variant_id` (`product_variant_id`);

--
-- Indexes for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `role_name` (`role_name`),
  ADD UNIQUE KEY `role_name_2` (`role_name`),
  ADD UNIQUE KEY `role_name_3` (`role_name`),
  ADD UNIQUE KEY `role_name_4` (`role_name`),
  ADD UNIQUE KEY `role_name_5` (`role_name`),
  ADD UNIQUE KEY `role_name_6` (`role_name`),
  ADD UNIQUE KEY `role_name_7` (`role_name`),
  ADD UNIQUE KEY `role_name_8` (`role_name`),
  ADD UNIQUE KEY `role_name_9` (`role_name`),
  ADD UNIQUE KEY `role_name_10` (`role_name`),
  ADD UNIQUE KEY `role_name_11` (`role_name`),
  ADD UNIQUE KEY `role_name_12` (`role_name`),
  ADD UNIQUE KEY `role_name_13` (`role_name`),
  ADD UNIQUE KEY `role_name_14` (`role_name`),
  ADD UNIQUE KEY `role_name_15` (`role_name`),
  ADD UNIQUE KEY `role_name_16` (`role_name`),
  ADD UNIQUE KEY `role_name_17` (`role_name`),
  ADD UNIQUE KEY `role_name_18` (`role_name`),
  ADD UNIQUE KEY `role_name_19` (`role_name`),
  ADD UNIQUE KEY `role_name_20` (`role_name`),
  ADD UNIQUE KEY `role_name_21` (`role_name`),
  ADD UNIQUE KEY `role_name_22` (`role_name`),
  ADD UNIQUE KEY `role_name_23` (`role_name`),
  ADD UNIQUE KEY `role_name_24` (`role_name`),
  ADD UNIQUE KEY `role_name_25` (`role_name`),
  ADD UNIQUE KEY `role_name_26` (`role_name`),
  ADD UNIQUE KEY `role_name_27` (`role_name`),
  ADD UNIQUE KEY `role_name_28` (`role_name`),
  ADD UNIQUE KEY `role_name_29` (`role_name`),
  ADD UNIQUE KEY `role_name_30` (`role_name`),
  ADD UNIQUE KEY `role_name_31` (`role_name`),
  ADD UNIQUE KEY `role_name_32` (`role_name`),
  ADD UNIQUE KEY `role_name_33` (`role_name`),
  ADD UNIQUE KEY `role_name_34` (`role_name`),
  ADD UNIQUE KEY `role_name_35` (`role_name`),
  ADD UNIQUE KEY `role_name_36` (`role_name`),
  ADD UNIQUE KEY `role_name_37` (`role_name`),
  ADD UNIQUE KEY `role_name_38` (`role_name`),
  ADD UNIQUE KEY `role_name_39` (`role_name`),
  ADD UNIQUE KEY `role_name_40` (`role_name`),
  ADD UNIQUE KEY `role_name_41` (`role_name`),
  ADD UNIQUE KEY `role_name_42` (`role_name`),
  ADD UNIQUE KEY `role_name_43` (`role_name`),
  ADD UNIQUE KEY `role_name_44` (`role_name`),
  ADD UNIQUE KEY `role_name_45` (`role_name`),
  ADD UNIQUE KEY `role_name_46` (`role_name`),
  ADD UNIQUE KEY `role_name_47` (`role_name`),
  ADD UNIQUE KEY `role_name_48` (`role_name`),
  ADD UNIQUE KEY `role_name_49` (`role_name`),
  ADD UNIQUE KEY `role_name_50` (`role_name`),
  ADD UNIQUE KEY `role_name_51` (`role_name`),
  ADD UNIQUE KEY `role_name_52` (`role_name`),
  ADD UNIQUE KEY `role_name_53` (`role_name`),
  ADD UNIQUE KEY `role_name_54` (`role_name`),
  ADD UNIQUE KEY `role_name_55` (`role_name`),
  ADD UNIQUE KEY `role_name_56` (`role_name`),
  ADD UNIQUE KEY `role_name_57` (`role_name`),
  ADD UNIQUE KEY `role_name_58` (`role_name`),
  ADD UNIQUE KEY `role_name_59` (`role_name`),
  ADD UNIQUE KEY `role_name_60` (`role_name`),
  ADD UNIQUE KEY `role_name_61` (`role_name`),
  ADD UNIQUE KEY `role_name_62` (`role_name`),
  ADD UNIQUE KEY `role_name_63` (`role_name`);

--
-- Indexes for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD PRIMARY KEY (`role_id`,`permission_id`),
  ADD KEY `permission_id` (`permission_id`);

--
-- Indexes for table `room_suitabilities`
--
ALTER TABLE `room_suitabilities`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_room_suitability_name_active` (`name`,`deleted_at`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `email_7` (`email`),
  ADD UNIQUE KEY `email_8` (`email`),
  ADD UNIQUE KEY `email_9` (`email`),
  ADD UNIQUE KEY `email_10` (`email`),
  ADD UNIQUE KEY `email_11` (`email`),
  ADD UNIQUE KEY `email_12` (`email`),
  ADD UNIQUE KEY `email_13` (`email`),
  ADD UNIQUE KEY `email_14` (`email`),
  ADD UNIQUE KEY `email_15` (`email`),
  ADD UNIQUE KEY `email_16` (`email`),
  ADD UNIQUE KEY `email_17` (`email`),
  ADD UNIQUE KEY `email_18` (`email`),
  ADD UNIQUE KEY `email_19` (`email`),
  ADD UNIQUE KEY `email_20` (`email`),
  ADD UNIQUE KEY `email_21` (`email`),
  ADD UNIQUE KEY `email_22` (`email`),
  ADD UNIQUE KEY `email_23` (`email`),
  ADD UNIQUE KEY `email_24` (`email`),
  ADD UNIQUE KEY `email_25` (`email`),
  ADD UNIQUE KEY `email_26` (`email`),
  ADD UNIQUE KEY `email_27` (`email`),
  ADD UNIQUE KEY `email_28` (`email`),
  ADD UNIQUE KEY `email_29` (`email`),
  ADD UNIQUE KEY `email_30` (`email`),
  ADD UNIQUE KEY `email_31` (`email`),
  ADD UNIQUE KEY `email_32` (`email`),
  ADD UNIQUE KEY `email_33` (`email`),
  ADD UNIQUE KEY `email_34` (`email`),
  ADD UNIQUE KEY `email_35` (`email`),
  ADD UNIQUE KEY `email_36` (`email`),
  ADD UNIQUE KEY `email_37` (`email`),
  ADD UNIQUE KEY `email_38` (`email`),
  ADD UNIQUE KEY `email_39` (`email`),
  ADD UNIQUE KEY `email_40` (`email`),
  ADD UNIQUE KEY `email_41` (`email`),
  ADD UNIQUE KEY `email_42` (`email`),
  ADD UNIQUE KEY `email_43` (`email`),
  ADD UNIQUE KEY `email_44` (`email`),
  ADD UNIQUE KEY `email_45` (`email`),
  ADD UNIQUE KEY `email_46` (`email`),
  ADD UNIQUE KEY `email_47` (`email`),
  ADD UNIQUE KEY `email_48` (`email`),
  ADD UNIQUE KEY `email_49` (`email`),
  ADD UNIQUE KEY `email_50` (`email`),
  ADD UNIQUE KEY `email_51` (`email`),
  ADD UNIQUE KEY `email_52` (`email`),
  ADD UNIQUE KEY `email_53` (`email`),
  ADD UNIQUE KEY `email_54` (`email`),
  ADD UNIQUE KEY `email_55` (`email`),
  ADD UNIQUE KEY `email_56` (`email`),
  ADD UNIQUE KEY `email_57` (`email`),
  ADD UNIQUE KEY `email_58` (`email`),
  ADD UNIQUE KEY `email_59` (`email`),
  ADD UNIQUE KEY `email_60` (`email`),
  ADD UNIQUE KEY `email_61` (`email`),
  ADD UNIQUE KEY `email_62` (`email`),
  ADD UNIQUE KEY `email_63` (`email`);

--
-- Indexes for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`user_id`,`role_id`),
  ADD KEY `role_id` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `collections`
--
ALTER TABLE `collections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `collection_images`
--
ALTER TABLE `collection_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT for table `fabric_types`
--
ALTER TABLE `fabric_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `materials`
--
ALTER TABLE `materials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `payment_methods`
--
ALTER TABLE `payment_methods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT for table `product_requests`
--
ALTER TABLE `product_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `product_variants`
--
ALTER TABLE `product_variants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `room_suitabilities`
--
ALTER TABLE `room_suitabilities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `collection_images`
--
ALTER TABLE `collection_images`
  ADD CONSTRAINT `collection_images_ibfk_1` FOREIGN KEY (`collection_id`) REFERENCES `collections` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_184` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_185` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_186` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_category_id_foreign_idx` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_245` FOREIGN KEY (`collection_id`) REFERENCES `collections` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_246` FOREIGN KEY (`material_id`) REFERENCES `materials` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_247` FOREIGN KEY (`fabric_type_id`) REFERENCES `fabric_types` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_248` FOREIGN KEY (`room_suitability_id`) REFERENCES `room_suitabilities` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `product_requests`
--
ALTER TABLE `product_requests`
  ADD CONSTRAINT `product_requests_ibfk_123` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `product_requests_ibfk_124` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `role_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
