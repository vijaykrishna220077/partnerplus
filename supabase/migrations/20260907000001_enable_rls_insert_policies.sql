-- ============================================================================
-- PARTNERPLUS — COOPERATIVE GIG SERVICES PLATFORM
-- MIGRATION 009: Grant INSERT & RLS Policies for Public User Registration
-- ============================================================================

-- 1. Grant table permissions to anon & authenticated API roles
GRANT ALL ON public.users TO anon, authenticated, service_role;
GRANT ALL ON public.customer_profiles TO anon, authenticated, service_role;
GRANT ALL ON public.worker_profiles TO anon, authenticated, service_role;
GRANT ALL ON public.organization_profiles TO anon, authenticated, service_role;
GRANT ALL ON public.cooperative_profiles TO anon, authenticated, service_role;

-- 2. Permissive RLS Policies for Public Registration & Sync
DROP POLICY IF EXISTS "Allow anon and auth insert users" ON public.users;
CREATE POLICY "Allow anon and auth insert users" ON public.users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon and auth insert customer_profiles" ON public.customer_profiles;
CREATE POLICY "Allow anon and auth insert customer_profiles" ON public.customer_profiles FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon and auth insert worker_profiles" ON public.worker_profiles;
CREATE POLICY "Allow anon and auth insert worker_profiles" ON public.worker_profiles FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon and auth insert organization_profiles" ON public.organization_profiles;
CREATE POLICY "Allow anon and auth insert organization_profiles" ON public.organization_profiles FOR ALL USING (true) WITH CHECK (true);
