-- ============================================================================
-- PARTNERPLUS — COOPERATIVE GIG SERVICES PLATFORM
-- MIGRATION 012: Real RLS Hardening — removes anonymous bypasses,
-- removes blanket "true" policies, and locks down previously-unprotected
-- tables (payments, invoices, notifications, complaints, locations, chat,
-- documents, audit logs, cooperative/organization membership).
--
-- WHY THIS MIGRATION EXISTS
-- Prior migrations enabled RLS but included "OR auth.uid() IS NULL" or blanket
-- inserts. This migration revokes anonymous table grants, removes blanket policies,
-- and enforces ownership/role-based security across all tables.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 0. Revoke blanket grants handed to `anon`. `authenticated` keeps normal access;
--    RLS policies below decide which rows it can see.
-- ----------------------------------------------------------------------------
REVOKE ALL ON public.users FROM anon;
REVOKE ALL ON public.customer_profiles FROM anon;
REVOKE ALL ON public.worker_profiles FROM anon;
REVOKE ALL ON public.organization_profiles FROM anon;
REVOKE ALL ON public.cooperative_profiles FROM anon;

GRANT SELECT ON public.worker_profiles TO anon;          -- public worker directory
GRANT SELECT ON public.cooperative_profiles TO anon;      -- public coop directory
GRANT SELECT ON public.organization_profiles TO anon;     -- public org directory
GRANT SELECT, INSERT ON public.users TO anon;             -- needed for signup flow
GRANT SELECT, INSERT ON public.customer_profiles TO anon;
GRANT SELECT, INSERT ON public.worker_profiles TO anon;
GRANT SELECT, INSERT ON public.organization_profiles TO anon;

-- Drop the dangerous blanket policies outright.
DROP POLICY IF EXISTS "Allow anon and auth insert users" ON public.users;
DROP POLICY IF EXISTS "Allow anon and auth insert customer_profiles" ON public.customer_profiles;
DROP POLICY IF EXISTS "Allow anon and auth insert worker_profiles" ON public.worker_profiles;
DROP POLICY IF EXISTS "Allow anon and auth insert organization_profiles" ON public.organization_profiles;

-- ----------------------------------------------------------------------------
-- 1. USERS — no anon bypass.
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users select self or admin" ON public.users;
CREATE POLICY "Users select self or admin" ON public.users FOR SELECT
  USING (auth_user_id = auth.uid() OR public.is_admin_or_staff());

DROP POLICY IF EXISTS "Users insert self" ON public.users;
CREATE POLICY "Users insert self" ON public.users FOR INSERT
  WITH CHECK (auth_user_id = auth.uid());

DROP POLICY IF EXISTS "Users update self or admin" ON public.users;
CREATE POLICY "Users update self or admin" ON public.users FOR UPDATE
  USING (auth_user_id = auth.uid() OR public.is_admin_or_staff());

-- ----------------------------------------------------------------------------
-- 2. CUSTOMER PROFILES
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Customer profiles select self or admin" ON public.customer_profiles;
CREATE POLICY "Customer profiles select self or admin" ON public.customer_profiles FOR SELECT
  USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()) OR public.is_admin_or_staff());

DROP POLICY IF EXISTS "Customer profiles insert self" ON public.customer_profiles;
CREATE POLICY "Customer profiles insert self" ON public.customer_profiles FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

DROP POLICY IF EXISTS "Customer profiles update self" ON public.customer_profiles;
CREATE POLICY "Customer profiles update self" ON public.customer_profiles FOR UPDATE
  USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()) OR public.is_admin_or_staff());

-- ----------------------------------------------------------------------------
-- 3. WORKER PROFILES
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public worker profiles read" ON public.worker_profiles;
CREATE POLICY "Public worker profiles read" ON public.worker_profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Worker profiles insert self or admin" ON public.worker_profiles;
CREATE POLICY "Worker profiles insert self or admin" ON public.worker_profiles FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()) OR public.is_admin_or_staff());

DROP POLICY IF EXISTS "Worker profiles update self or admin" ON public.worker_profiles;
CREATE POLICY "Worker profiles update self or admin" ON public.worker_profiles FOR UPDATE
  USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()) OR public.is_admin_or_staff());

