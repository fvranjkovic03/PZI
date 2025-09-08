-- MySQL dump 10.13  Distrib 8.3.0, for macos14.2 (arm64)
--
-- Host: localhost    Database: chatgpt_app
-- ------------------------------------------------------
-- Server version	8.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `contact_messages`
--

DROP TABLE IF EXISTS `contact_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_messages`
--

LOCK TABLES `contact_messages` WRITE;
/*!40000 ALTER TABLE `contact_messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `contact_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plan_items`
--

DROP TABLE IF EXISTS `plan_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plan_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `plan_id` int NOT NULL,
  `day_index` int NOT NULL,
  `time_hint` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `details` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `fk_items_plan` (`plan_id`),
  CONSTRAINT `fk_items_plan` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=205 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plan_items`
--

LOCK TABLES `plan_items` WRITE;
/*!40000 ALTER TABLE `plan_items` DISABLE KEYS */;
INSERT INTO `plan_items` VALUES (105,3,1,'09:00','testt1123213','Jutarnja šetnja i kava (Hrana)'),(107,3,1,'17:00','Muzej / znamenitosti','Muzej / znamenitosti'),(108,3,1,'20:00','Večera i šetnja centrom','Večera i šetnja centrom'),(109,3,2,'09:00','Jutarnja šetnja i kava (Hrana)','Jutarnja šetnja i kava (Hrana)'),(110,3,2,'13:00','Ručak u lokalnom bistrou','Ručak u lokalnom bistrou'),(111,3,2,'17:00','Muzej / znamenitosti','Muzej / znamenitosti'),(112,3,2,'20:00','Večera i šetnja centrom','Večera i šetnja centrom'),(113,3,3,'09:00','Jutarnja šetnja i kava (Hrana)','Jutarnja šetnja i kava (Hrana)'),(114,3,3,'13:00','Ručak u lokalnom bistrou','Ručak u lokalnom bistrou'),(115,3,3,'17:00','Muzej / znamenitosti','Muzej / znamenitosti'),(116,3,3,'20:00','Večera i šetnja centrom','Večera i šetnja centrom'),(137,5,1,'09:00','Jutarnja šetnja i kava (Test)','Jutarnja šetnja i kava (Test)'),(138,5,1,'13:00','Ručak u lokalnom bistrou','Ručak u lokalnom bistrou'),(139,5,1,'17:00','Muzej / znamenitosti','Muzej / znamenitosti'),(140,5,1,'20:00','Večera i šetnja centrom','Večera i šetnja centrom'),(141,5,2,'09:00','Jutarnja šetnja i kava (Test)','Jutarnja šetnja i kava (Test)'),(142,5,2,'13:00','Ručak u lokalnom bistrou','Ručak u lokalnom bistrou'),(143,5,2,'17:00','Muzej / znamenitosti','Muzej / znamenitosti'),(144,5,2,'20:00','Večera i šetnja centrom','Večera i šetnja centrom'),(145,5,3,'09:00','Jutarnja šetnja i kava (Test)','Jutarnja šetnja i kava (Test)'),(146,5,3,'13:00','Ručak u lokalnom bistrou','Ručak u lokalnom bistrou'),(147,5,3,'17:00','Muzej / znamenitosti','Muzej / znamenitosti'),(148,5,3,'20:00','Večera i šetnja centrom','Večera i šetnja centrom'),(149,6,1,'09:00','Jutarnja šetnja i kava (Hranaaaaa','Jutarnja šetnja i kava (Hrana)'),(151,6,1,'17:00','Muzej / znamenitosti','Muzej / znamenitosti'),(152,6,1,'20:00','Večera i šetnja centrom','Večera i šetnja centrom'),(153,6,2,'09:00','Jutarnja šetnja i kava (Hrana)','Jutarnja šetnja i kava (Hrana)'),(154,6,2,'13:00','Ručak u lokalnom bistrou','Ručak u lokalnom bistrou'),(155,6,2,'17:00','Muzej / znamenitosti','Muzej / znamenitosti'),(156,6,2,'20:00','Večera i šetnja centrom','Večera i šetnja centrom'),(173,9,1,'09:00','Test','Jutarnja šetnja i kava (Muzeji)'),(174,9,1,'13:00','Ručak u lokalnom bistrou','Ručak u lokalnom bistrou'),(175,9,1,'17:00','Muzej / znamenitosti','Muzej / znamenitosti'),(176,9,1,'20:00','Večera i šetnja centrom','Večera i šetnja centrom'),(177,9,2,'09:00','Jutarnja šetnja i kava (Muzeji)','Jutarnja šetnja i kava (Muzeji)'),(178,9,2,'13:00','Ručak u lokalnom bistrou','Ručak u lokalnom bistrou'),(179,9,2,'17:00','Muzej / znamenitosti','Muzej / znamenitosti'),(180,9,2,'20:00','Večera i šetnja centrom','Večera i šetnja centrom'),(181,9,3,'09:00','Jutarnja šetnja i kava (Muzeji)','Jutarnja šetnja i kava (Muzeji)'),(182,9,3,'13:00','Ručak u lokalnom bistrou','Ručak u lokalnom bistrou'),(183,9,3,'17:00','Muzej / znamenitosti','Muzej / znamenitosti'),(184,9,3,'20:00','Večera i šetnja centrom','Večera i šetnja centrom'),(185,10,1,'09:00','Jutarnja šetnja centrom (Priroda)','Jutarnja šetnja centrom (Priroda)'),(186,10,1,'13:00','Ručak u restoranu s tradicionalnom kuhinjom','Ručak u restoranu s tradicionalnom kuhinjom'),(187,10,1,'17:00','Šetnja uz rijeku ili more','Šetnja uz rijeku ili more'),(188,10,1,'20:00','Noćni pogled s vidikovca','Noćni pogled s vidikovca'),(189,10,2,'09:00','Jutarnja vožnja biciklom po okolici (Priroda)','Jutarnja vožnja biciklom po okolici (Priroda)'),(190,10,2,'13:00','Ručak u restoranu s tradicionalnom kuhinjom','Ručak u restoranu s tradicionalnom kuhinjom'),(191,10,2,'17:00','Razgledavanje znamenitosti','Razgledavanje znamenitosti'),(192,10,2,'20:00','Odlazak u lokalni bar s glazbom','Odlazak u lokalni bar s glazbom'),(193,10,3,'09:00','Rani odlazak do muzeja (Priroda)','Rani odlazak do muzeja (Priroda)'),(194,10,3,'13:00','Street food degustacija','Street food degustacija'),(195,10,3,'17:00','Vođeni obilazak autobusom ili brodom','Vođeni obilazak autobusom ili brodom'),(196,10,3,'20:00','Kultura: kazalište ili koncert','Kultura: kazalište ili koncert'),(197,10,4,'09:00','Jutarnja vožnja biciklom po okolici (Priroda)','Jutarnja vožnja biciklom po okolici (Priroda)'),(198,10,4,'13:00','Picknick u parku','Picknick u parku'),(199,10,4,'17:00','Obilazak stare gradske jezgre','Obilazak stare gradske jezgre'),(200,10,4,'20:00','Večera i šetnja centrom','Večera i šetnja centrom'),(201,10,5,'09:00','Jutarnja vožnja biciklom po okolici (Priroda)','Jutarnja vožnja biciklom po okolici (Priroda)'),(202,10,5,'13:00','Ručak u restoranu s tradicionalnom kuhinjom','Ručak u restoranu s tradicionalnom kuhinjom'),(203,10,5,'17:00','Shopping u centru','Shopping u centru'),(204,10,5,'20:00','Kultura: kazalište ili koncert','Kultura: kazalište ili koncert');
/*!40000 ALTER TABLE `plan_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plans`
--

DROP TABLE IF EXISTS `plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plans` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `destination` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `summary` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_plans_user` (`user_id`),
  CONSTRAINT `fk_plans_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plans`
--

LOCK TABLES `plans` WRITE;
/*!40000 ALTER TABLE `plans` DISABLE KEYS */;
INSERT INTO `plans` VALUES (3,1,'Madrid','2025-08-27','2025-08-29','Plan putovanja za Madrid od 2025-08-27 do 2025-08-29. Fokus: Hrana.','2025-08-25 20:03:49'),(5,1,'Test','2025-08-26','2025-08-28','Plan putovanja za Test od 2025-08-26 do 2025-08-28. Fokus: Test.','2025-08-26 19:46:25'),(6,1,'Sarajevo','2025-08-26','2025-08-27','Plan putovanja za Sarajevo od 2025-08-26 do 2025-08-27. Fokus: Hrana.','2025-08-26 19:55:17'),(9,2,'Rim','2025-08-31','2025-09-02','Plan putovanja za Rim od 2025-08-31 do 2025-09-02. Fokus: Muzeji.','2025-08-30 13:53:46'),(10,2,'Rim','2025-08-30','2025-09-03','Plan putovanja za Rim od 2025-08-30 do 2025-09-03. Fokus: Priroda.','2025-08-30 16:38:47');
/*!40000 ALTER TABLE `plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isAdmin` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'test@mail.com','$2a$10$ue6RHEh1Sl3vDJuuncAf4eHtdKbB2SW9lOQJ/YS8bIoz8iceAB6xy',1,'2025-08-16 18:57:57'),(2,'testniuser123@gmail.com','$2a$10$7HtmIGkzCiIJc9d99ezOsOYeymO5kR2u/hj15JQ6Ed60JP119dTPu',0,'2025-08-26 20:13:40');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-30 20:20:24
