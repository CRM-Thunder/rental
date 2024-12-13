-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: mysql-master:3306
-- Generation Time: Dec 13, 2024 at 01:55 PM
-- Wersja serwera: 8.0.40
-- Wersja PHP: 8.2.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `wypozyczalnia`
--
CREATE DATABASE IF NOT EXISTS `wypozyczalnia` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_polish_ci;
USE `wypozyczalnia`;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `Car`
--

CREATE TABLE IF NOT EXISTS `Car` (
                                     `id` int NOT NULL AUTO_INCREMENT,
                                     `brand` varchar(20) COLLATE utf8mb4_polish_ci NOT NULL,
    `model` varchar(30) COLLATE utf8mb4_polish_ci NOT NULL,
    `production_year` year NOT NULL,
    `color` varchar(30) COLLATE utf8mb4_polish_ci NOT NULL,
    `car_registration` varchar(8) COLLATE utf8mb4_polish_ci NOT NULL,
    `price` smallint UNSIGNED NOT NULL,
    `office_id` int NOT NULL,
    PRIMARY KEY (`id`),
    KEY `office_id_in_car_fk` (`office_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `City`
--

CREATE TABLE IF NOT EXISTS `City` (
                                      `id` int NOT NULL AUTO_INCREMENT,
                                      `state` varchar(30) COLLATE utf8mb4_polish_ci NOT NULL,
    `name` varchar(30) COLLATE utf8mb4_polish_ci NOT NULL,
    PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `Customer`
--

CREATE TABLE IF NOT EXISTS `Customer` (
                                          `id` int NOT NULL AUTO_INCREMENT,
                                          `name` varchar(20) COLLATE utf8mb4_polish_ci NOT NULL,
    `surname` varchar(64) COLLATE utf8mb4_polish_ci NOT NULL,
    `age` tinyint UNSIGNED NOT NULL,
    `address` varchar(64) COLLATE utf8mb4_polish_ci NOT NULL,
    `postal_code` varchar(6) COLLATE utf8mb4_polish_ci NOT NULL,
    `city_id` int NOT NULL,
    `email` varchar(64) COLLATE utf8mb4_polish_ci NOT NULL,
    `login` varchar(20) COLLATE utf8mb4_polish_ci NOT NULL,
    `password_hash` varchar(512) COLLATE utf8mb4_polish_ci NOT NULL,
    PRIMARY KEY (`id`),
    KEY `city_id_in_customer_fk` (`city_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `Employee`
--

CREATE TABLE IF NOT EXISTS `Employee` (
                                          `id` int NOT NULL AUTO_INCREMENT,
                                          `name` varchar(20) COLLATE utf8mb4_polish_ci NOT NULL,
    `surname` varchar(30) COLLATE utf8mb4_polish_ci NOT NULL,
    `password_hash` varchar(512) COLLATE utf8mb4_polish_ci NOT NULL,
    `login` varchar(20) COLLATE utf8mb4_polish_ci NOT NULL,
    PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `Office`
--

CREATE TABLE IF NOT EXISTS `Office` (
                                        `id` int NOT NULL AUTO_INCREMENT,
                                        `address` varchar(64) COLLATE utf8mb4_polish_ci NOT NULL,
    `postal_code` varchar(6) COLLATE utf8mb4_polish_ci NOT NULL,
    `city_id` int NOT NULL,
    PRIMARY KEY (`id`),
    KEY `city_id_in_office_FK` (`city_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `Rental`
--

CREATE TABLE IF NOT EXISTS `Rental` (
                                        `id` int NOT NULL AUTO_INCREMENT,
                                        `car_id` int NOT NULL,
                                        `customer_id` int NOT NULL,
                                        `start_date` datetime NOT NULL,
                                        `end_date` datetime NOT NULL,
                                        `is_reservation_active` tinyint(1) NOT NULL,
    `sum_price` mediumint UNSIGNED NOT NULL,
    PRIMARY KEY (`id`),
    KEY `customer_id_in_rental_fk` (`customer_id`),
    KEY `car_id_in_rental_fk` (`car_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Car`
--
ALTER TABLE `Car`
    ADD CONSTRAINT `office_id_in_car_fk` FOREIGN KEY (`office_id`) REFERENCES `Office` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Customer`
--
ALTER TABLE `Customer`
    ADD CONSTRAINT `city_id_in_customer_fk` FOREIGN KEY (`city_id`) REFERENCES `City` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Office`
--
ALTER TABLE `Office`
    ADD CONSTRAINT `city_id_in_office_FK` FOREIGN KEY (`city_id`) REFERENCES `City` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Rental`
--
ALTER TABLE `Rental`
    ADD CONSTRAINT `car_id_in_rental_fk` FOREIGN KEY (`car_id`) REFERENCES `Car` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `customer_id_in_rental_fk` FOREIGN KEY (`customer_id`) REFERENCES `Customer` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
