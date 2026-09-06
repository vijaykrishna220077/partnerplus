-- ============================================================================
-- PARTNERPLUS — COOPERATIVE GIG SERVICES PLATFORM
-- MIGRATION 007: Payments, Invoices, Worker Earnings & Welfare Reserve
-- ============================================================================

DO $$ BEGIN
    CREATE TYPE payment_status_enum AS ENUM (
        'PENDING',
        'AUTHORIZED',
        'PAID',
        'FAILED',
        'REFUNDED',
        'PARTIALLY_REFUNDED',
        'DISPUTED'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 1. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    organization_project_id UUID REFERENCES public.organization_projects(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES public.customer_profiles(id) ON DELETE SET NULL,
    organization_id UUID REFERENCES public.organization_profiles(id) ON DELETE SET NULL,
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    payment_method TEXT DEFAULT 'upi', -- 'upi' | 'card' | 'netbanking' | 'cash'
    status payment_status_enum DEFAULT 'PENDING',
    provider TEXT DEFAULT 'Razorpay',
    provider_transaction_id TEXT,
    provider_reference TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. PAYMENT EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.payment_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID REFERENCES public.payments(id) ON DELETE CASCADE,
    provider_event_id TEXT UNIQUE NOT NULL,
    event_type TEXT NOT NULL, -- e.g. 'payment.captured', 'payment.failed'
    payload_reference JSONB NOT NULL DEFAULT '{}'::jsonb,
    processed BOOLEAN DEFAULT TRUE,
    processed_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. INVOICES TABLE
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number TEXT UNIQUE NOT NULL,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    organization_project_id UUID REFERENCES public.organization_projects(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES public.customer_profiles(id) ON DELETE SET NULL,
    organization_id UUID REFERENCES public.organization_profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT NOT NULL,
    worker_name TEXT NOT NULL,
    worker_phone TEXT NOT NULL,
    cooperative_name TEXT NOT NULL,
    cooperative_reg_no TEXT NOT NULL,
    service_category TEXT NOT NULL,
    service_name TEXT NOT NULL,
    task_name TEXT NOT NULL,
    quantity INT DEFAULT 1,
    subtotal NUMERIC(10, 2) NOT NULL,
    priority_fee NUMERIC(10, 2) DEFAULT 0.00,
    parts_amount NUMERIC(10, 2) DEFAULT 0.00,
    tax NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    fees NUMERIC(10, 2) DEFAULT 0.00,
    total NUMERIC(10, 2) NOT NULL,
    worker_earnings NUMERIC(10, 2) NOT NULL,
    welfare_fund NUMERIC(10, 2) NOT NULL,
    payment_method TEXT DEFAULT 'upi',
    status payment_status_enum DEFAULT 'PAID',
    provider_transaction_id TEXT,
    issued_at TIMESTAMPTZ DEFAULT now(),
    paid_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. WORKER EARNINGS TABLE
CREATE TABLE IF NOT EXISTS public.worker_earnings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id UUID REFERENCES public.worker_profiles(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    job_id UUID REFERENCES public.job_openings(id) ON DELETE SET NULL,
    assignment_id UUID REFERENCES public.job_assignments(id) ON DELETE SET NULL,
    task_title TEXT NOT NULL,
    service_category TEXT NOT NULL,
    gross_amount NUMERIC(10, 2) NOT NULL,
    cooperative_contribution NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    welfare_deducted NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    net_amount NUMERIC(10, 2) NOT NULL,
    payment_mode TEXT DEFAULT 'Direct Bank Escrow',
    status TEXT DEFAULT 'paid',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. WORKER PAYOUTS TABLE
CREATE TABLE IF NOT EXISTS public.worker_payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id UUID REFERENCES public.worker_profiles(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'PROCESSED', -- 'PENDING' | 'PROCESSED' | 'FAILED'
    payout_reference TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    processed_at TIMESTAMPTZ DEFAULT now()
);

-- 6. WELFARE RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.welfare_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id UUID REFERENCES public.worker_profiles(id) ON DELETE CASCADE,
    worker_name TEXT NOT NULL,
    trade TEXT NOT NULL,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    contribution_type TEXT DEFAULT '5% Cooperative Welfare Reserve',
    insurance_scheme TEXT DEFAULT 'PMSBY Accident Insurance',
    benefits_status TEXT DEFAULT 'ACTIVE_COVERAGE', -- 'ACTIVE_COVERAGE' | 'CLAIM_PENDING' | 'DOCS_REQUIRED'
    accumulated_welfare NUMERIC(10, 2) DEFAULT 0.00,
    claim_type TEXT,
    amount_requested NUMERIC(10, 2),
    date_filed DATE,
    status TEXT DEFAULT 'APPROVED', -- 'PENDING' | 'APPROVED' | 'REJECTED'
    adjudicated_by TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);
