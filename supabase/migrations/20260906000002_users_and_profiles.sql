-- ============================================================================
-- PARTNERPLUS — COOPERATIVE GIG SERVICES PLATFORM
-- MIGRATION 002: Users and Core Profiles
-- ============================================================================

-- Custom Types
DO $$ BEGIN
    CREATE TYPE user_role_enum AS ENUM (
        'CUSTOMER',
        'WORKER',
        'COOPERATIVE_ADMIN',
        'COOPERATIVE_STAFF',
        'ORGANIZATION_ADMIN',
        'ORGANIZATION_STAFF'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE account_status_enum AS ENUM (
        'PENDING',
        'ACTIVE',
        'SUSPENDED',
        'REJECTED',
        'DEACTIVATED'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE worker_tier_enum AS ENUM (
        'SKILLED',
        'SEMI_SKILLED',
        'GENERAL'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE verification_status_enum AS ENUM (
        'PENDING',
        'UNDER_REVIEW',
        'VERIFIED',
        'REJECTED',
        'SUSPENDED'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE organization_type_enum AS ENUM (
        'Company',
        'Contractor',
        'Factory',
        'Office',
        'Construction Company',
        'Facility Management',
        'Event Organization',
        'Housing Society',
        'NGO',
        'Institution',
        'Other'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE NOT NULL,
    role user_role_enum NOT NULL,
    account_status account_status_enum NOT NULL DEFAULT 'PENDING',
    email TEXT,
    phone TEXT,
    preferred_language TEXT DEFAULT 'en',
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. CUSTOMER PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.customer_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    profile_photo_path TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    postal_code TEXT,
    preferred_language TEXT DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. COOPERATIVE PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.cooperative_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cooperative_name TEXT NOT NULL,
    registration_number TEXT UNIQUE NOT NULL,
    address TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    postal_code TEXT,
    official_email TEXT,
    phone TEXT NOT NULL,
    contact_person TEXT,
    established_year INT DEFAULT 2014,
    president_name TEXT,
    welfare_balance NUMERIC(12, 2) DEFAULT 0.00,
    verification_status verification_status_enum DEFAULT 'VERIFIED',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. WORKER PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.worker_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    cooperative_id UUID REFERENCES public.cooperative_profiles(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    profile_photo_path TEXT,
    worker_type worker_tier_enum NOT NULL DEFAULT 'SKILLED',
    primary_skill_id TEXT,
    primary_skill_label TEXT,
    experience_years NUMERIC(3, 1) DEFAULT 0.0,
    verification_status verification_status_enum DEFAULT 'PENDING',
    account_status account_status_enum DEFAULT 'ACTIVE',
    emergency_available BOOLEAN DEFAULT FALSE,
    availability_status BOOLEAN DEFAULT TRUE,
    rating NUMERIC(3, 2) DEFAULT 5.00,
    jobs_completed INT DEFAULT 0,
    current_location_name TEXT,
    city TEXT DEFAULT 'Chennai',
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    service_radius_km NUMERIC(4, 1) DEFAULT 10.0,
    preferred_language TEXT DEFAULT 'en',
    coop_member_id TEXT UNIQUE,
    starting_price NUMERIC(10, 2) DEFAULT 399.00,
    bio TEXT,
    languages TEXT[],
    welfare_scheme_id TEXT DEFAULT 'PMSBY-2026-COOP',
    is_identity_checked BOOLEAN DEFAULT TRUE,
    is_police_clearance_verified BOOLEAN DEFAULT TRUE,
    bank_account_linked BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. ORGANIZATION PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.organization_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_name TEXT NOT NULL,
    legal_name TEXT,
    organization_type organization_type_enum NOT NULL DEFAULT 'Company',
    registration_number TEXT,
    gst_number TEXT,
    contact_person TEXT NOT NULL,
    designation TEXT,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT,
    postal_code TEXT,
    website TEXT,
    description TEXT,
    verification_status verification_status_enum DEFAULT 'VERIFIED',
    total_projects_count INT DEFAULT 0,
    active_workforce_count INT DEFAULT 0,
    total_spend NUMERIC(12, 2) DEFAULT 0.00,
    verified_at TIMESTAMPTZ,
    verified_by TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
