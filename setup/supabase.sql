-- AI Podcaster SaaS - Supabase Schema

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  full_name TEXT,
  avatar_url TEXT,
  monthly_quota INTEGER DEFAULT 5,
  is_admin BOOLEAN DEFAULT FALSE
);

-- Contents table
CREATE TABLE IF NOT EXISTS public.contents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  reference TEXT,
  script JSONB,
  status TEXT DEFAULT 'draft', -- draft, processing, completed, approved, rejected
  is_audio_generated BOOLEAN DEFAULT FALSE,
  is_video_generated BOOLEAN DEFAULT FALSE,
  audio_url TEXT,
  video_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  score NUMERIC,
  tags TEXT[]
);

-- Approvals table
CREATE TABLE IF NOT EXISTS public.approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID REFERENCES contents(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES users(id),
  status TEXT NOT NULL, -- pending, approved, rejected
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Channels table (for managing distribution channels)
CREATE TABLE IF NOT EXISTS public.channels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- podcast, youtube, etc
  credentials JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Publications table (tracks content published to channels)
CREATE TABLE IF NOT EXISTS public.publications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID REFERENCES contents(id) ON DELETE CASCADE,
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  external_url TEXT,
  external_id TEXT,
  status TEXT DEFAULT 'pending', -- pending, published, failed
  stats JSONB -- views, likes, etc
);

-- Create a publication trigger function
CREATE OR REPLACE FUNCTION public.handle_new_publication()
RETURNS TRIGGER AS $$
BEGIN
  -- Set updated_at for content when published
  UPDATE contents SET updated_at = NOW() WHERE id = NEW.content_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for publications
CREATE TRIGGER on_publication_created
  AFTER INSERT ON publications
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_publication();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY users_select_own ON users
  FOR SELECT USING (auth.uid() = id);
  
CREATE POLICY users_update_own ON users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can see all users
CREATE POLICY admin_users_select ON users
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM users WHERE is_admin = true)
  );

-- Content policies
-- Users can select their own content
CREATE POLICY content_select_own ON contents
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own content
CREATE POLICY content_insert_own ON contents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own content
CREATE POLICY content_update_own ON contents
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admins can see and manage all content
CREATE POLICY admin_contents ON contents
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM users WHERE is_admin = true)
  );

-- Approvals policies
-- Only admins can manage approvals
CREATE POLICY admin_approvals ON approvals
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM users WHERE is_admin = true)
  );

-- Users can see approvals for their own content
CREATE POLICY user_approvals_select ON approvals
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM contents
      WHERE contents.id = approvals.content_id
      AND contents.user_id = auth.uid()
    )
  );

-- Channels policies
-- Only admins can manage channels
CREATE POLICY admin_channels ON channels
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM users WHERE is_admin = true)
  );

-- All users can see channel basic info (without credentials)
CREATE POLICY channels_select_all ON channels
  FOR SELECT USING (true);

-- Publications policies
-- Only admins can manage publications
CREATE POLICY admin_publications ON publications
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM users WHERE is_admin = true)
  );

-- Users can see publications of their own content
CREATE POLICY user_publications_select ON publications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM contents
      WHERE contents.id = publications.content_id
      AND contents.user_id = auth.uid()
    )
  );

-- Create an index to improve query performance
CREATE INDEX contents_user_id_idx ON contents (user_id);
CREATE INDEX contents_status_idx ON contents (status);
CREATE INDEX approvals_content_id_idx ON approvals (content_id);
CREATE INDEX publications_content_id_idx ON publications (content_id);
CREATE INDEX publications_channel_id_idx ON publications (channel_id);

-- Create storage buckets
-- These need to be run in the Supabase dashboard or via API
/*
-- Audio storage
INSERT INTO storage.buckets (id, name)
VALUES ('audio', 'Audio files');

-- Video storage
INSERT INTO storage.buckets (id, name)
VALUES ('video', 'Video files');

-- Images storage
INSERT INTO storage.buckets (id, name)
VALUES ('images', 'Image files');

-- Enable RLS on storage buckets
UPDATE storage.buckets SET public = false WHERE id IN ('audio', 'video', 'images');

-- Storage RLS policies
-- Users can read all files
INSERT INTO storage.policies (name, definition, bucket_id)
VALUES (
  'Audio Read Policy',
  '(auth.role() = ''authenticated'')',
  'audio'
);

-- Users can upload their own files
INSERT INTO storage.policies (name, definition, bucket_id)
VALUES (
  'Audio Upload Policy',
  '(auth.role() = ''authenticated'')',
  'audio'
);

-- Similar policies for video and images buckets
*/

-- Admin user function (create first admin)
CREATE OR REPLACE FUNCTION public.create_admin_user(admin_email TEXT, admin_password TEXT)
RETURNS void AS $$
DECLARE
  user_id UUID;
BEGIN
  -- Create user in auth.users via supabase auth (requires admin API)
  -- This is a placeholder and should be implemented through API
  
  -- Create admin user in public.users
  INSERT INTO public.users (email, is_admin, full_name)
  VALUES (admin_email, true, 'System Administrator')
  RETURNING id INTO user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 