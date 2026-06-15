-- ============================================================
-- URL Shortener with Analytics - Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- USERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT        NOT NULL,
  email         TEXT        UNIQUE NOT NULL,
  password_hash TEXT        NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- URLS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS urls (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  original_url TEXT         NOT NULL,
  short_code   VARCHAR(50)  UNIQUE NOT NULL,
  custom_alias VARCHAR(50)  UNIQUE,
  expires_at   TIMESTAMPTZ,
  created_at   TIMESTAMPTZ  DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_urls_user_id   ON urls(user_id);
CREATE INDEX IF NOT EXISTS idx_urls_short_code ON urls(short_code);

-- ============================================================
-- VISITS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS visits (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  url_id      UUID        NOT NULL REFERENCES urls(id) ON DELETE CASCADE,
  visited_at  TIMESTAMPTZ DEFAULT NOW(),
  ip_address  TEXT,
  browser     TEXT,
  device      TEXT,
  os          TEXT
);

CREATE INDEX IF NOT EXISTS idx_visits_url_id    ON visits(url_id);
CREATE INDEX IF NOT EXISTS idx_visits_visited_at ON visits(visited_at);
