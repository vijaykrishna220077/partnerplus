/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  const errMsg = '[SupabaseClient Error] VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in environment variables. Project cannot start without valid configuration.';
  console.error(errMsg);
  throw new Error(errMsg);
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
