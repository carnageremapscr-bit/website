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

-- Allow users to view their own requests (optimized with SELECT wrapper)
CREATE POLICY "Users can view own top-up requests" ON top_up_requests
  FOR SELECT USING (
    (SELECT auth.uid()) = user_id 
    OR (SELECT email FROM auth.users WHERE id = (SELECT auth.uid())) IN (SELECT email FROM users WHERE role = 'admin')
  );

-- Allow admins to view all requests (optimized with SELECT wrapper)
CREATE POLICY "Admins can manage top-up requests" ON top_up_requests
  FOR ALL USING (
    (SELECT email FROM auth.users WHERE id = (SELECT auth.uid())) IN (SELECT email FROM users WHERE role = 'admin')
  );

-- Allow users to insert their own requests (optimized with SELECT wrapper)
CREATE POLICY "Users can request top-ups" ON top_up_requests
  FOR INSERT WITH CHECK (
    (SELECT auth.uid()) = user_id
  );

-- Create index for faster queries
CREATE INDEX idx_top_up_requests_status ON top_up_requests(status);
CREATE INDEX idx_top_up_requests_user_id ON top_up_requests(user_id);
CREATE INDEX idx_top_up_requests_requested_at ON top_up_requests(requested_at DESC);

-- ============================================
-- Migration: Subscriptions table for Stripe subscriptions
-- Run this in Supabase SQL Editor
-- ============================================

CREATE TABLE IF NOT EXISTS subscriptions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT UNIQUE,
  type TEXT NOT NULL DEFAULT 'embed',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'cancelled', 'inactive')),
  price_amount INTEGER DEFAULT 999,
  currency TEXT DEFAULT 'gbp',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own subscriptions (optimized with SELECT wrapper)
CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (
    (SELECT auth.uid()) = user_id 
    OR email = (SELECT email FROM auth.users WHERE id = (SELECT auth.uid()))
    OR email IN (SELECT email FROM users WHERE role = 'admin')
  );

-- Allow admins to insert subscriptions (optimized with SELECT wrapper)
CREATE POLICY "Admins can insert subscriptions" ON subscriptions
  FOR INSERT WITH CHECK (
    email IN (SELECT email FROM users WHERE role = 'admin')
  );

-- Allow admins to update subscriptions (optimized with SELECT wrapper)
CREATE POLICY "Admins can update subscriptions" ON subscriptions
  FOR UPDATE USING (
    email IN (SELECT email FROM users WHERE role = 'admin')
  )
  WITH CHECK (
    email IN (SELECT email FROM users WHERE role = 'admin')
  );

-- Allow admins to delete subscriptions (optimized with SELECT wrapper)
CREATE POLICY "Admins can delete subscriptions" ON subscriptions
  FOR DELETE USING (
    email IN (SELECT email FROM users WHERE role = 'admin')
  );

-- Service role can manage subscriptions (for webhooks - restrictive to service_role only)
CREATE POLICY "Service role can manage subscriptions" ON subscriptions
  AS PERMISSIVE
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create indexes for faster queries
CREATE INDEX idx_subscriptions_email ON subscriptions(email);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_stripe_sub_id ON subscriptions(stripe_subscription_id);

-- ============================================
-- Migration: Transactions table for payment history
-- ============================================

CREATE TABLE IF NOT EXISTS transactions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  email TEXT,
  type TEXT NOT NULL CHECK (type IN ('topup', 'subscription', 'file_service', 'refund')),
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own transactions (optimized with SELECT wrapper)
CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (
    (SELECT auth.uid()) = user_id 
    OR email IN (SELECT email FROM users WHERE role = 'admin')
  );

-- Service role can manage transactions (for payment processing - restrictive to service_role only)
CREATE POLICY "Service role can manage transactions" ON transactions
  AS PERMISSIVE
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_email ON transactions(email);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);

-- ============================================
-- Migration: Admin Notifications table
-- Stores all admin activity notifications
-- ============================================

CREATE TABLE IF NOT EXISTS admin_notifications (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  type TEXT NOT NULL CHECK (type IN ('subscription', 'payment', 'upload', 'topup', 'user', 'support')),
  icon TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  user_email TEXT,
  badge TEXT CHECK (badge IN ('active', 'pending', 'completed', 'cancelled', 'new')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;

-- Admins can view notifications (optimized with SELECT wrapper)
CREATE POLICY "Admins can view notifications" ON admin_notifications
  FOR SELECT USING (
    (SELECT email FROM auth.users WHERE id = (SELECT auth.uid())) IN (SELECT email FROM users WHERE role = 'admin')
  );

-- Admins can insert notifications (optimized with SELECT wrapper)
CREATE POLICY "Admins can insert notifications" ON admin_notifications
  FOR INSERT WITH CHECK (
    (SELECT email FROM auth.users WHERE id = (SELECT auth.uid())) IN (SELECT email FROM users WHERE role = 'admin')
  );

-- Admins can update notifications (optimized with SELECT wrapper)
CREATE POLICY "Admins can update notifications" ON admin_notifications
  FOR UPDATE USING (
    (SELECT email FROM auth.users WHERE id = (SELECT auth.uid())) IN (SELECT email FROM users WHERE role = 'admin')
  )
  WITH CHECK (
    (SELECT email FROM auth.users WHERE id = (SELECT auth.uid())) IN (SELECT email FROM users WHERE role = 'admin')
  );

-- Admins can delete notifications (optimized with SELECT wrapper)
CREATE POLICY "Admins can delete notifications" ON admin_notifications
  FOR DELETE USING (
    (SELECT email FROM auth.users WHERE id = (SELECT auth.uid())) IN (SELECT email FROM users WHERE role = 'admin')
  );

-- Service role can manage notifications (restricted to service_role only)
CREATE POLICY "Service role can manage notifications" ON admin_notifications
  AS PERMISSIVE
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create indexes for faster queries
CREATE INDEX idx_admin_notifications_type ON admin_notifications(type);
CREATE INDEX idx_admin_notifications_created_at ON admin_notifications(created_at DESC);
CREATE INDEX idx_admin_notifications_user_email ON admin_notifications(user_email);

-- ============================================
-- Migration: Service Status table for feature flags
-- Allows admins to enable/disable services
-- ============================================

CREATE TABLE IF NOT EXISTS service_status (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  service_name TEXT NOT NULL UNIQUE,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  disabled_reason TEXT,
  disabled_by TEXT,
  disabled_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE service_status ENABLE ROW LEVEL SECURITY;

-- Anyone can view service status (public read)
CREATE POLICY "Anyone can view service status" ON service_status
  FOR SELECT USING (true);

-- Admins only can update service status (optimized with SELECT wrapper)
CREATE POLICY "Admins can update service status" ON service_status
  FOR UPDATE USING (
    (SELECT email FROM auth.users WHERE id = (SELECT auth.uid())) IN (SELECT email FROM users WHERE role = 'admin')
  )
  WITH CHECK (
    (SELECT email FROM auth.users WHERE id = (SELECT auth.uid())) IN (SELECT email FROM users WHERE role = 'admin')
  );

-- Service role can manage service status (for automated updates)
CREATE POLICY "Service role can manage service status" ON service_status
  AS PERMISSIVE
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX idx_service_status_name ON service_status(service_name);

-- Insert default services
INSERT INTO service_status (service_name, is_enabled) VALUES
  ('vrm_lookup', true),
  ('vehicle_search', true),
  ('file_upload', true),
  ('stripe_checkout', true),
  ('email_notifications', true)
ON CONFLICT (service_name) DO NOTHING;
