import { createClient } from '@supabase/supabase-js';

// We provide default placeholders that will trigger a connection error
// if the user doesn't set actual keys in the environment.
// This allows the app to compile, but will visually show an error state if unconfigured.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const isSupabaseConfigured = 
  import.meta.env.VITE_SUPABASE_URL !== undefined && import.meta.env.VITE_SUPABASE_URL !== '' &&
  import.meta.env.VITE_SUPABASE_ANON_KEY !== undefined && import.meta.env.VITE_SUPABASE_ANON_KEY !== '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
