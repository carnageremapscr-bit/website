// Supabase Configuration
// Carnage Remaps Portal

const SUPABASE_URL = 'https://iffsmbsxwhxehsigtqoe.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmZnNtYnN4d2h4ZWhzaWd0cW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNDU1OTcsImV4cCI6MjA3NzgyMTU5N30.l77PNiP6VBtOeF6ZHe8uKzOo7K9dOxd83cxUziQysNk';

let supabase = null;

// Use UMD global (loaded via script tag in HTML)
if (window.supabase && window.supabase.createClient) {
  supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  console.log('Supabase client initialized');
} else {
  console.error('Supabase UMD bundle not loaded. Check if script tag is present in HTML.');
}

export { supabase };