-- ----------------------------------------------------------------------------
-- 4. COOPERATIVE / ORGANIZATION PROFILES — public read, admin write.
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public cooperatives read" ON public.cooperative_profiles;
CREATE POLICY "Public cooperatives read" ON public.cooperative_profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Cooperative profiles write admin" ON public.cooperative_profiles;
CREATE POLICY "Cooperative profiles write admin" ON public.cooperative_profiles FOR ALL
  USING (public.is_admin_or_staff()) WITH CHECK (public.is_admin_or_staff());

DROP POLICY IF EXISTS "Public organizations read" ON public.organization_profiles;
CREATE POLICY "Public organizations read" ON public.organization_profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Organization profiles write admin" ON public.organization_profiles;
CREATE POLICY "Organization profiles write admin" ON public.organization_profiles FOR ALL
  USING (public.is_admin_or_staff()) WITH CHECK (public.is_admin_or_staff());

-- ----------------------------------------------------------------------------
-- 5. BOOKINGS — owner / assigned worker / staff.
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Bookings select owner or admin" ON public.bookings;
CREATE POLICY "Bookings select owner or admin" ON public.bookings FOR SELECT
  USING (
    customer_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
    OR worker_id IN (SELECT id FROM public.worker_profiles WHERE user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()))
    OR public.is_admin_or_staff()
  );

DROP POLICY IF EXISTS "Bookings insert authenticated" ON public.bookings;
DROP POLICY IF EXISTS "Bookings insert own" ON public.bookings;
CREATE POLICY "Bookings insert own" ON public.bookings FOR INSERT
  WITH CHECK (
    customer_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
    OR public.is_admin_or_staff()
  );

DROP POLICY IF EXISTS "Bookings update owner or admin" ON public.bookings;
CREATE POLICY "Bookings update owner or admin" ON public.bookings FOR UPDATE
  USING (
    customer_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
    OR worker_id IN (SELECT id FROM public.worker_profiles WHERE user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()))
    OR public.is_admin_or_staff()
  );

-- ----------------------------------------------------------------------------
-- 6. CONVERSATIONS / PARTICIPANTS / MESSAGES
-- ----------------------------------------------------------------------------
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Conversations select participant or admin" ON public.conversations;
CREATE POLICY "Conversations select participant or admin" ON public.conversations FOR SELECT
  USING (
    id IN (
      SELECT conversation_id FROM public.conversation_participants
      WHERE user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
    )
    OR public.is_admin_or_staff()
  );
DROP POLICY IF EXISTS "Conversations insert participant" ON public.conversations;
CREATE POLICY "Conversations insert participant" ON public.conversations FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Conversation participants select self or admin" ON public.conversation_participants;
CREATE POLICY "Conversation participants select self or admin" ON public.conversation_participants FOR SELECT
  USING (
    user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
    OR public.is_admin_or_staff()
  );
DROP POLICY IF EXISTS "Conversation participants insert self" ON public.conversation_participants;
CREATE POLICY "Conversation participants insert self" ON public.conversation_participants FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

DROP POLICY IF EXISTS "Messages select participant or admin" ON public.messages;
CREATE POLICY "Messages select participant or admin" ON public.messages FOR SELECT
  USING (
    sender_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
    OR recipient_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
    OR conversation_id IN (
      SELECT conversation_id FROM public.conversation_participants
      WHERE user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
    )
    OR public.is_admin_or_staff()
  );

DROP POLICY IF EXISTS "Messages insert sender" ON public.messages;
CREATE POLICY "Messages insert sender" ON public.messages FOR INSERT
  WITH CHECK (sender_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

-- ----------------------------------------------------------------------------
-- 7. JOB OPENINGS / ASSIGNMENTS
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public job openings read" ON public.job_openings;
CREATE POLICY "Public job openings read" ON public.job_openings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Job openings write admin" ON public.job_openings;
CREATE POLICY "Job openings write admin" ON public.job_openings FOR ALL
  USING (public.is_admin_or_staff()) WITH CHECK (public.is_admin_or_staff());

DROP POLICY IF EXISTS "Job assignments select worker or admin" ON public.job_assignments;
CREATE POLICY "Job assignments select worker or admin" ON public.job_assignments FOR SELECT
  USING (
    worker_id IN (SELECT id FROM public.worker_profiles WHERE user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()))
    OR public.is_admin_or_staff()
  );

-- ----------------------------------------------------------------------------
-- 8. WORKER EARNINGS / PAYOUTS / WELFARE
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Worker earnings select worker or admin" ON public.worker_earnings;
CREATE POLICY "Worker earnings select worker or admin" ON public.worker_earnings FOR SELECT
  USING (
    worker_id IN (SELECT id FROM public.worker_profiles WHERE user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()))
    OR public.is_admin_or_staff()
  );

