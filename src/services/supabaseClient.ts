/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://uxruugkbrtzqaexsyrfn.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4cnV1Z2ticnR6cWFleHN5cmZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkwMDU2MzEsImV4cCI6MjAzNDU4MTYzMX0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
