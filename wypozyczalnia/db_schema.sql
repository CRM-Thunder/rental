-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: mysql-master:3306
-- Generation Time: Dec 17, 2024 at 01:38 PM
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

CREATE TABLE `Car` (
                       `id` int NOT NULL,
                       `brand` varchar(20) COLLATE utf8mb4_polish_ci NOT NULL,
                       `model` varchar(30) COLLATE utf8mb4_polish_ci NOT NULL,
                       `production_year` year NOT NULL,
                       `color` varchar(30) COLLATE utf8mb4_polish_ci NOT NULL,
                       `car_registration` varchar(8) COLLATE utf8mb4_polish_ci NOT NULL,
                       `price` smallint UNSIGNED NOT NULL,
                       `office_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

--
-- Dumping data for table `Car`
--

INSERT INTO `Car` (`id`, `brand`, `model`, `production_year`, `color`, `car_registration`, `price`, `office_id`) VALUES
                                                                                                                     (1, 'Tesla', 'Sport Carbon', '2024', 'niebieski', 'ZSSIGMA', 800, 1),
                                                                                                                     (2, 'Toyota', 'Corolla', '2020', 'Czerwony', 'WX12345', 120, 1),
                                                                                                                     (3, 'Honda', 'Civic', '2019', 'Niebieski', 'KR56789', 100, 2),
                                                                                                                     (4, 'Ford', 'Focus', '2021', 'Czarny', 'GD54321', 110, 3),
                                                                                                                     (5, 'BMW', '3 Series', '2022', 'Biały', 'PO98765', 150, 4),
                                                                                                                     (6, 'Audi', 'A4', '2020', 'Szary', 'WR45678', 140, 5);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `City`
--

CREATE TABLE `City` (
                        `id` int NOT NULL,
                        `state` varchar(30) COLLATE utf8mb4_polish_ci NOT NULL,
                        `name` varchar(30) COLLATE utf8mb4_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

--
-- Dumping data for table `City`
--

INSERT INTO `City` (`id`, `state`, `name`) VALUES
                                               (1, 'zachodniopomorskie', 'Szczecin'),
                                               (2, 'Mazowieckie', 'Warszawa'),
                                               (3, 'Małopolskie', 'Kraków'),
                                               (4, 'Pomorskie', 'Gdańsk'),
                                               (5, 'Wielkopolskie', 'Poznań'),
                                               (6, 'Dolnośląskie', 'Wrocław');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `Customer`
--

CREATE TABLE `Customer` (
                            `id` int NOT NULL,
                            `name` varchar(20) COLLATE utf8mb4_polish_ci NOT NULL,
                            `surname` varchar(64) COLLATE utf8mb4_polish_ci NOT NULL,
                            `age` tinyint UNSIGNED NOT NULL,
                            `address` varchar(64) COLLATE utf8mb4_polish_ci NOT NULL,
                            `postal_code` varchar(6) COLLATE utf8mb4_polish_ci NOT NULL,
                            `city_id` int NOT NULL,
                            `email` varchar(64) COLLATE utf8mb4_polish_ci NOT NULL,
                            `login` varchar(20) COLLATE utf8mb4_polish_ci NOT NULL,
                            `password_hash` varchar(512) COLLATE utf8mb4_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

--
-- Dumping data for table `Customer`
--

INSERT INTO `Customer` (`id`, `name`, `surname`, `age`, `address`, `postal_code`, `city_id`, `email`, `login`, `password_hash`) VALUES
                                                                                                                                    (1, 'Jan', 'Kowalski', 30, 'ul. Zielona 1', '01-001', 1, 'jan.kowalski@example.com', 'jank', 'hash1'),
                                                                                                                                    (2, 'Anna', 'Nowak', 25, 'ul. Błękitna 5', '30-005', 2, 'anna.nowak@example.com', 'annan', 'hash2'),
                                                                                                                                    (3, 'Piotr', 'Wiśniewski', 35, 'ul. Słoneczna 10', '80-010', 3, 'piotr.wisniewski@example.com', 'piotrw', 'hash3'),
                                                                                                                                    (4, 'Maria', 'Zielińska', 28, 'ul. Wiosenna 15', '60-015', 4, 'maria.zielinska@example.com', 'mariaz', 'hash4'),
                                                                                                                                    (5, 'Tomasz', 'Lewandowski', 40, 'ul. Jesienna 20', '50-020', 5, 'tomasz.lewandowski@example.com', 'tomaszl', 'hash5');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `Employee`
--

CREATE TABLE `Employee` (
                            `id` int NOT NULL,
                            `name` varchar(20) COLLATE utf8mb4_polish_ci NOT NULL,
                            `surname` varchar(30) COLLATE utf8mb4_polish_ci NOT NULL,
                            `password_hash` varchar(512) COLLATE utf8mb4_polish_ci NOT NULL,
                            `login` varchar(20) COLLATE utf8mb4_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `Office`
--

CREATE TABLE `Office` (
                          `id` int NOT NULL,
                          `address` varchar(64) COLLATE utf8mb4_polish_ci NOT NULL,
                          `postal_code` varchar(6) COLLATE utf8mb4_polish_ci NOT NULL,
                          `city_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

--
-- Dumping data for table `Office`
--

INSERT INTO `Office` (`id`, `address`, `postal_code`, `city_id`) VALUES
                                                                     (1, 'Zawadzkiego 80', '70-321', 1),
                                                                     (2, 'ul. Marszałkowska 1', '00-001', 1),
                                                                     (3, 'ul. Rynek Główny 10', '30-001', 2),
                                                                     (4, 'ul. Długa 15', '80-001', 3),
                                                                     (5, 'ul. Św. Marcina 3', '60-001', 4),
                                                                     (6, 'ul. Piłsudskiego 5', '50-001', 5);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `Rental`
--

CREATE TABLE `Rental` (
                          `id` int NOT NULL,
                          `car_id` int NOT NULL,
                          `customer_id` int NOT NULL,
                          `start_date` datetime NOT NULL,
                          `end_date` datetime NOT NULL,
                          `is_verified` tinyint(1) NOT NULL,
                          `sum_price` mediumint UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

--
-- Dumping data for table `Rental`
--

INSERT INTO `Rental` (`id`, `car_id`, `customer_id`, `start_date`, `end_date`, `is_verified`, `sum_price`) VALUES
                                                                                                               (1, 1, 1, '2024-12-01 10:00:00', '2024-12-10 10:00:00', 1, 1200),
                                                                                                               (2, 2, 2, '2024-11-15 09:00:00', '2024-11-20 09:00:00', 1, 500),
                                                                                                               (3, 3, 3, '2024-12-05 14:00:00', '2024-12-15 14:00:00', 1, 1100),
                                                                                                               (6, 4, 4, '2024-12-01 12:00:00', '2024-12-07 12:00:00', 0, 900),
                                                                                                               (7, 5, 5, '2024-12-10 08:00:00', '2024-12-20 08:00:00', 1, 1400),
                                                                                                               (8, 1, 3, '2024-12-20 08:00:00', '2024-12-20 10:00:00', 0, 1600);

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `Car`
--
ALTER TABLE `Car`
    ADD PRIMARY KEY (`id`),
  ADD KEY `office_id_in_car_fk` (`office_id`);

--
-- Indeksy dla tabeli `City`
--
ALTER TABLE `City`
    ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `Customer`
--
ALTER TABLE `Customer`
    ADD PRIMARY KEY (`id`),
  ADD KEY `city_id_in_customer_fk` (`city_id`);

--
-- Indeksy dla tabeli `Employee`
--
ALTER TABLE `Employee`
    ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `Office`
--
ALTER TABLE `Office`
    ADD PRIMARY KEY (`id`),
  ADD KEY `city_id_in_office_FK` (`city_id`);

--
-- Indeksy dla tabeli `Rental`
--
ALTER TABLE `Rental`
    ADD PRIMARY KEY (`id`),
  ADD KEY `customer_id_in_rental_fk` (`customer_id`),
  ADD KEY `car_id_in_rental_fk` (`car_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Car`
--
ALTER TABLE `Car`
    MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `City`
--
ALTER TABLE `City`
    MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `Customer`
--
ALTER TABLE `Customer`
    MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `Employee`
--
ALTER TABLE `Employee`
    MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Office`
--
ALTER TABLE `Office`
    MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `Rental`
--
ALTER TABLE `Rental`
    MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

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
