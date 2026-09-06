-- ============================================================================
-- PARTNERPLUS — COOPERATIVE GIG SERVICES PLATFORM
-- MIGRATION 006: Real-Time Location Tracking & Chat Conversations
-- ============================================================================

-- 1. WORKER LOCATIONS TABLE
CREATE TABLE IF NOT EXISTS public.worker_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id UUID REFERENCES public.worker_profiles(id) ON DELETE CASCADE,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    accuracy NUMERIC(8, 2) DEFAULT 5.0,
    heading NUMERIC(5, 2),
    speed NUMERIC(5, 2),
    status TEXT DEFAULT 'ONLINE_AVAILABLE', -- 'OFFLINE' | 'ONLINE_AVAILABLE' | 'EN_ROUTE_JOB' | 'ARRIVED_WORKING' | 'EMERGENCY_DISPATCH'
    tracking_mode TEXT DEFAULT 'DISCOVERY', -- 'OFFLINE' | 'DISCOVERY' | 'ACTIVE_JOB' | 'EMERGENCY'
    timestamp TIMESTAMPTZ DEFAULT now()
);

-- 2. CUSTOMER LOCATIONS TABLE
CREATE TABLE IF NOT EXISTS public.customer_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customer_profiles(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    accuracy NUMERIC(8, 2) DEFAULT 5.0,
    sharing_status TEXT DEFAULT 'LIVE_SHARING', -- 'OFF' | 'LIVE_SHARING' | 'SERVICE_PIN_ONLY'
    timestamp TIMESTAMPTZ DEFAULT now()
);

-- 3. JOB LOCATIONS TABLE
CREATE TABLE IF NOT EXISTS public.job_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES public.job_openings(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    accuracy NUMERIC(8, 2) DEFAULT 5.0,
    address_text TEXT NOT NULL,
    area_name TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Chennai',
    postal_code TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. PROJECT LOCATIONS TABLE
CREATE TABLE IF NOT EXISTS public.project_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.organization_projects(id) ON DELETE CASCADE,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    address_text TEXT NOT NULL,
    city TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. LOCATION SHARING PERMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.location_sharing_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    has_permission BOOLEAN DEFAULT TRUE,
    permission_status TEXT DEFAULT 'granted',
    is_tracking_enabled BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. CONVERSATIONS TABLE
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    job_id UUID REFERENCES public.job_openings(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    archived_at TIMESTAMPTZ
);

-- 7. CONVERSATION PARTICIPANTS TABLE
CREATE TABLE IF NOT EXISTS public.conversation_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL, -- 'customer' | 'worker' | 'cooperative'
    last_read_at TIMESTAMPTZ DEFAULT now(),
    joined_at TIMESTAMPTZ DEFAULT now(),
    status TEXT DEFAULT 'ACTIVE',
    UNIQUE(conversation_id, user_id)
);

-- 8. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    sender_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    sender_name TEXT NOT NULL,
    sender_role TEXT NOT NULL, -- 'customer' | 'worker' | 'cooperative'
    message_type TEXT DEFAULT 'text', -- 'text' | 'image' | 'audio' | 'location' | 'system'
    content TEXT NOT NULL,
    attachment_path TEXT,
    attachment_type TEXT,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    location_accuracy NUMERIC(8, 2),
    quick_reply_type TEXT,
    is_audio_transcription BOOLEAN DEFAULT FALSE,
    is_voice_note BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'SENT',
    created_at TIMESTAMPTZ DEFAULT now(),
    delivered_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    is_read BOOLEAN DEFAULT FALSE
);
