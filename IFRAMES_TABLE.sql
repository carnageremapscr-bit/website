-- Migration: Create iframes table for tracking generated embed codes
-- Run this in Supabase SQL Editor to track all active embed/VRM iframes

CREATE TABLE IF NOT EXISTS iframes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- NOTE: users.id is bigint in current schema
  user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'embed' CHECK (type IN ('embed', 'vrm', 'embed-widget', 'vrm-lookup')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'locked', 'deleted')),
  title TEXT,
  description TEXT,
  color_accent TEXT,
  color_bg TEXT,
  logo_url TEXT,
  whatsapp TEXT,
  contact_email TEXT,
  uses INTEGER DEFAULT 0,
  last_used TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE iframes ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own iframes
CREATE POLICY "Users can view own iframes" ON iframes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = user_id
      AND u.email = (SELECT email FROM auth.users WHERE id = (SELECT auth.uid()))
    )
  );

-- Allow users to insert their own iframes
CREATE POLICY "Users can insert own iframes" ON iframes
  FOR INSERT WITH CHECK (
    user_id IN (
      SELECT u.id FROM users u
      WHERE u.email = (SELECT email FROM auth.users WHERE id = (SELECT auth.uid()))
    )
  );

-- Allow users to update their own iframes
CREATE POLICY "Users can update own iframes" ON iframes
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = user_id
      AND u.email = (SELECT email FROM auth.users WHERE id = (SELECT auth.uid()))
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = user_id
      AND u.email = (SELECT email FROM auth.users WHERE id = (SELECT auth.uid()))
    )
  );

-- Allow admins to view all iframes
CREATE POLICY "Admins can view all iframes" ON iframes
  FOR SELECT USING (
    (SELECT email FROM auth.users WHERE id = (SELECT auth.uid())) IN (SELECT email FROM users WHERE role = 'admin')
  );

-- Allow admins to update all iframes (lock/unlock)
CREATE POLICY "Admins can manage iframes" ON iframes
  FOR UPDATE USING (
    (SELECT email FROM auth.users WHERE id = (SELECT auth.uid())) IN (SELECT email FROM users WHERE role = 'admin')
  )
  WITH CHECK (
    (SELECT email FROM auth.users WHERE id = (SELECT auth.uid())) IN (SELECT email FROM users WHERE role = 'admin')
  );

-- Service role can manage iframes (for backend)
CREATE POLICY "Service role can manage iframes" ON iframes
  AS PERMISSIVE
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create indexes for faster queries
CREATE INDEX idx_iframes_status ON iframes(status);
CREATE INDEX idx_iframes_user_id ON iframes(user_id);
CREATE INDEX idx_iframes_email ON iframes(email);
CREATE INDEX idx_iframes_type ON iframes(type);
CREATE INDEX idx_iframes_created_at ON iframes(created_at DESC);
CREATE INDEX idx_iframes_uses ON iframes(uses DESC);
