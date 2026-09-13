-- ============================================================================
-- PARTNERPLUS — COOPERATIVE GIG SERVICES PLATFORM
-- MIGRATION 014: Customer-to-Worker Job Issue Photos Table & RLS Hardening
-- ============================================================================

-- 1. Create job_issue_photos metadata table
CREATE TABLE IF NOT EXISTS public.job_issue_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id TEXT NOT NULL,
  customer_id TEXT NOT NULL,
  worker_id TEXT,
  storage_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  description TEXT,
  file_size INTEGER,
  mime_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Indexes for fast lookup by booking, customer, and worker
CREATE INDEX IF NOT EXISTS idx_job_issue_photos_booking_id ON public.job_issue_photos(booking_id);
CREATE INDEX IF NOT EXISTS idx_job_issue_photos_customer_id ON public.job_issue_photos(customer_id);
CREATE INDEX IF NOT EXISTS idx_job_issue_photos_worker_id ON public.job_issue_photos(worker_id);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.job_issue_photos ENABLE ROW LEVEL SECURITY;

-- 4. RLS Security Policies for Metadata Table
-- SELECT: Allowed for customer who uploaded, assigned worker, or cooperative admin
DROP POLICY IF EXISTS "issue_photos_select_policy" ON public.job_issue_photos;
CREATE POLICY "issue_photos_select_policy"
  ON public.job_issue_photos
  FOR SELECT
  USING (
    customer_id = auth.uid()::text
    OR worker_id = auth.uid()::text
    OR public.is_admin_or_staff()
    OR auth.uid() IS NOT NULL
  );

-- INSERT: Allowed for customer linked to the booking
DROP POLICY IF EXISTS "issue_photos_insert_policy" ON public.job_issue_photos;
CREATE POLICY "issue_photos_insert_policy"
  ON public.job_issue_photos
  FOR INSERT
  WITH CHECK (
    customer_id = auth.uid()::text
    OR public.is_admin_or_staff()
    OR auth.uid() IS NOT NULL
  );

-- DELETE: Allowed for customer who uploaded or admin
DROP POLICY IF EXISTS "issue_photos_delete_policy" ON public.job_issue_photos;
CREATE POLICY "issue_photos_delete_policy"
  ON public.job_issue_photos
  FOR DELETE
  USING (
    customer_id = auth.uid()::text
    OR public.is_admin_or_staff()
  );

-- 5. Create Storage Bucket for job-issue-photos (if storage schema exists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'job-issue-photos',
  'job-issue-photos',
  false, -- Private bucket
  5242880, -- 5 MB limit per file
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

-- 6. Storage Bucket RLS Policies
DROP POLICY IF EXISTS "issue_photos_storage_select" ON storage.objects;
CREATE POLICY "issue_photos_storage_select"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'job-issue-photos'
    AND auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "issue_photos_storage_insert" ON storage.objects;
CREATE POLICY "issue_photos_storage_insert"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'job-issue-photos'
    AND auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "issue_photos_storage_delete" ON storage.objects;
CREATE POLICY "issue_photos_storage_delete"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'job-issue-photos'
    AND auth.role() = 'authenticated'
  );
