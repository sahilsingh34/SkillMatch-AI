import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Verify configuration during runtime (avoid crashing during build)
if (!supabaseUrl && process.env.NODE_ENV === 'production') {
    console.warn("WARNING: NEXT_PUBLIC_SUPABASE_URL is missing. Supabase features will be disabled.");
}

// Used for client-side components (respects RLS)
export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder');

// Used ONLY in highly trusted backend API routes (bypasses RLS for secure uploads)
export const supabaseAdmin = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseServiceKey || 'placeholder');
