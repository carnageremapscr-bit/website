-- Create iframes tracking table
CREATE TABLE IF NOT EXISTS iframes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- Create policies for admin access
CREATE POLICY "Admins can view all iframes" ON iframes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admins can update iframes" ON iframes
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admins can delete iframes" ON iframes
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admins can insert iframes" ON iframes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Allow public access to increment usage (for tracking embeds)
CREATE POLICY "Anyone can use iframes (increment usage)" ON iframes
  FOR UPDATE USING (true) WITH CHECK (true);

GRANT SELECT, UPDATE, DELETE ON iframes TO authenticated;
GRANT SELECT ON iframes TO anon;
