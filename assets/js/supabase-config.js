// Supabase Configuration - 2026 Security Update
// Carnage Remaps Portal
// 
// IMPORTANT: In production, these values should come from environment variables
// or be injected at build time. Never commit real credentials to version control.
//
// For deployment, set these in your hosting provider's environment variables:
// - SUPABASE_URL
// - SUPABASE_ANON_KEY

// Global configuration - can be overridden before this script loads
window.SUPABASE_URL = window.SUPABASE_URL || 'https://iffsmbsxwhxehsigtqoe.supabase.co';
window.SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmZnNtYnN4d2h4ZWhzaWd0cW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNDU1OTcsImV4cCI6MjA3NzgyMTU5N30.l77PNiP6VBtOeF6ZHe8uKzOo7K9dOxd83cxUziQysNk';

let supabase = null;

// Use UMD global (loaded via script tag in HTML) with enhanced options
if (window.supabase?.createClient) {
  supabase = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: window.localStorage, // Secure storage
      storageKey: 'carnage-remaps-auth', // Unique key to avoid conflicts
      flowType: 'pkce' // Proof Key for Code Exchange - more secure
    },
    global: {
      headers: {
        'X-Client-Info': 'carnage-remaps-portal/2.0.0'
      }
    },
    db: {
      schema: 'public'
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  });
  console.log('✅ Supabase client initialized with enhanced security');
} else {
  console.error('❌ Supabase UMD bundle not loaded. Check if script tag is present in HTML.');
}

export { supabase };
