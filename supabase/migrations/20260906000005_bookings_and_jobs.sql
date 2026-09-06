-- ============================================================================
-- PARTNERPLUS — COOPERATIVE GIG SERVICES PLATFORM
-- MIGRATION 005: Bookings, Job Openings & Multi-Worker Assignments
-- ============================================================================

DO $$ BEGIN
    CREATE TYPE booking_status_enum AS ENUM (
        'REQUESTED',
        'MATCHING',
        'ASSIGNED',
        'ACCEPTED',
        'ON_THE_WAY',
        'ARRIVED',
        'IN_PROGRESS',
        'COMPLETED',
        'PAYMENT_PENDING',
        'PAID',
        'CANCELLED',
        'DISPUTED'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE job_status_enum AS ENUM (
        'OPEN',
        'MATCHING',
        'OFFERED',
        'PARTIALLY_FILLED',
        'ASSIGNED',
        'IN_PROGRESS',
        'COMPLETED',
        'EXPIRED',
        'CANCELLED'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE job_assignment_status_enum AS ENUM (
        'OFFERED',
        'ACCEPTED',
        'REJECTED',
        'EXPIRED',
        'CANCELLED',
        'ON_THE_WAY',
        'ARRIVED',
        'IN_PROGRESS',
        'COMPLETED'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 1. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_number TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES public.customer_profiles(id) ON DELETE RESTRICT,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    service_id TEXT REFERENCES public.services(id) ON DELETE SET NULL,
    service_task_id TEXT REFERENCES public.service_tasks(id) ON DELETE SET NULL,
    service_category TEXT NOT NULL,
    service_name TEXT NOT NULL,
    specific_task_name TEXT,
    quantity INT DEFAULT 1,
    task_unit TEXT DEFAULT 'job',
    worker_id UUID REFERENCES public.worker_profiles(id) ON DELETE SET NULL,
    worker_name TEXT,
    worker_photo TEXT,
    worker_phone TEXT,
    cooperative_id UUID REFERENCES public.cooperative_profiles(id) ON DELETE SET NULL,
    cooperative_name TEXT,
    organization_id UUID REFERENCES public.organization_profiles(id) ON DELETE SET NULL,
    scheduled_date DATE NOT NULL,
    start_time TEXT NOT NULL DEFAULT '10:00 AM',
    estimated_duration_minutes INT DEFAULT 45,
    problem_description TEXT NOT NULL,
    photo_attachment_url TEXT,
    street_address TEXT NOT NULL,
    area TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Chennai',
    pincode TEXT,
    landmark TEXT,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    priority TEXT DEFAULT 'NORMAL',
    is_emergency BOOLEAN DEFAULT FALSE,
    requires_parts BOOLEAN DEFAULT FALSE,
    parts_estimated_amount NUMERIC(10, 2) DEFAULT 0.00,
    parts_amount NUMERIC(10, 2) DEFAULT 0.00,
    priority_fee NUMERIC(10, 2) DEFAULT 0.00,
    status booking_status_enum DEFAULT 'REQUESTED',
    confirmed_at TIMESTAMPTZ DEFAULT now(),
    accepted_at TIMESTAMPTZ,
    on_the_way_at TIMESTAMPTZ,
    arrived_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    service_charge NUMERIC(10, 2) NOT NULL DEFAULT 399.00,
    worker_expected_earning NUMERIC(10, 2) NOT NULL DEFAULT 379.00,
    cooperative_welfare_fund NUMERIC(10, 2) NOT NULL DEFAULT 20.00,
    platform_convenience_fee NUMERIC(10, 2) DEFAULT 0.00,
    tax_gst NUMERIC(10, 2) DEFAULT 20.00,
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 419.00,
    payment_method TEXT DEFAULT 'upi',
    payment_status TEXT DEFAULT 'pending',
    transaction_id TEXT,
    paid_at TIMESTAMPTZ,
    match_score NUMERIC(5, 2),
    worker_distance_km NUMERIC(5, 2),
    worker_rating NUMERIC(3, 2),
    cancellation_reason TEXT,
    cancelled_by TEXT,
    assigned_at TIMESTAMPTZ,
    eta_minutes INT,
    review_rating INT,
    review_comment TEXT,
    review_tags TEXT[],
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. BOOKING STATUS HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.booking_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    previous_status booking_status_enum,
    new_status booking_status_enum NOT NULL,
    changed_by TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. BOOKING PARTS TABLE
CREATE TABLE IF NOT EXISTS public.booking_parts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    receipt_url TEXT,
    added_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. JOB OPENINGS TABLE
CREATE TABLE IF NOT EXISTS public.job_openings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    organization_work_request_id UUID REFERENCES public.organization_work_requests(id) ON DELETE SET NULL,
    service_id TEXT REFERENCES public.services(id) ON DELETE SET NULL,
    service_task_id TEXT REFERENCES public.service_tasks(id) ON DELETE SET NULL,
    worker_type_required worker_tier_enum NOT NULL DEFAULT 'SKILLED',
    workers_required INT DEFAULT 1,
    workers_assigned INT DEFAULT 0,
    scheduled_date DATE NOT NULL,
    start_time TEXT NOT NULL DEFAULT '09:00 AM',
    estimated_duration_minutes INT DEFAULT 60,
    priority TEXT DEFAULT 'NORMAL',
    status job_status_enum DEFAULT 'OPEN',
    description TEXT NOT NULL,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. JOB REQUIREMENTS TABLE
CREATE TABLE IF NOT EXISTS public.job_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES public.job_openings(id) ON DELETE CASCADE,
    skill_id TEXT REFERENCES public.skills(id) ON DELETE CASCADE,
    minimum_experience_years NUMERIC(3, 1) DEFAULT 0.0,
    skill_level skill_level_enum DEFAULT 'intermediate',
    verification_required BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. JOB ASSIGNMENTS TABLE (Atomic Reservation)
CREATE TABLE IF NOT EXISTS public.job_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES public.job_openings(id) ON DELETE CASCADE,
    worker_id UUID REFERENCES public.worker_profiles(id) ON DELETE CASCADE,
    status job_assignment_status_enum DEFAULT 'OFFERED',
    offered_at TIMESTAMPTZ DEFAULT now(),
    accepted_at TIMESTAMPTZ,
    rejected_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    payout_amount NUMERIC(10, 2) DEFAULT 0.00,
    payment_status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(job_id, worker_id)
);

-- 7. JOB ASSIGNMENT HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.job_assignment_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES public.job_openings(id) ON DELETE CASCADE,
    worker_id UUID REFERENCES public.worker_profiles(id) ON DELETE CASCADE,
    old_status job_assignment_status_enum,
    new_status job_assignment_status_enum NOT NULL,
    changed_by TEXT NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);
