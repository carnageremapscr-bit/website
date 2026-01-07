// Shared Supabase Client - 2026 Security Update
// Single instance to avoid "Multiple GoTrueClient instances" warning
// SECURITY: Credentials should be loaded from config, not hardcoded

// Load config from a separate config file or meta tags (avoid hardcoding in production)
const SUPABASE_CONFIG = {
  // These will be overwritten by supabase-config.js if it exists
  url: window.SUPABASE_URL || 'https://iffsmbsxwhxehsigtqoe.supabase.co',
  anonKey: window.SUPABASE_ANON_KEY || ''
};

// Warn in development if using default keys
if (!window.SUPABASE_URL && process?.env?.NODE_ENV !== 'production') {
  console.warn('⚠️ Supabase credentials should be configured via environment variables for production');
}

let _supabase = null;
let _initPromise = null;

// Lazy initialization with promise support - create client on first use
function getSupabase() {
  if (_supabase) return _supabase;
  
  if (!SUPABASE_CONFIG.anonKey) {
    console.error('❌ Supabase anon key not configured. Set window.SUPABASE_ANON_KEY before loading this script.');
    return null;
  }
  
  if (window.supabase?.createClient) {
    _supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce' // More secure auth flow
      },
      global: {
        headers: {
          'X-Client-Info': 'carnage-remaps-portal/2.0.0'
        }
      }
    });
    console.log('✅ Shared Supabase client created');
    return _supabase;
  }
  
  console.error('❌ Supabase UMD bundle not loaded. Check if script tag is present in HTML.');
  return null;
}

// Async initialization with retry logic
async function initSupabase(retries = 3) {
  if (_supabase) return _supabase;
  
  if (_initPromise) return _initPromise;
  
  _initPromise = new Promise((resolve, reject) => {
    let attempts = 0;
    
    const tryInit = () => {
      attempts++;
      const client = getSupabase();
      
      if (client) {
        resolve(client);
      } else if (attempts < retries) {
        setTimeout(tryInit, 100 * attempts);
      } else {
        reject(new Error('Failed to initialize Supabase client after ' + retries + ' attempts'));
      }
    };
    
    tryInit();
  });
  
  return _initPromise;
}

// For backward compatibility, create a proxy object
const supabase = new Proxy({}, {
  get(target, prop) {
    const client = getSupabase();
    if (!client) {
      throw new Error('Supabase client not initialized. Make sure the UMD bundle is loaded and credentials are configured.');
    }
    return client[prop];
  }
});

// Also expose as global for non-module scripts
window.supabaseClient = supabase;

// Export for ES modules
export { supabase, SUPABASE_CONFIG, getSupabase, initSupabase };
