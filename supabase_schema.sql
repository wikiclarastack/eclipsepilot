-- ============================================================
-- Roblox Dev AI — Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  discord_id TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- AI interaction logs
CREATE TABLE IF NOT EXISTS public.logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  prompt TEXT NOT NULL,
  response TEXT NOT NULL,
  model TEXT DEFAULT 'llama-3.3-70b-versatile',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Developer documentation
CREATE TABLE IF NOT EXISTS public.dev_docs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  category TEXT NOT NULL DEFAULT 'General',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Security events log
CREATE TABLE IF NOT EXISTS public.security_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  ip_address TEXT,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ── Indexes ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_users_discord_id ON public.users(discord_id);
CREATE INDEX IF NOT EXISTS idx_logs_user_id ON public.logs(user_id);
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON public.logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dev_docs_category ON public.dev_docs(category);
CREATE INDEX IF NOT EXISTS idx_security_logs_created_at ON public.security_logs(created_at DESC);

-- ── Row Level Security ────────────────────────────────────────
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dev_docs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users read own data" ON public.users
  FOR SELECT USING (auth.uid()::text = discord_id);

-- Logs: users can read their own logs
CREATE POLICY "Users read own logs" ON public.logs
  FOR SELECT USING (user_id IN (
    SELECT id FROM public.users WHERE discord_id = auth.uid()::text
  ));

-- Dev docs are public read
CREATE POLICY "Dev docs public read" ON public.dev_docs
  FOR SELECT USING (true);

-- Service role can do everything (backend uses service key)
CREATE POLICY "Service role full access users" ON public.users
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access logs" ON public.logs
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access security" ON public.security_logs
  FOR ALL USING (auth.role() = 'service_role');

-- ── Updated_at trigger ────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER dev_docs_updated_at
  BEFORE UPDATE ON public.dev_docs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
