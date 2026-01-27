-- Migration: Create iframes table for tracking generated embed codes
-- Run this in Supabase SQL Editor to track all active embed/VRM iframes

CREATE TABLE IF NOT EXISTS iframes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- NOTE: users.id is bigint in current schema
  user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  url TEXT NOT NULL,
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

-- Backfill: add url column if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'iframes' AND column_name = 'url'
  ) THEN
    ALTER TABLE iframes ADD COLUMN url TEXT;
    UPDATE iframes SET url = 'https://web-production-df12d.up.railway.app/embed.html' WHERE url IS NULL;
    ALTER TABLE iframes ALTER COLUMN url SET NOT NULL;
  END IF;
END $$;

-- Allow users to view their own iframes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'iframes' AND policyname = 'Users can view own iframes'
  ) THEN
    CREATE POLICY "Users can view own iframes" ON iframes
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM users u
          WHERE u.id = user_id
          AND u.email = (SELECT email FROM auth.users WHERE id = (SELECT auth.uid()))
        )
      );
  END IF;
END $$;

-- Allow users to insert their own iframes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'iframes' AND policyname = 'Users can insert own iframes'
  ) THEN
    CREATE POLICY "Users can insert own iframes" ON iframes
      FOR INSERT WITH CHECK (
        user_id IN (
          SELECT u.id FROM users u
          WHERE u.email = (SELECT email FROM auth.users WHERE id = (SELECT auth.uid()))
        )
      );
  END IF;
END $$;

-- Allow users to update their own iframes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'iframes' AND policyname = 'Users can update own iframes'
  ) THEN
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
  END IF;
END $$;

-- Allow admins to view all iframes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'iframes' AND policyname = 'Admins can view all iframes'
  ) THEN
    CREATE POLICY "Admins can view all iframes" ON iframes
      FOR SELECT USING (
        (SELECT email FROM auth.users WHERE id = (SELECT auth.uid())) IN (SELECT email FROM users WHERE role = 'admin')
      );
  END IF;
END $$;

-- Allow admins to update all iframes (lock/unlock)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'iframes' AND policyname = 'Admins can manage iframes'
  ) THEN
    CREATE POLICY "Admins can manage iframes" ON iframes
      FOR UPDATE USING (
        (SELECT email FROM auth.users WHERE id = (SELECT auth.uid())) IN (SELECT email FROM users WHERE role = 'admin')
      )
      WITH CHECK (
        (SELECT email FROM auth.users WHERE id = (SELECT auth.uid())) IN (SELECT email FROM users WHERE role = 'admin')
      );
  END IF;
END $$;

-- Service role can manage iframes (for backend)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'iframes' AND policyname = 'Service role can manage iframes'
  ) THEN
    CREATE POLICY "Service role can manage iframes" ON iframes
      AS PERMISSIVE
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Create indexes for faster queries (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'idx_iframes_status') THEN
    CREATE INDEX idx_iframes_status ON iframes(status);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'idx_iframes_user_id') THEN
    CREATE INDEX idx_iframes_user_id ON iframes(user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'idx_iframes_email') THEN
    CREATE INDEX idx_iframes_email ON iframes(email);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'idx_iframes_type') THEN
    CREATE INDEX idx_iframes_type ON iframes(type);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'idx_iframes_created_at') THEN
    CREATE INDEX idx_iframes_created_at ON iframes(created_at DESC);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'idx_iframes_uses') THEN
    CREATE INDEX idx_iframes_uses ON iframes(uses DESC);
  END IF;
END $$;
