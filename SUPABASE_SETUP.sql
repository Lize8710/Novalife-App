-- Create characters table
CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  birth_date DATE,
  nationality TEXT,
  phone TEXT,
  social_score TEXT,
  profession TEXT,
  address TEXT,
  blood_type TEXT,
  doctor TEXT,
  medical_history TEXT,
  trusted_persons JSONB DEFAULT '[]'::jsonb,
  avatar_url TEXT,
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read
CREATE POLICY "Allow read access" ON characters
  FOR SELECT USING (true);

-- Allow anyone to insert
CREATE POLICY "Allow insert access" ON characters
  FOR INSERT WITH CHECK (true);

-- Allow anyone to update
CREATE POLICY "Allow update access" ON characters
  FOR UPDATE USING (true);

-- Allow anyone to delete
CREATE POLICY "Allow delete access" ON characters
  FOR DELETE USING (true);

-- Create storage bucket for attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('attachments', 'attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy
CREATE POLICY "Allow public access to attachments" ON storage.objects
  FOR SELECT USING (bucket_id = 'attachments');

CREATE POLICY "Allow authenticated uploads" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'attachments');
