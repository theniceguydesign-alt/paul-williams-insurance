-- Paul Williams Insurance Agency
-- Run this in your Supabase SQL Editor after creating the project

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users (admin access)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'viewer',
  created_at timestamptz DEFAULT now()
);

-- Leads (quote form submissions)
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text,
  phone text,
  message text,
  coverage_type text,
  status text DEFAULT 'new',
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Intake form submissions
CREATE TABLE IF NOT EXISTS intake_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  data jsonb NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- General messages
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text,
  phone text,
  subject text,
  body text,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE intake_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Anon can INSERT (submit forms) but not read
CREATE POLICY "anon_insert_leads" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "anon_insert_intake" ON intake_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "anon_insert_messages" ON messages FOR INSERT WITH CHECK (true);

-- Authenticated users can read/update/delete all
CREATE POLICY "auth_all_leads" ON leads FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_all_intake" ON intake_submissions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_all_messages" ON messages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_all_users" ON users FOR ALL USING (auth.role() = 'authenticated');

-- Seed Matthew as admin (run after first magic link login)
-- INSERT INTO users (email, role) VALUES ('theniceguy.design@gmail.com', 'admin');
-- INSERT INTO users (email, role) VALUES ('paul@paulwilliamsinsurance.com', 'admin');

