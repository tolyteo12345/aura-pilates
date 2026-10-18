-- phpunit.xml points tests at DB_DATABASE=testing.
-- Runs only when the MySQL data dir (storage/mysql) is first initialised.
CREATE DATABASE IF NOT EXISTS `testing`;
