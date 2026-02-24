-- ══════════════════════════════════════════════════════
--  Portfolio Database Setup
--  Run this once in MySQL before starting the backend
-- ══════════════════════════════════════════════════════

CREATE DATABASE IF NOT EXISTS portfolio_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE portfolio_db;

-- Spring Boot (JPA with ddl-auto=update) will auto-create
-- the contact_messages table on first run.
-- This file just ensures the database exists.

-- Optional: view submitted messages
-- SELECT * FROM contact_messages ORDER BY sent_at DESC;
