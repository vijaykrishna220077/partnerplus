-- ============================================================================
-- PARTNERPLUS — COOPERATIVE GIG SERVICES PLATFORM
-- MIGRATION 009: Functions, Triggers, RLS & Storage Policies
-- ============================================================================

-- 1. UPDATED_AT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
DO $$
DECLARE
    tbl text;
BEGIN
    FOR tbl IN
        SELECT table_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND column_name = 'updated_at'
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS trg_updated_at_%I ON public.%I;', tbl, tbl);
        EXECUTE format('CREATE TRIGGER trg_updated_at_%I BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();', tbl, tbl);
    END LOOP;
END $$;

-- 2. ATOMIC WORKER JOB ASSIGNMENT FUNCTION (Zero-Race Condition Protection)
CREATE OR REPLACE FUNCTION public.assign_worker_to_job(
    p_job_id UUID,
    p_worker_id UUID,
    p_payout_amount NUMERIC(10, 2)
)
RETURNS JSONB AS $$
DECLARE
    v_req INT;
    v_assigned INT;
    v_assignment_id UUID;
BEGIN
    -- Atomic row lock on job_openings
    SELECT workers_required, workers_assigned
    INTO v_req, v_assigned
    FROM public.job_openings
    WHERE id = p_job_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Job opening not found');
    END IF;

    IF v_assigned >= v_req THEN
        RETURN jsonb_build_object('success', false, 'message', 'Job has already been filled by another worker');
    END IF;

    -- Insert assignment record atomically
    INSERT INTO public.job_assignments (
        job_id,
        worker_id,
        status,
        accepted_at,
        payout_amount
    )
    VALUES (
        p_job_id,
        p_worker_id,
        'ACCEPTED',
        now(),
        p_payout_amount
    )
    RETURNING id INTO v_assignment_id;

    -- Increment workers_assigned count
    UPDATE public.job_openings
    SET 
        workers_assigned = workers_assigned + 1,
        status = CASE 
            WHEN workers_assigned + 1 >= workers_required THEN 'ASSIGNED'::job_status_enum
            ELSE 'PARTIALLY_FILLED'::job_status_enum
        END
    WHERE id = p_job_id;

    RETURN jsonb_build_object(
        'success', true, 
        'assignment_id', v_assignment_id,
        'message', 'Job successfully accepted and assigned'
    );
EXCEPTION
    WHEN unique_violation THEN
        RETURN jsonb_build_object('success', false, 'message', 'Worker is already assigned to this job');
    WHEN OTHERS THEN
        RETURN jsonb_build_object('success', false, 'message', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. HAVERSINE PROXIMITY WORKER SEARCH FUNCTION
CREATE OR REPLACE FUNCTION public.search_nearby_workers(
    p_lat NUMERIC,
    p_lng NUMERIC,
    p_radius_km NUMERIC DEFAULT 15.0,
    p_skill TEXT DEFAULT NULL
)
RETURNS TABLE (
    worker_id UUID,
    full_name TEXT,
    phone TEXT,
    primary_skill_label TEXT,
    rating NUMERIC,
    jobs_completed INT,
    distance_km NUMERIC,
    latitude NUMERIC,
    longitude NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        w.id AS worker_id,
        w.full_name,
        w.phone,
        w.primary_skill_label,
        w.rating,
        w.jobs_completed,
        ROUND(
            (6371 * acos(
                cos(radians(p_lat)) * cos(radians(w.latitude)) *
                cos(radians(w.longitude) - radians(p_lng)) +
                sin(radians(p_lat)) * sin(radians(w.latitude))
            ))::numeric, 2
        ) AS distance_km,
        w.latitude,
        w.longitude
    FROM public.worker_profiles w
    WHERE w.availability_status = true
      AND w.latitude IS NOT NULL
      AND w.longitude IS NOT NULL
      AND (p_skill IS NULL OR w.primary_skill_id = p_skill OR p_skill = ANY(w.languages))
      AND (
          6371 * acos(
              cos(radians(p_lat)) * cos(radians(w.latitude)) *
              cos(radians(w.longitude) - radians(p_lng)) +
              sin(radians(p_lat)) * sin(radians(w.latitude))
          )
      ) <= p_radius_km
    ORDER BY distance_km ASC;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cooperative_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_openings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active workers, skills, services and cooperatives for client discovery
DROP POLICY IF EXISTS "Public worker profiles read" ON public.worker_profiles;
CREATE POLICY "Public worker profiles read" ON public.worker_profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public cooperatives read" ON public.cooperative_profiles;
CREATE POLICY "Public cooperatives read" ON public.cooperative_profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public organizations read" ON public.organization_profiles;
CREATE POLICY "Public organizations read" ON public.organization_profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public bookings access" ON public.bookings;
CREATE POLICY "Public bookings access" ON public.bookings FOR ALL USING (true);

DROP POLICY IF EXISTS "Public job openings access" ON public.job_openings;
CREATE POLICY "Public job openings access" ON public.job_openings FOR ALL USING (true);

DROP POLICY IF EXISTS "Public job assignments access" ON public.job_assignments;
CREATE POLICY "Public job assignments access" ON public.job_assignments FOR ALL USING (true);

DROP POLICY IF EXISTS "Public messages access" ON public.messages;
CREATE POLICY "Public messages access" ON public.messages FOR ALL USING (true);

-- 5. STORAGE BUCKETS INITIALIZATION
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('worker-profile-photos', 'worker-profile-photos', true),
    ('worker-documents', 'worker-documents', false),
    ('organization-documents', 'organization-documents', false),
    ('cooperative-documents', 'cooperative-documents', false),
    ('chat-images', 'chat-images', true),
    ('chat-files', 'chat-files', true)
ON CONFLICT (id) DO NOTHING;