ALTER TABLE public.worker_payouts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Worker payouts select worker or admin" ON public.worker_payouts;
CREATE POLICY "Worker payouts select worker or admin" ON public.worker_payouts FOR SELECT
  USING (
    worker_id IN (SELECT id FROM public.worker_profiles WHERE user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()))
    OR public.is_admin_or_staff()
  );
DROP POLICY IF EXISTS "Worker payouts write admin" ON public.worker_payouts;
CREATE POLICY "Worker payouts write admin" ON public.worker_payouts FOR ALL
  USING (public.is_admin_or_staff()) WITH CHECK (public.is_admin_or_staff());

ALTER TABLE public.welfare_records ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Welfare records select worker or admin" ON public.welfare_records;
CREATE POLICY "Welfare records select worker or admin" ON public.welfare_records FOR SELECT
  USING (
    worker_id IN (SELECT id FROM public.worker_profiles WHERE user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()))
    OR public.is_admin_or_staff()
  );
DROP POLICY IF EXISTS "Welfare records write admin" ON public.welfare_records;
CREATE POLICY "Welfare records write admin" ON public.welfare_records FOR ALL
  USING (public.is_admin_or_staff()) WITH CHECK (public.is_admin_or_staff());

-- ----------------------------------------------------------------------------
-- 9. PAYMENTS / PAYMENT EVENTS / INVOICES
-- ----------------------------------------------------------------------------
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Payments select owner or admin" ON public.payments;
CREATE POLICY "Payments select owner or admin" ON public.payments FOR SELECT
  USING (
    customer_id IN (SELECT id FROM public.customer_profiles WHERE user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()))
    OR public.is_admin_or_staff()
  );

ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Payment events admin only" ON public.payment_events;
CREATE POLICY "Payment events admin only" ON public.payment_events FOR SELECT
  USING (public.is_admin_or_staff());

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Invoices select owner or admin" ON public.invoices;
CREATE POLICY "Invoices select owner or admin" ON public.invoices FOR SELECT
  USING (
    customer_id IN (SELECT id FROM public.customer_profiles WHERE user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()))
    OR public.is_admin_or_staff()
  );
DROP POLICY IF EXISTS "Invoices write admin" ON public.invoices;
CREATE POLICY "Invoices write admin" ON public.invoices FOR ALL
  USING (public.is_admin_or_staff()) WITH CHECK (public.is_admin_or_staff());

-- ----------------------------------------------------------------------------
-- 10. NOTIFICATIONS / USER DEVICES / NOTIFICATION PREFERENCES
-- ----------------------------------------------------------------------------
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Notifications select self or admin" ON public.notifications;
CREATE POLICY "Notifications select self or admin" ON public.notifications FOR SELECT
  USING (
    recipient_user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
    OR public.is_admin_or_staff()
  );
DROP POLICY IF EXISTS "Notifications update self" ON public.notifications;
CREATE POLICY "Notifications update self" ON public.notifications FOR UPDATE
  USING (recipient_user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

ALTER TABLE public.user_devices ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "User devices self" ON public.user_devices;
CREATE POLICY "User devices self" ON public.user_devices FOR ALL
  USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()))
  WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Notification preferences self" ON public.notification_preferences;
CREATE POLICY "Notification preferences self" ON public.notification_preferences FOR ALL
  USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()))
  WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

-- ----------------------------------------------------------------------------
-- 11. COMPLAINTS
-- ----------------------------------------------------------------------------
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Complaints select involved or admin" ON public.complaints;
CREATE POLICY "Complaints select involved or admin" ON public.complaints FOR SELECT
  USING (
    reported_by IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
    OR against_user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
    OR public.is_admin_or_staff()
  );
DROP POLICY IF EXISTS "Complaints insert reporter" ON public.complaints;
CREATE POLICY "Complaints insert reporter" ON public.complaints FOR INSERT
  WITH CHECK (reported_by IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));
DROP POLICY IF EXISTS "Complaints update admin" ON public.complaints;
CREATE POLICY "Complaints update admin" ON public.complaints FOR UPDATE
  USING (public.is_admin_or_staff());

