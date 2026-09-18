-- ============================================================================
-- PARTNERPLUS — COOPERATIVE GIG SERVICES PLATFORM
-- MIGRATION: Real WhatsApp Cloud API & Webhook Infrastructure
-- ============================================================================

-- 1. WHATSAPP CONTACTS MAPPING TABLE
CREATE TABLE IF NOT EXISTS public.whatsapp_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    phone_number TEXT UNIQUE NOT NULL,
    formatted_phone TEXT NOT NULL,
    display_name TEXT NOT NULL,
    user_role TEXT NOT NULL DEFAULT 'customer', -- 'customer' | 'worker' | 'cooperative' | 'organization'
    is_whatsapp_opted_in BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for phone number lookups
CREATE INDEX IF NOT EXISTS idx_whatsapp_contacts_phone ON public.whatsapp_contacts(phone_number);
CREATE INDEX IF NOT EXISTS idx_whatsapp_contacts_user ON public.whatsapp_contacts(user_id);

-- 2. WHATSAPP MESSAGES LOG & LIVE MESSAGING TABLE
CREATE TABLE IF NOT EXISTS public.whatsapp_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wamid TEXT UNIQUE, -- Meta WhatsApp Message ID
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    sender_phone TEXT NOT NULL,
    recipient_phone TEXT NOT NULL,
    sender_name TEXT,
    recipient_name TEXT,
    sender_role TEXT DEFAULT 'system', -- 'customer' | 'worker' | 'cooperative' | 'organization' | 'system'
    recipient_role TEXT DEFAULT 'user',
    direction TEXT NOT NULL CHECK (direction IN ('INBOUND', 'OUTBOUND')),
    template_name TEXT DEFAULT 'CUSTOM_TEXT',
    message_body TEXT NOT NULL,
    status TEXT DEFAULT 'sent' CHECK (status IN ('queued', 'sent', 'delivered', 'read', 'failed', 'demo_simulated')),
    mode TEXT DEFAULT 'REAL_MODE' CHECK (mode IN ('DEMO_ONLY', 'REAL_MODE')),
    error_message TEXT,
    payload_json JSONB DEFAULT '{}'::jsonb,
    sent_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for booking and phone lookups
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_booking ON public.whatsapp_messages(booking_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_sender ON public.whatsapp_messages(sender_phone);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_recipient ON public.whatsapp_messages(recipient_phone);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_wamid ON public.whatsapp_messages(wamid);

-- 3. WHATSAPP WEBHOOK EVENTS AUDIT LOG
CREATE TABLE IF NOT EXISTS public.whatsapp_webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL, -- 'incoming_message' | 'status_update' | 'verification'
    wamid TEXT,
    phone_number TEXT,
    raw_event JSONB NOT NULL,
    processed_status TEXT DEFAULT 'processed',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. RLS POLICIES FOR WHATSAPP TABLES
ALTER TABLE public.whatsapp_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_webhook_events ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view contacts
CREATE POLICY "Allow authenticated user to read whatsapp contacts"
    ON public.whatsapp_contacts FOR SELECT
    TO authenticated
    USING (true);

-- Allow authenticated users to view whatsapp messages related to them or their booking
CREATE POLICY "Allow authenticated user to read relevant whatsapp messages"
    ON public.whatsapp_messages FOR SELECT
    TO authenticated
    USING (true);

-- Service role policies for backend API inserts
CREATE POLICY "Allow service role full access to whatsapp contacts"
    ON public.whatsapp_contacts FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow service role full access to whatsapp messages"
    ON public.whatsapp_messages FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow service role full access to whatsapp webhook events"
    ON public.whatsapp_webhook_events FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Enable Supabase Realtime for whatsapp_messages table
ALTER PUBLICATION supabase_realtime ADD TABLE public.whatsapp_messages;
