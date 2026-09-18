-- PostgreSQL Schema Migration for Real WhatsApp Transactional Notifications
-- Table: public.whatsapp_notifications

CREATE TABLE IF NOT EXISTS public.whatsapp_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    booking_id TEXT,
    recipient_phone TEXT NOT NULL,
    recipient_name TEXT DEFAULT 'User',
    recipient_role TEXT DEFAULT 'customer',
    notification_type TEXT NOT NULL,
    whatsapp_message_id TEXT UNIQUE,
    idempotency_key TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'read', 'failed', 'simulated')),
    error_message TEXT,
    payload_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    failed_at TIMESTAMPTZ
);

-- Indexes for ultra-fast lookup and idempotency checks
CREATE INDEX IF NOT EXISTS idx_wa_notif_idempotency ON public.whatsapp_notifications(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_wa_notif_booking_id ON public.whatsapp_notifications(booking_id);
CREATE INDEX IF NOT EXISTS idx_wa_notif_phone ON public.whatsapp_notifications(recipient_phone);
CREATE INDEX IF NOT EXISTS idx_wa_notif_wamid ON public.whatsapp_notifications(whatsapp_message_id);
CREATE INDEX IF NOT EXISTS idx_wa_notif_user_id ON public.whatsapp_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_wa_notif_status ON public.whatsapp_notifications(status);

-- Enable Row Level Security (RLS)
ALTER TABLE public.whatsapp_notifications ENABLE ROW LEVEL SECURITY;

-- Security Policy: Authenticated users can view their own notifications or matching phone
CREATE POLICY "Users can view their own whatsapp notifications"
    ON public.whatsapp_notifications
    FOR SELECT
    USING (
        auth.uid() = user_id 
        OR auth.uid() IN (
            SELECT id FROM public.profiles WHERE phone = recipient_phone
        )
        OR EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role IN ('cooperative_admin', 'admin')
        )
    );

-- Enable Supabase Realtime Publication for whatsapp_notifications
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.whatsapp_notifications;
  END IF;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;
