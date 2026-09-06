-- ============================================================================
-- PARTNERPLUS — COOPERATIVE GIG SERVICES PLATFORM
-- MIGRATION 008: Notifications, Complaints & Audit Logging
-- ============================================================================

DO $$ BEGIN
    CREATE TYPE complaint_status_enum AS ENUM (
        'OPEN',
        'UNDER_REVIEW',
        'UNDER_INVESTIGATION',
        'RESOLVED',
        'REJECTED',
        'ESCALATED',
        'CLOSED',
        'MEDIATION'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 1. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    recipient_type TEXT NOT NULL DEFAULT 'customer', -- 'customer' | 'worker' | 'cooperative'
    type TEXT NOT NULL DEFAULT 'booking', -- 'booking' | 'status_update' | 'payment' | 'emergency' | 'review'
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    data JSONB DEFAULT '{}'::jsonb,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    priority TEXT DEFAULT 'NORMAL',
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. USER DEVICES TABLE
CREATE TABLE IF NOT EXISTS public.user_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    device_id TEXT NOT NULL,
    push_token TEXT,
    platform TEXT NOT NULL DEFAULT 'web', -- 'web' | 'android' | 'ios'
    active BOOLEAN DEFAULT TRUE,
    last_seen_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, device_id)
);

-- 3. NOTIFICATION PREFERENCES TABLE
CREATE TABLE IF NOT EXISTS public.notification_preferences (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    email_enabled BOOLEAN DEFAULT TRUE,
    sms_enabled BOOLEAN DEFAULT TRUE,
    push_enabled BOOLEAN DEFAULT TRUE,
    booking_updates BOOLEAN DEFAULT TRUE,
    job_updates BOOLEAN DEFAULT TRUE,
    payment_updates BOOLEAN DEFAULT TRUE,
    emergency_alerts BOOLEAN DEFAULT TRUE,
    marketing_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. COMPLAINTS TABLE
CREATE TABLE IF NOT EXISTS public.complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reported_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    complainant_name TEXT,
    against_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    respondent_name TEXT,
    reporter_type TEXT DEFAULT 'customer', -- 'customer' | 'worker'
    related_booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    job_id UUID REFERENCES public.job_openings(id) ON DELETE SET NULL,
    organization_id UUID REFERENCES public.organization_profiles(id) ON DELETE SET NULL,
    category TEXT NOT NULL DEFAULT 'Service Quality',
    priority TEXT DEFAULT 'MEDIUM', -- 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
    status complaint_status_enum DEFAULT 'OPEN',
    assigned_staff TEXT DEFAULT 'Cooperative Mediation Officer',
    description TEXT NOT NULL,
    resolution_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    actor_name TEXT NOT NULL,
    actor_role TEXT NOT NULL, -- e.g. 'COOPERATIVE_ADMIN', 'SYSTEM'
    action TEXT NOT NULL, -- e.g. 'WORKER_VERIFIED', 'MANUAL_DISPATCH'
    entity_type TEXT NOT NULL, -- e.g. 'WORKER', 'BOOKING'
    entity_id TEXT NOT NULL,
    previous_state JSONB DEFAULT '{}'::jsonb,
    new_state JSONB DEFAULT '{}'::jsonb,
    reason TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);
