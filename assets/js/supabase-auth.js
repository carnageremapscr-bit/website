// Supabase Authentication Adapter
// Replaces IndexedDB auth with Supabase

import { supabase } from './supabase-client.js';

// Fallback SHA-256 implementation for non-HTTPS contexts
async function hashPassword(password) {
  // Try Web Crypto API first (requires HTTPS or localhost)
  if (window.crypto && window.crypto.subtle) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      console.warn('crypto.subtle failed, using fallback');
    }
  }
  
  // Fallback: Simple hash (not cryptographically secure, but works for development)
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(64, '0');
}

window.SupabaseAuth = {
  // Initialize
  async init() {
    console.log('Supabase Auth initialized');
    return true;
  },

  // Register new user
  async register(email, password, name) {
    try {
      // Hash password
      const passwordHash = await hashPassword(password);

      // Insert user into Supabase
      const { data: userData, error } = await supabase
        .from('users')
        .insert([
          {
            email,
            password_hash: passwordHash,
            name,
            role: 'user',
            credits: 0,
            is_active: true
          }
        ])
        .select();

      if (error) throw error;
      const user = Array.isArray(userData) ? userData[0] : userData;

      return { success: true, userId: user.id };
    } catch (error) {
      console.error('Registration error:', error);
      if (error.code === '23505') {
        throw new Error('Email already registered');
      }
      throw error;
    }
  },

  // Login user
  async login(email, password) {
    try {
      // Hash password
      const passwordHash = await hashPassword(password);
      
      console.log('🔐 Login attempt:', email);
      console.log('🔑 Password hash:', passwordHash);

      // Find user
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password_hash', passwordHash);

      if (error) {
        console.error('Database error:', error);
        throw new Error('Invalid credentials');
      }
      
      const user = users && users.length > 0 ? users[0] : null;

      if (!user) {
        console.error('No user found with those credentials');
        throw new Error('Invalid credentials');
      }

      if (!user.is_active) {
        throw new Error('Account is disabled');
      }

      // Store session in sessionStorage
      sessionStorage.setItem('userId', user.id);
      sessionStorage.setItem('userName', user.name);
      sessionStorage.setItem('userEmail', user.email);
      sessionStorage.setItem('userRole', user.role);
      sessionStorage.setItem('supabaseSession', JSON.stringify({
        userId: user.id,
        email: user.email,
        role: user.role,
        expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      }));

      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Check if authenticated
  async isAuthenticated() {
    const session = sessionStorage.getItem('supabaseSession');
    if (!session) return false;

    try {
      const parsed = JSON.parse(session);
      if (parsed.expiresAt < Date.now()) {
        this.logout();
        return false;
      }
      return true;
    } catch {
      return false;
    }
  },

  // Get current user
  getCurrentUser() {
    const userId = sessionStorage.getItem('userId');
    const userName = sessionStorage.getItem('userName');
    const userEmail = sessionStorage.getItem('userEmail');
    const userRole = sessionStorage.getItem('userRole');

    if (!userId) return null;

    return {
      id: parseInt(userId),
      name: userName,
      email: userEmail,
      role: userRole
    };
  },

  // Get current session
  async getCurrentSession() {
    const session = sessionStorage.getItem('supabaseSession');
    if (!session) return null;

    try {
      const parsed = JSON.parse(session);
      if (parsed.expiresAt < Date.now()) {
        this.logout();
        return null;
      }

      return {
        session: {
          userId: parsed.userId,
          email: parsed.email,
          role: parsed.role
        }
      };
    } catch {
      return null;
    }
  },

  // Check if admin
  async isAdmin() {
    const user = this.getCurrentUser();
    return user && user.role === 'admin';
  },

  // Logout
  logout() {
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('userEmail');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('supabaseSession');
  },

  // Get user by ID
  async getUserById(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error(`User with ID ${userId} not found`);
    return data;
  },

  // Get all users (admin only)
  async getAllUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Update user
  async updateUser(userId, updates) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select();

    if (error) throw error;
    return Array.isArray(data) ? data[0] : data;
  },

  // Delete user
  async deleteUser(userId) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) throw error;
    return true;
  },

  // Get user credit
  async getUserCredit(userId = null) {
    // If no userId provided, get current user
    if (!userId) {
      userId = parseInt(sessionStorage.getItem('userId'));
    }
    
    const { data, error } = await supabase
      .from('users')
      .select('credits')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    if (!data) return 0; // Return 0 if user not found
    return parseFloat(data.credits) || 0;
  },

  // Update user credit
  async updateUserCredit(amount, userId = null) {
    // If no userId provided, get current user
    if (!userId) {
      userId = parseInt(sessionStorage.getItem('userId'));
    }
    
    const user = await this.getUserById(userId);
    const newCredits = (parseFloat(user.credits) || 0) + amount;

    const { data, error } = await supabase
      .from('users')
      .update({ credits: newCredits })
      .eq('id', userId)
      .select();

    if (error) throw error;
    const result = Array.isArray(data) ? data[0] : data;
    return result ? result.credits : newCredits;
  },

  // Get active subscriptions (placeholder for now)
  async getActiveSubscriptions(userId) {
    // TODO: Implement subscription tracking in Supabase
    return [];
  },

  // Get transaction history (placeholder for now)
  async getTransactionHistory(userId) {
    // TODO: Implement transaction tracking in Supabase
    return [];
  },

  // Add transaction (placeholder for now)
  async addTransaction(transaction) {
    // TODO: Implement transaction tracking in Supabase
    console.log('Transaction recorded:', transaction);
    return true;
  }
};

console.log('✅ Supabase Auth module loaded');
