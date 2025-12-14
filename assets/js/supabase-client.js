// Shared Supabase Client
// Single instance to avoid "Multiple GoTrueClient instances" warning

const SUPABASE_URL = 'https://iffsmbsxwhxehsigtqoe.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmZnNtYnN4d2h4ZWhzaWd0cW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNDU1OTcsImV4cCI6MjA3NzgyMTU5N30.l77PNiP6VBtOeF6ZHe8uKzOo7K9dOxd83cxUziQysNk';

let _supabase = null;

// Lazy initialization - create client on first use
function getSupabase() {
  if (_supabase) return _supabase;
  
  if (window.supabase && window.supabase.createClient) {
    _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Shared Supabase client created');
    return _supabase;
  }
  
  console.error('❌ Supabase UMD bundle not loaded. Check if script tag is present in HTML.');
  return null;
}

// For backward compatibility, create a proxy object
const supabase = new Proxy({}, {
  get(target, prop) {
    const client = getSupabase();
    if (!client) {
      throw new Error('Supabase client not initialized. Make sure the UMD bundle is loaded.');
    }
    return client[prop];
  }
});

// Also expose as global for non-module scripts
window.supabaseClient = supabase;

export { supabase, SUPABASE_URL, SUPABASE_ANON_KEY, getSupabase };
