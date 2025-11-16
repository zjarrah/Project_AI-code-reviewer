-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: Nov 16, 2025 at 01:46 PM
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
-- Database: `ai_code_review_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `input` text NOT NULL,
  `human_review` text NOT NULL,
  `ai_review` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `input`, `human_review`, `ai_review`) VALUES
(6, '{\"file\":\"testing.py\",\"code\":\"def summation(a,b):\\r\\n\\treturn a+b\"}', 'Some human review', '[{\"severity\":\"low\",\"file\":\"testing.py\",\"issue\":\"Lack of type hints\",\"suggestion\":\"Add type hints for parameters and return value\",\"line\":\"1\",\"rule_id\":\"2\",\"category\":\"Code Quality\"}]'),
(7, '{\"file\":\"testing.py\",\"code\":\"def summation(a,b):\\r\\n\\treturn a+b\"}', 'testinggggg', '[{\"severity\":\"low\",\"file\":\"testing.py\",\"issue\":\"No type hints\",\"suggestion\":\"Add type hints for function parameters and return type\",\"line\":\"1\",\"rule_id\":\"101\",\"category\":\"Typing\"},{\"severity\":\"medium\",\"file\":\"testing.py\",\"issue\":\"Function could be more descriptive\",\"suggestion\":\"Consider renaming the function to something more descriptive like \'add_numbers\'\",\"line\":\"1\",\"rule_id\":\"102\",\"category\":\"Clarity\"}]'),
(8, '{\"file\":\"testing.py\",\"code\":\"def summation(a,b):\\r\\n\\treturn a+b\"}', 'Another testtttttttttttt', '[{\"severity\":\"low\",\"file\":\"testing.py\",\"issue\":\"Lack of type hints\",\"suggestion\":\"Add type hints for function parameters and return type\",\"line\":\"1\",\"rule_id\":\"2\",\"category\":\"Coding Standards\"},{\"severity\":\"low\",\"file\":\"testing.py\",\"issue\":\"No docstring for function\",\"suggestion\":\"Add a docstring to describe the function\'s purpose and usage\",\"line\":\"1\",\"rule_id\":\"3\",\"category\":\"Documentation\"}]'),
(9, '{\"file\":\"testing.py\",\"code\":\"def summation(a,b):\\r\\n\\treturn a+b\"}', 'tryyyyyyyy', '[{\"severity\":\"low\",\"file\":\"testing.py\",\"issue\":\"Lack of type hints\",\"suggestion\":\"Add type hints for parameters and return type\",\"line\":\"1\",\"rule_id\":\"1\",\"category\":\"Code Quality\"},{\"severity\":\"medium\",\"file\":\"testing.py\",\"issue\":\"Function name is not descriptive enough\",\"suggestion\":\"Rename function to `add_numbers` for clarity\",\"line\":\"1\",\"rule_id\":\"2\",\"category\":\"Readability\"}]'),
(10, '{\"file\":\"testing.py\",\"code\":\"def summation(a,b):\\r\\n\\treturn a+b\"}', 'Another reviewwwwwwww', '[{\"severity\":\"low\",\"file\":\"testing.py\",\"issue\":\"Missing type hints\",\"suggestion\":\"Add type hints for function parameters and return type\",\"line\":\"1\",\"rule_id\":\"2\",\"category\":\"Code Quality\"}]'),
(11, '{\"file\":\"testing.py\",\"code\":\"def create_user(data):\\r\\n\\tsave_to_db(data)\"}', 'Some human review', '[{\"severity\":\"high\",\"file\":\"testing.py\",\"issue\":\"No input validation\",\"suggestion\":\"Validate payload before saving\",\"line\":\"1\",\"rule_id\":\"1\",\"category\":\"Validation\"}]'),
(12, '{\"file\":\"testing.py\",\"code\":\"def create_user(data):\\r\\n\\tsave_to_db(data)\"}', 'Human review test', '[{\"severity\":\"high\",\"file\":\"testing.py\",\"issue\":\"No input validation\",\"suggestion\":\"Validate payload before saving to the database\",\"line\":\"2\",\"rule_id\":\"1\",\"category\":\"Validation\"},{\"severity\":\"medium\",\"file\":\"testing.py\",\"issue\":\"Lack of error handling\",\"suggestion\":\"Implement try-except block around database operations\",\"line\":\"2\",\"rule_id\":\"2\",\"category\":\"Error Handling\"}]'),
(13, '{\"file\":\"testing.py\",\"code\":\"def create_user(data):\\r\\n\\tsave_to_db(data)\"}', 'Human review testt', '[{\"severity\":\"high\",\"file\":\"testing.py\",\"issue\":\"No input validation\",\"suggestion\":\"Validate payload before saving\",\"line\":\"1\",\"rule_id\":\"1\",\"category\":\"Validation\"}]');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
