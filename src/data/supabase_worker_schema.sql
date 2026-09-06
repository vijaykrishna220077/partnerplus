-- ============================================================================
-- SAHAKARI SEVA — COOPERATIVE GIG SERVICES PLATFORM
-- PostgreSQL / Supabase Database Schema Architecture
-- Production DDL for Skill-Based Worker Matching, Cooperatives, & Fair Dispatch
-- ============================================================================

-- 1. COOPERATIVES
CREATE TABLE IF NOT EXISTS cooperatives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(100) UNIQUE NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    established_year INT NOT NULL,
    president_name VARCHAR(150),
    contact_phone VARCHAR(20) NOT NULL,
    email VARCHAR(150),
    address TEXT,
    welfare_balance NUMERIC(12, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SKILL CATEGORIES & SKILLS (Admin Configurable)
CREATE TYPE worker_tier_enum AS ENUM ('skilled', 'semi_skilled', 'general');

CREATE TABLE IF NOT EXISTS skills (
    id VARCHAR(50) PRIMARY KEY, -- e.g. 'skill-electrician', 'skill-plumber'
    category worker_tier_enum NOT NULL,
    skill_name VARCHAR(150) NOT NULL,
    description TEXT,
    verification_required BOOLEAN DEFAULT TRUE,
    active BOOLEAN DEFAULT TRUE,
    trade_icon VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SPECIFIC SKILL TASKS
CREATE TABLE IF NOT EXISTS skill_tasks (
    id VARCHAR(50) PRIMARY KEY, -- e.g. 'task-elec-fan'
    skill_id VARCHAR(50) REFERENCES skills(id) ON DELETE CASCADE,
    task_name VARCHAR(200) NOT NULL,
    description TEXT,
    min_experience_years NUMERIC(3, 1) DEFAULT 0.0,
    default_estimated_minutes INT DEFAULT 45,
    tools_required TEXT,
    is_regulated_trade BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. WORKERS (Core Profile)
CREATE TYPE verification_status_enum AS ENUM ('submitted', 'under_review', 'verified', 'rejected');

CREATE TABLE IF NOT EXISTS workers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cooperative_id UUID REFERENCES cooperatives(id),
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    worker_type worker_tier_enum NOT NULL, -- 'skilled' | 'semi_skilled' | 'general'
    primary_skill_id VARCHAR(50) REFERENCES skills(id),
    primary_skill_label VARCHAR(150) NOT NULL,
    experience_years NUMERIC(3, 1) DEFAULT 0.0,
    verification_status verification_status_enum DEFAULT 'submitted',
    availability_status BOOLEAN DEFAULT TRUE,
    emergency_available BOOLEAN DEFAULT FALSE,
    rating NUMERIC(3, 2) DEFAULT 5.00,
    completed_jobs INT DEFAULT 0,
    current_location VARCHAR(150),
    service_radius_km NUMERIC(4, 1) DEFAULT 10.0,
    coop_member_id VARCHAR(50) UNIQUE,
    opportunities_received_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. WORKER SKILLS (Structured Multi-Skill Association)
CREATE TYPE skill_level_enum AS ENUM ('beginner', 'intermediate', 'expert');

CREATE TABLE IF NOT EXISTS worker_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id UUID REFERENCES workers(id) ON DELETE CASCADE,
    skill_id VARCHAR(50) REFERENCES skills(id),
    skill_level skill_level_enum DEFAULT 'intermediate',
    years_experience NUMERIC(3, 1) DEFAULT 1.0,
    is_primary BOOLEAN DEFAULT FALSE,
    verified BOOLEAN DEFAULT FALSE,
    tasks TEXT[], -- Array of specific tasks worker is qualified for
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(worker_id, skill_id)
);

-- 6. WORKER CERTIFICATIONS
CREATE TABLE IF NOT EXISTS worker_certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id UUID REFERENCES workers(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    issued_by VARCHAR(200) NOT NULL, -- e.g. NSDC, State Licensing Board
    year INT NOT NULL,
    certificate_id VARCHAR(100),
    document_url TEXT,
    verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. WORKER AVAILABILITY & SHIFTS
CREATE TABLE IF NOT EXISTS worker_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id UUID REFERENCES workers(id) ON DELETE CASCADE,
    day_of_week VARCHAR(20) NOT NULL, -- Monday, Tuesday, ...
    shift_slot VARCHAR(50) NOT NULL, -- Morning, Afternoon, Evening
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. WORKER PREFERENCES
CREATE TABLE IF NOT EXISTS worker_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id UUID REFERENCES workers(id) ON DELETE CASCADE UNIQUE,
    preferred_job_types TEXT[],
    preferred_areas TEXT[],
    max_travel_distance_km NUMERIC(4, 1) DEFAULT 10.0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. JOB OPENINGS
CREATE TYPE job_urgency_enum AS ENUM ('normal', 'urgent', 'emergency');
CREATE TYPE job_status_enum AS ENUM ('open', 'matching', 'offered', 'assigned', 'in_progress', 'completed', 'cancelled', 'expired');

CREATE TABLE IF NOT EXISTS job_openings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID,
    service_category VARCHAR(100) NOT NULL,
    service_name VARCHAR(150) NOT NULL,
    specific_task VARCHAR(200) NOT NULL,
    worker_type_required worker_tier_enum NOT NULL,
    required_skill_id VARCHAR(50) REFERENCES skills(id),
    required_skill_level VARCHAR(50) DEFAULT 'any',
    minimum_experience_years NUMERIC(3, 1) DEFAULT 0.0,
    scheduled_date VARCHAR(50) NOT NULL,
    start_time VARCHAR(50) NOT NULL,
    estimated_duration VARCHAR(50) NOT NULL,
    location_area VARCHAR(150) NOT NULL,
    approximate_distance_km NUMERIC(4, 1) DEFAULT 2.0,
    emergency_or_normal job_urgency_enum DEFAULT 'normal',
    customer_price NUMERIC(10, 2) NOT NULL,
    worker_expected_earning NUMERIC(10, 2) NOT NULL,
    cooperative_contribution NUMERIC(10, 2) DEFAULT 0.00,
    tools_required TEXT,
    materials_provided TEXT,
    workers_required INT DEFAULT 1,
    workers_assigned INT DEFAULT 0,
    description TEXT,
    customer_address TEXT,
    status job_status_enum DEFAULT 'open',
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. JOB ASSIGNMENTS (Multi-Worker atomic slot reservation)
CREATE TYPE assignment_status_enum AS ENUM ('assigned', 'on_the_way', 'arrived', 'in_progress', 'completed', 'cancelled');

CREATE TABLE IF NOT EXISTS job_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES job_openings(id) ON DELETE CASCADE,
    worker_id UUID REFERENCES workers(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    status assignment_status_enum DEFAULT 'assigned',
    payout_amount NUMERIC(10, 2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'pending',
    UNIQUE(job_id, worker_id)
);

-- 11. WORKER EARNINGS & WELFARE
CREATE TABLE IF NOT EXISTS worker_earnings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id UUID REFERENCES workers(id) ON DELETE CASCADE,
    assignment_id UUID REFERENCES job_assignments(id),
    task_title VARCHAR(200) NOT NULL,
    service_category VARCHAR(100) NOT NULL,
    customer_paid NUMERIC(10, 2) NOT NULL,
    worker_earned NUMERIC(10, 2) NOT NULL,
    welfare_deducted NUMERIC(10, 2) NOT NULL,
    payment_mode VARCHAR(50) DEFAULT 'Cash on Delivery',
    status VARCHAR(50) DEFAULT 'paid',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. WELFARE RECORDS (PMSBY Insurance & Pension fund)
CREATE TABLE IF NOT EXISTS welfare_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id UUID REFERENCES workers(id) ON DELETE CASCADE,
    scheme_type VARCHAR(100) DEFAULT 'PMSBY Accident Insurance',
    policy_number VARCHAR(100),
    coverage_amount NUMERIC(12, 2) DEFAULT 200000.00,
    contribution_total NUMERIC(10, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR HIGH PERFORMANCE REAL-TIME MATCHING
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_workers_type_avail ON workers(worker_type, availability_status);
CREATE INDEX IF NOT EXISTS idx_workers_primary_skill ON workers(primary_skill_id);
CREATE INDEX IF NOT EXISTS idx_worker_skills_lookup ON worker_skills(skill_id, verified);
CREATE INDEX IF NOT EXISTS idx_jobs_status_urgency ON job_openings(status, emergency_or_normal);
CREATE INDEX IF NOT EXISTS idx_assignments_worker ON job_assignments(worker_id, status);
