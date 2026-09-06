-- ============================================================================
-- PARTNERPLUS — COOPERATIVE GIG SERVICES PLATFORM
-- MIGRATION 003: Skills, Skill Tasks, Worker Documents & Services
-- ============================================================================

DO $$ BEGIN
    CREATE TYPE skill_level_enum AS ENUM (
        'beginner',
        'intermediate',
        'expert'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE document_status_enum AS ENUM (
        'PENDING',
        'VERIFIED',
        'REJECTED',
        'EXPIRED'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 1. SKILLS TABLE
CREATE TABLE IF NOT EXISTS public.skills (
    id TEXT PRIMARY KEY, -- e.g. 'skill-electrician', 'skill-plumber'
    category worker_tier_enum NOT NULL DEFAULT 'SKILLED',
    skill_name TEXT NOT NULL,
    description TEXT,
    verification_required BOOLEAN DEFAULT TRUE,
    minimum_experience_years NUMERIC(3, 1) DEFAULT 0.0,
    active BOOLEAN DEFAULT TRUE,
    trade_icon TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. SKILL TASKS TABLE
CREATE TABLE IF NOT EXISTS public.skill_tasks (
    id TEXT PRIMARY KEY, -- e.g. 'task-elec-fan', 'task-plumb-leak'
    skill_id TEXT REFERENCES public.skills(id) ON DELETE CASCADE,
    task_name TEXT NOT NULL,
    description TEXT,
    min_experience_years NUMERIC(3, 1) DEFAULT 0.0,
    default_estimated_minutes INT DEFAULT 45,
    tools_required TEXT,
    is_regulated_trade BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. WORKER SKILLS TABLE
CREATE TABLE IF NOT EXISTS public.worker_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id UUID REFERENCES public.worker_profiles(id) ON DELETE CASCADE,
    skill_id TEXT REFERENCES public.skills(id) ON DELETE CASCADE,
    skill_level skill_level_enum DEFAULT 'intermediate',
    years_experience NUMERIC(3, 1) DEFAULT 1.0,
    is_primary BOOLEAN DEFAULT FALSE,
    verification_status verification_status_enum DEFAULT 'VERIFIED',
    tasks TEXT[],
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(worker_id, skill_id)
);

-- 4. WORKER DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS public.worker_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id UUID REFERENCES public.worker_profiles(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL, -- e.g. 'AADHAAR', 'POLICE_VERIFICATION', 'TRADE_LICENSE'
    storage_path TEXT NOT NULL,
    mime_type TEXT DEFAULT 'application/pdf',
    file_size INT,
    verification_status document_status_enum DEFAULT 'PENDING',
    uploaded_at TIMESTAMPTZ DEFAULT now(),
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

-- 5. WORKER CERTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.worker_certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id UUID REFERENCES public.worker_profiles(id) ON DELETE CASCADE,
    skill_id TEXT REFERENCES public.skills(id) ON DELETE SET NULL,
    certificate_name TEXT NOT NULL,
    issuing_organization TEXT NOT NULL,
    issue_date DATE,
    expiry_date DATE,
    certificate_id TEXT,
    document_path TEXT,
    verification_status verification_status_enum DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. WORKER AVAILABILITY TABLE
CREATE TABLE IF NOT EXISTS public.worker_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id UUID REFERENCES public.worker_profiles(id) ON DELETE CASCADE,
    day_of_week TEXT NOT NULL, -- e.g. 'Monday', 'Tuesday'
    start_time TIME WITHOUT TIME ZONE NOT NULL DEFAULT '08:00:00',
    end_time TIME WITHOUT TIME ZONE NOT NULL DEFAULT '18:00:00',
    available BOOLEAN DEFAULT TRUE,
    emergency_available BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. WORKER PREFERENCES TABLE
CREATE TABLE IF NOT EXISTS public.worker_preferences (
    worker_id UUID PRIMARY KEY REFERENCES public.worker_profiles(id) ON DELETE CASCADE,
    preferred_job_types TEXT[],
    preferred_areas TEXT[],
    maximum_travel_distance_km NUMERIC(4, 1) DEFAULT 10.0,
    preferred_language TEXT DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.services (
    id TEXT PRIMARY KEY, -- e.g. 'plumbing', 'electrical'
    category TEXT NOT NULL,
    service_name TEXT NOT NULL,
    name_ta TEXT,
    name_hi TEXT,
    icon TEXT,
    description TEXT,
    starting_price NUMERIC(10, 2) DEFAULT 299.00,
    unit TEXT DEFAULT 'per job',
    estimated_duration TEXT DEFAULT '45-60 mins',
    is_emergency_eligible BOOLEAN DEFAULT TRUE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 9. SERVICE TASKS TABLE
CREATE TABLE IF NOT EXISTS public.service_tasks (
    id TEXT PRIMARY KEY,
    service_id TEXT REFERENCES public.services(id) ON DELETE CASCADE,
    task_name TEXT NOT NULL,
    description TEXT,
    required_skill_id TEXT REFERENCES public.skills(id) ON DELETE SET NULL,
    minimum_experience NUMERIC(3, 1) DEFAULT 0.0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
