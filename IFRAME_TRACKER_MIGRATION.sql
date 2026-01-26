-- Create iframes tracking table
CREATE TABLE IF NOT EXISTS iframes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  locked BOOLEAN DEFAULT FALSE,
  locked_at TIMESTAMP,
  usage_count INTEGER DEFAULT 0,
  last_used TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_iframes_user_id ON iframes(user_id);
CREATE INDEX idx_iframes_locked ON iframes(locked);
CREATE INDEX idx_iframes_created_at ON iframes(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE iframes ENABLE ROW LEVEL SECURITY;

-- Allow public access to all operations for now (can be restricted later with proper auth)
CREATE POLICY "Public can view iframes" ON iframes
  FOR SELECT USING (true);

CREATE POLICY "Public can insert iframes" ON iframes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can update iframes" ON iframes
  FOR UPDATE USING (true);

CREATE POLICY "Public can delete iframes" ON iframes
  FOR DELETE USING (true);

GRANT SELECT, INSERT, UPDATE, DELETE ON iframes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON iframes TO authenticated;