-- ----------------------------------------------------------------------------
-- 12. AUDIT LOGS — staff/admin only
-- ----------------------------------------------------------------------------
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Audit logs select admin" ON public.audit_logs;
CREATE POLICY "Audit logs select admin" ON public.audit_logs FOR SELECT
  USING (public.is_admin_or_staff());

-- ----------------------------------------------------------------------------
-- 13. LOCATIONS — live GPS
-- ----------------------------------------------------------------------------
ALTER TABLE public.worker_locations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Worker locations select self or booking customer or admin" ON public.worker_locations;
CREATE POLICY "Worker locations select self or booking customer or admin" ON public.worker_locations FOR SELECT
  USING (
    worker_id IN (SELECT id FROM public.worker_profiles WHERE user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()))
    OR public.is_admin_or_staff()
    OR worker_id IN (
      SELECT worker_id FROM public.bookings
      WHERE customer_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
        AND status NOT IN ('COMPLETED', 'CANCELLED')
    )
  );
DROP POLICY IF EXISTS "Worker locations insert self" ON public.worker_locations;
CREATE POLICY "Worker locations insert self" ON public.worker_locations FOR INSERT
  WITH CHECK (worker_id IN (SELECT id FROM public.worker_profiles WHERE user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())));

ALTER TABLE public.customer_locations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Customer locations select self or job worker or admin" ON public.customer_locations;
CREATE POLICY "Customer locations select self or job worker or admin" ON public.customer_locations FOR SELECT
  USING (
    customer_id IN (SELECT id FROM public.customer_profiles WHERE user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()))
    OR public.is_admin_or_staff()
    OR booking_id IN (
      SELECT id FROM public.bookings
      WHERE worker_id IN (SELECT id FROM public.worker_profiles WHERE user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()))
    )
  );
DROP POLICY IF EXISTS "Customer locations insert self" ON public.customer_locations;
CREATE POLICY "Customer locations insert self" ON public.customer_locations FOR INSERT
  WITH CHECK (customer_id IN (SELECT id FROM public.customer_profiles WHERE user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())));

-- ----------------------------------------------------------------------------
-- 14. WORKER DOCUMENTS / CERTIFICATIONS
-- ----------------------------------------------------------------------------
ALTER TABLE public.worker_documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Worker documents self or admin" ON public.worker_documents;
CREATE POLICY "Worker documents self or admin" ON public.worker_documents FOR ALL
  USING (
    worker_id IN (SELECT id FROM public.worker_profiles WHERE user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()))
    OR public.is_admin_or_staff()
  )
  WITH CHECK (
    worker_id IN (SELECT id FROM public.worker_profiles WHERE user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()))
    OR public.is_admin_or_staff()
  );

ALTER TABLE public.worker_certifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Worker certifications public read" ON public.worker_certifications;
CREATE POLICY "Worker certifications public read" ON public.worker_certifications FOR SELECT USING (true);
DROP POLICY IF EXISTS "Worker certifications self or admin write" ON public.worker_certifications;
CREATE POLICY "Worker certifications self or admin write" ON public.worker_certifications FOR ALL
  USING (
    worker_id IN (SELECT id FROM public.worker_profiles WHERE user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()))
    OR public.is_admin_or_staff()
  )
  WITH CHECK (
    worker_id IN (SELECT id FROM public.worker_profiles WHERE user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()))
    OR public.is_admin_or_staff()
  );

-- ----------------------------------------------------------------------------
-- 15. COOPERATIVE / ORGANIZATION MEMBERSHIP
-- ----------------------------------------------------------------------------
ALTER TABLE public.cooperative_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Cooperative members self or admin" ON public.cooperative_members;
CREATE POLICY "Cooperative members self or admin" ON public.cooperative_members FOR SELECT
  USING (
    user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
    OR public.is_admin_or_staff()
  );
DROP POLICY IF EXISTS "Cooperative members write admin" ON public.cooperative_members;
CREATE POLICY "Cooperative members write admin" ON public.cooperative_members FOR ALL
  USING (public.is_admin_or_staff()) WITH CHECK (public.is_admin_or_staff());

ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Organization members self or admin" ON public.organization_members;
CREATE POLICY "Organization members self or admin" ON public.organization_members FOR SELECT
  USING (
    user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
    OR public.is_admin_or_staff()
  );
DROP POLICY IF EXISTS "Organization members write admin" ON public.organization_members;
CREATE POLICY "Organization members write admin" ON public.organization_members FOR ALL
  USING (public.is_admin_or_staff()) WITH CHECK (public.is_admin_or_staff());
