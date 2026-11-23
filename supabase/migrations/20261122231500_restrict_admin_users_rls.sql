-- Migration: Restrict Admin User Email Enumeration
-- Revokes public SELECT permissions on public.admin_users
-- Restricts SELECT to authenticated users checking their own email, preventing enumeration

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can view own admin record" ON public.admin_users;

CREATE POLICY "Admins can view own admin record" ON public.admin_users
  FOR SELECT TO authenticated
  USING (email = (auth.jwt() ->> 'email'));
