-- ============================================================================
-- PARTNERPLUS — COOPERATIVE GIG SERVICES PLATFORM
-- MIGRATION 004: Cooperative Members, Settings & Enterprise Projects
-- ============================================================================

DO $$ BEGIN
    CREATE TYPE coop_member_role_enum AS ENUM (
        'COOPERATIVE_ADMIN',
        'COOPERATIVE_STAFF'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE org_member_role_enum AS ENUM (
        'ORGANIZATION_ADMIN',
        'ORGANIZATION_STAFF'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE project_status_enum AS ENUM (
        'ACTIVE',
        'UPCOMING',
        'COMPLETED',
        'CANCELLED'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE work_request_status_enum AS ENUM (
        'OPEN',
        'PARTIALLY_FILLED',
        'FILLED',
        'COMPLETED',
        'CANCELLED'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 1. COOPERATIVE MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.cooperative_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cooperative_id UUID REFERENCES public.cooperative_profiles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    role coop_member_role_enum NOT NULL DEFAULT 'COOPERATIVE_STAFF',
    status account_status_enum NOT NULL DEFAULT 'ACTIVE',
    approved_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(cooperative_id, user_id)
);

-- 2. COOPERATIVE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.cooperative_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cooperative_id UUID UNIQUE REFERENCES public.cooperative_profiles(id) ON DELETE CASCADE,
    worker_commission_rule NUMERIC(5, 2) DEFAULT 95.00,
    welfare_rule NUMERIC(5, 2) DEFAULT 5.00,
    emergency_fee NUMERIC(8, 2) DEFAULT 49.00,
    service_radius NUMERIC(5, 1) DEFAULT 10.0,
    other_configuration JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. PRICING RULES TABLE
CREATE TABLE IF NOT EXISTS public.pricing_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cooperative_id UUID REFERENCES public.cooperative_profiles(id) ON DELETE CASCADE,
    service_id TEXT REFERENCES public.services(id) ON DELETE CASCADE,
    rule_type TEXT NOT NULL DEFAULT 'FIXED',
    configuration JSONB NOT NULL DEFAULT '{}'::jsonb,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. ORGANIZATION MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organization_profiles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    role org_member_role_enum NOT NULL DEFAULT 'ORGANIZATION_STAFF',
    status account_status_enum NOT NULL DEFAULT 'ACTIVE',
    invited_at TIMESTAMPTZ DEFAULT now(),
    joined_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(organization_id, user_id)
);

-- 5. ORGANIZATION DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS public.organization_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organization_profiles(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    verification_status document_status_enum DEFAULT 'VERIFIED',
    uploaded_at TIMESTAMPTZ DEFAULT now(),
    verified_at TIMESTAMPTZ DEFAULT now(),
    verified_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

-- 6. ORGANIZATION PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.organization_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organization_profiles(id) ON DELETE CASCADE,
    organization_name TEXT NOT NULL,
    project_name TEXT NOT NULL,
    description TEXT,
    location TEXT NOT NULL,
    city TEXT NOT NULL,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    start_date DATE NOT NULL,
    end_date DATE,
    status project_status_enum DEFAULT 'ACTIVE',
    workforce_required_total INT DEFAULT 1,
    workforce_assigned_total INT DEFAULT 0,
    daily_budget NUMERIC(10, 2) DEFAULT 800.00,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. ORGANIZATION WORK REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.organization_work_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.organization_projects(id) ON DELETE CASCADE,
    project_name TEXT NOT NULL,
    organization_id UUID REFERENCES public.organization_profiles(id) ON DELETE CASCADE,
    organization_name TEXT NOT NULL,
    worker_type worker_tier_enum NOT NULL DEFAULT 'SKILLED',
    trade_category TEXT NOT NULL,
    required_skills TEXT[],
    experience_required TEXT,
    workers_needed INT NOT NULL DEFAULT 1,
    workers_assigned INT DEFAULT 0,
    scheduled_date DATE NOT NULL,
    start_time TIME WITHOUT TIME ZONE NOT NULL DEFAULT '09:00:00',
    end_time TIME WITHOUT TIME ZONE NOT NULL DEFAULT '18:00:00',
    location TEXT NOT NULL,
    city TEXT NOT NULL,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    daily_pay_per_worker NUMERIC(10, 2) NOT NULL DEFAULT 850.00,
    meals_provided BOOLEAN DEFAULT TRUE,
    tools_provided BOOLEAN DEFAULT TRUE,
    transport_provided BOOLEAN DEFAULT FALSE,
    description TEXT,
    status work_request_status_enum DEFAULT 'OPEN',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
