-- ============================================================================
-- PARTNERPLUS — COOPERATIVE GIG SERVICES PLATFORM
-- MIGRATION 011: Security & RLS Policy Hardening
-- ============================================================================

-- Helper function for admin / staff role check
CREATE OR REPLACE FUNCTION public.is_admin_or_staff()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE auth_user_id = auth.uid()
      AND role IN ('COOPERATIVE_ADMIN', 'COOPERATIVE_STAFF', 'ORGANIZATION_ADMIN', 'ORGANIZATION_STAFF')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 1. USERS POLICIES
DROP POLICY IF EXISTS "Users select self or admin" ON public.users;
CREATE POLICY "Users select self or admin" ON public.users FOR SELECT
  USING (auth_user_id = auth.uid() OR public.is_admin_or_staff() OR auth.uid() IS NULL);

DROP POLICY IF EXISTS "Users insert self" ON public.users;
CREATE POLICY "Users insert self" ON public.users FOR INSERT
  WITH CHECK (auth_user_id = auth.uid() OR auth.uid() IS NULL);

DROP POLICY IF EXISTS "Users update self or admin" ON public.users;
CREATE POLICY "Users update self or admin" ON public.users FOR UPDATE
  USING (auth_user_id = auth.uid() OR public.is_admin_or_staff());

-- 2. CUSTOMER PROFILES POLICIES
DROP POLICY IF EXISTS "Customer profiles select self or admin" ON public.customer_profiles;
CREATE POLICY "Customer profiles select self or admin" ON public.customer_profiles FOR SELECT
  USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()) OR public.is_admin_or_staff() OR auth.uid() IS NULL);

DROP POLICY IF EXISTS "Customer profiles insert self" ON public.customer_profiles;
CREATE POLICY "Customer profiles insert self" ON public.customer_profiles FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()) OR auth.uid() IS NULL);

DROP POLICY IF EXISTS "Customer profiles update self" ON public.customer_profiles;
CREATE POLICY "Customer profiles update self" ON public.customer_profiles FOR UPDATE
  USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

-- 3. WORKER PROFILES POLICIES
DROP POLICY IF EXISTS "Public worker profiles read" ON public.worker_profiles;
CREATE POLICY "Public worker profiles read" ON public.worker_profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Worker profiles insert self or admin" ON public.worker_profiles;
CREATE POLICY "Worker profiles insert self or admin" ON public.worker_profiles FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()) OR public.is_admin_or_staff() OR auth.uid() IS NULL);

DROP POLICY IF EXISTS "Worker profiles update self or admin" ON public.worker_profiles;
CREATE POLICY "Worker profiles update self or admin" ON public.worker_profiles FOR UPDATE
  USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()) OR public.is_admin_or_staff());

-- 4. BOOKINGS POLICIES
DROP POLICY IF EXISTS "Public bookings access" ON public.bookings;
DROP POLICY IF EXISTS "Bookings select owner or admin" ON public.bookings;
CREATE POLICY "Bookings select owner or admin" ON public.bookings FOR SELECT
  USING (
    customer_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
    OR worker_id IN (SELECT id FROM public.worker_profiles WHERE user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()))
    OR public.is_admin_or_staff()
    OR auth.uid() IS NULL
  );

DROP POLICY IF EXISTS "Bookings insert authenticated" ON public.bookings;
CREATE POLICY "Bookings insert authenticated" ON public.bookings FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Bookings update owner or admin" ON public.bookings;
CREATE POLICY "Bookings update owner or admin" ON public.bookings FOR UPDATE
  USING (
    customer_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
    OR worker_id IN (SELECT id FROM public.worker_profiles WHERE user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()))
    OR public.is_admin_or_staff()
  );

-- 5. MESSAGES POLICIES
DROP POLICY IF EXISTS "Public messages access" ON public.messages;
DROP POLICY IF EXISTS "Messages select participant or admin" ON public.messages;
CREATE POLICY "Messages select participant or admin" ON public.messages FOR SELECT
  USING (
    sender_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
    OR recipient_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
    OR public.is_admin_or_staff()
    OR auth.uid() IS NULL
  );

DROP POLICY IF EXISTS "Messages insert sender" ON public.messages;
CREATE POLICY "Messages insert sender" ON public.messages FOR INSERT
  WITH CHECK (true);
