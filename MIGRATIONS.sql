-- Migration: Add top_up_requests table for persistent manual approval workflow
-- This replaces IndexedDB storage with Supabase for cross-device persistence

CREATE TABLE IF NOT EXISTS top_up_requests (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  user_name TEXT,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  requested_at TIMESTAMPTZ DEFAULT now(),
  approved_at TIMESTAMPTZ,
  approved_by TEXT,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE top_up_requests ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own requests
CREATE POLICY "Users can view own top-up requests" ON top_up_requests
  FOR SELECT USING (auth.uid() = user_id OR (auth.uid() IN (SELECT id FROM users WHERE role = 'admin')));

-- Allow admins to view all requests
CREATE POLICY "Admins can manage top-up requests" ON top_up_requests
  FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Allow users to insert their own requests
CREATE POLICY "Users can request top-ups" ON top_up_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_top_up_requests_status ON top_up_requests(status);
CREATE INDEX idx_top_up_requests_user_id ON top_up_requests(user_id);
CREATE INDEX idx_top_up_requests_requested_at ON top_up_requests(requested_at DESC);
