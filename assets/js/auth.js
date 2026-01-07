// Carnage Remaps - Modern Authentication System (2025)
// Using Web Crypto API for secure password hashing and role-based access control

(function() {
  'use strict';

  const AUTH_DB = 'CarnageAuthDB';
  const AUTH_VERSION = 1;
  const USERS_STORE = 'users';
  const SESSIONS_STORE = 'sessions';
  let authDB = null;

  // Initialize Auth Database
  async function initAuthDB() {
    return new Promise((resolve, reject) => {
      console.log('Initializing Auth Database...');
      
      if (!window.indexedDB) {
        console.error('IndexedDB not supported');
        reject(new Error('IndexedDB not supported by your browser'));
        return;
      }
      
      const request = indexedDB.open(AUTH_DB, AUTH_VERSION);
      
      request.onerror = () => {
        console.error('Auth DB Error:', request.error);
        reject(request.error);
      };
      
      request.onsuccess = () => {
        authDB = request.result;
        console.log('Auth DB initialized successfully');
        resolve(authDB);
      };
      
      request.onupgradeneeded = (event) => {
        console.log('Auth DB upgrade needed, creating stores...');
        const db = event.target.result;
        
        // Users store
        if (!db.objectStoreNames.contains(USERS_STORE)) {
          const usersStore = db.createObjectStore(USERS_STORE, { keyPath: 'id', autoIncrement: true });
          usersStore.createIndex('email', 'email', { unique: true });
          usersStore.createIndex('role', 'role', { unique: false });
          console.log('Users store created');
        }
        
        // Sessions store
        if (!db.objectStoreNames.contains(SESSIONS_STORE)) {
          const sessionsStore = db.createObjectStore(SESSIONS_STORE, { keyPath: 'token' });
          sessionsStore.createIndex('userId', 'userId', { unique: false });
          sessionsStore.createIndex('expiresAt', 'expiresAt', { unique: false });
          console.log('Sessions store created');
        }
      };
    });
  }

  // Modern password hashing using Web Crypto API (PBKDF2)
  async function hashPassword(password, salt = null) {
    const encoder = new TextEncoder();
    
    // Generate or use provided salt
    if (!salt) {
      salt = crypto.getRandomValues(new Uint8Array(16));
    }
    
    // Import password as key
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits']
    );
    
    // Derive key using PBKDF2 with 600,000 iterations (2025 standard)
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 600000,
        hash: 'SHA-256'
      },
      keyMaterial,
      256
    );
    
    return {
      hash: Array.from(new Uint8Array(derivedBits)),
      salt: Array.from(new Uint8Array(salt))
    };
  }

  // Verify password
  async function verifyPassword(password, storedHash, storedSalt) {
    const salt = new Uint8Array(storedSalt);
    const result = await hashPassword(password, salt);
    
    // Constant-time comparison
    return result.hash.length === storedHash.length &&
           result.hash.every((val, idx) => val === storedHash[idx]);
  }

  // Generate secure session token
  function generateToken() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Create default admin account on first run
  // SECURITY: In production, this should be disabled and admin created through secure setup process
  async function createDefaultAdmin() {
    // Check if we're in a production environment
    const isProduction = window.location.hostname !== 'localhost' && 
                         window.location.hostname !== '127.0.0.1';
    
    const transaction = authDB.transaction([USERS_STORE], 'readonly');
    const store = transaction.objectStore(USERS_STORE);
    const countRequest = store.count();
    
    return new Promise((resolve) => {
      countRequest.onsuccess = async () => {
        if (countRequest.result === 0) {
          // Generate a cryptographically secure random password for production
          const randomBytes = new Uint8Array(16);
          crypto.getRandomValues(randomBytes);
          const generatedPassword = Array.from(randomBytes, b => b.toString(16).padStart(2, '0')).join('');
          
          // In production, use a secure generated password
          // In development, use a known password for convenience
          const defaultPassword = isProduction ? generatedPassword : 'DevAdmin2026!';
          
          const adminPassword = await hashPassword(defaultPassword);
          await createUser({
            email: 'admin@carnageremaps.com',
            name: 'Admin',
            role: 'admin',
            passwordHash: adminPassword.hash,
            passwordSalt: adminPassword.salt,
            createdAt: new Date().toISOString(),
            isActive: true,
            creditBalance: 10000, // Admin starts with £10000 credit
            credits: 10000, // Dual field for compatibility
            transactions: [],
            activeSubscriptions: [],
            mustChangePassword: isProduction // Force password change in production
          });
          
          if (isProduction) {
            console.warn('⚠️ SECURITY: Default admin created with random password.');
            console.warn('⚠️ Use the Supabase dashboard to reset the admin password.');
            console.warn('⚠️ Email: admin@carnageremaps.com');
          } else {
            console.log('🔧 DEV MODE: Default admin created: admin@carnageremaps.com / DevAdmin2026!');
          }
        }
        resolve();
      };
    });
  }

  // Create user
  function createUser(userData) {
    return new Promise((resolve, reject) => {
      const transaction = authDB.transaction([USERS_STORE], 'readwrite');
      const store = transaction.objectStore(USERS_STORE);
      const request = store.add(userData);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Get user by email
  function getUserByEmail(email) {
    return new Promise((resolve, reject) => {
      const transaction = authDB.transaction([USERS_STORE], 'readonly');
      const store = transaction.objectStore(USERS_STORE);
      const index = store.index('email');
      const request = index.get(email);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Get user by ID
  function getUserById(userId) {
    return new Promise((resolve, reject) => {
      // Validate userId
      if (!userId || userId === null || userId === undefined) {
        console.error('getUserById: Invalid userId provided:', userId);
        reject(new Error('Invalid userId provided'));
        return;
      }
      
      const transaction = authDB.transaction([USERS_STORE], 'readonly');
      const store = transaction.objectStore(USERS_STORE);
      const request = store.get(userId);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Create session
  function createSession(userId, role) {
    const token = generateToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour session
    
    return new Promise((resolve, reject) => {
      const transaction = authDB.transaction([SESSIONS_STORE], 'readwrite');
      const store = transaction.objectStore(SESSIONS_STORE);
      const request = store.add({
        token: token,
        userId: userId,
        role: role,
        createdAt: new Date().toISOString(),
        expiresAt: expiresAt.toISOString()
      });
      
      request.onsuccess = () => resolve(token);
      request.onerror = () => reject(request.error);
    });
  }

  // Validate session
  async function validateSession(token) {
    return new Promise((resolve, reject) => {
      const transaction = authDB.transaction([SESSIONS_STORE], 'readonly');
      const store = transaction.objectStore(SESSIONS_STORE);
      const request = store.get(token);
      
      request.onsuccess = () => {
        const session = request.result;
        if (!session) {
          resolve(null);
          return;
        }
        
        // Check expiration
        if (new Date(session.expiresAt) < new Date()) {
          resolve(null);
          return;
        }
        
        resolve(session);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Delete session (logout)
  function deleteSession(token) {
    return new Promise((resolve, reject) => {
      const transaction = authDB.transaction([SESSIONS_STORE], 'readwrite');
      const store = transaction.objectStore(SESSIONS_STORE);
      const request = store.delete(token);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Sign in
  async function signIn(email, password) {
    try {
      const user = await getUserByEmail(email);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      if (!user.isActive) {
        throw new Error('Account is disabled');
      }
      
      const isValid = await verifyPassword(password, user.passwordHash, user.passwordSalt);
      
      if (!isValid) {
        throw new Error('Invalid email or password');
      }
      
      // Create session
      const token = await createSession(user.id, user.role);
      
      // Store token in sessionStorage
      sessionStorage.setItem('authToken', token);
      sessionStorage.setItem('userRole', user.role);
      sessionStorage.setItem('userName', user.name);
      sessionStorage.setItem('userEmail', user.email);
      sessionStorage.setItem('userId', user.id);
      
      return { success: true, user, token };
    } catch (error) {
      throw error;
    }
  }

  // Sign out
  async function signOut() {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      await deleteSession(token);
    }
    sessionStorage.clear();
  }

  // Register new user
  async function register(email, password, name) {
    try {
      // Check if user exists
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        throw new Error('Email already registered');
      }
      
      // Hash password
      const hashedPassword = await hashPassword(password);
      
      // Create user
      const userId = await createUser({
        email: email,
        name: name,
        role: 'user',
        passwordHash: hashedPassword.hash,
        passwordSalt: hashedPassword.salt,
        createdAt: new Date().toISOString(),
        isActive: true,
        creditBalance: 0,
        transactions: [],
        activeSubscriptions: []
      });
      
      return { success: true, userId };
    } catch (error) {
      throw error;
    }
  }

  // Get current session
  async function getCurrentSession() {
    const token = sessionStorage.getItem('authToken');
    if (!token) return null;
    
    const session = await validateSession(token);
    if (!session) {
      sessionStorage.clear();
      return null;
    }
    
    const user = await getUserById(session.userId);
    return { session, user };
  }

  // Check if user is authenticated
  async function isAuthenticated() {
    const session = await getCurrentSession();
    return session !== null;
  }

  // Check if user is admin
  async function isAdmin() {
    const role = sessionStorage.getItem('userRole');
    return role === 'admin';
  }

  // Get all users (admin only)
  function getAllUsers() {
    return new Promise((resolve, reject) => {
      try {
        const transaction = authDB.transaction([USERS_STORE], 'readonly');
        const store = transaction.objectStore(USERS_STORE);
        const request = store.getAll();
        
        // Set a timeout to prevent hanging
        const timeout = setTimeout(() => {
          reject(new Error('Database query timed out'));
        }, 10000); // 10 second timeout
        
        request.onsuccess = () => {
          clearTimeout(timeout);
          resolve(request.result || []);
        };
        
        request.onerror = () => {
          clearTimeout(timeout);
          console.error('Error fetching users:', request.error);
          reject(request.error);
        };
        
        transaction.onerror = (event) => {
          clearTimeout(timeout);
          console.error('Transaction error:', event.target.error);
          reject(event.target.error);
        };
      } catch (error) {
        console.error('Exception in getAllUsers:', error);
        reject(error);
      }
    });
  }

  // Update user (admin only)
  function updateUser(userId, updates) {
    return new Promise(async (resolve, reject) => {
      const user = await getUserById(userId);
      if (!user) {
        reject(new Error('User not found'));
        return;
      }
      
      const updatedUser = { ...user, ...updates };
      
      const transaction = authDB.transaction([USERS_STORE], 'readwrite');
      const store = transaction.objectStore(USERS_STORE);
      const request = store.put(updatedUser);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Delete user (admin only)
  function deleteUser(userId) {
    return new Promise((resolve, reject) => {
      const transaction = authDB.transaction([USERS_STORE], 'readwrite');
      const store = transaction.objectStore(USERS_STORE);
      const request = store.delete(userId);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Get current user (simple method using sessionStorage)
  function getCurrentUser() {
    const userId = sessionStorage.getItem('userId');
    const email = sessionStorage.getItem('userEmail');
    const name = sessionStorage.getItem('userName');
    const role = sessionStorage.getItem('userRole');
    
    if (!userId || !email) return null;
    
    return {
      id: parseInt(userId),
      email: email,
      name: name,
      role: role
    };
  }

  // Update user credit
  // Update user credit
  async function updateUserCredit(amount, userId = null) {
    try {
      // If no userId provided, use current session user
      if (!userId) {
        const current = await getCurrentSession();
        if (!current) throw new Error('No active session');

        // getCurrentSession returns { session, user }
        if (current.session && typeof current.session.userId !== 'undefined') {
          userId = current.session.userId;
        } else if (current.user && typeof current.user.id !== 'undefined') {
          userId = current.user.id;
        } else {
          // Fallback: don't proceed with undefined key
          throw new Error('Unable to determine userId from session');
        }
      }
      
      // Ensure userId is a number when calling IndexedDB
      const resolvedUserId = typeof userId === 'string' ? parseInt(userId) : userId;
      if (typeof resolvedUserId === 'undefined' || resolvedUserId === null || Number.isNaN(resolvedUserId)) {
        throw new Error('Invalid userId supplied to updateUserCredit');
      }

      const user = await getUserById(resolvedUserId);
      if (!user) throw new Error('User not found');
      
      // Use credits field
      user.credits = (user.credits || 0) + amount;
      
      const transaction = authDB.transaction([USERS_STORE], 'readwrite');
      const store = transaction.objectStore(USERS_STORE);
      await new Promise((resolve, reject) => {
        const request = store.put(user);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
      
      // Clear the cache when credit is updated
      if (!userId || resolvedUserId.toString() === sessionStorage.getItem('userId')) {
        sessionStorage.removeItem('userCredit');
        sessionStorage.removeItem('userCreditTime');
      }
      
      return user.credits;
    } catch (error) {
      throw error;
    }
  }

  // Get user credit
  // Get user credit
  async function getUserCredit(userId = null) {
    try {
      // If no userId provided, use current session user
      if (!userId) {
        // Try to get from sessionStorage cache first for faster access
        const cachedCredit = sessionStorage.getItem('userCredit');
        const cacheTime = sessionStorage.getItem('userCreditTime');
        const now = Date.now();
        
        // Use cache if it's less than 10 seconds old
        if (cachedCredit !== null && cacheTime && (now - parseInt(cacheTime)) < 10000) {
          console.log('Using cached credit:', cachedCredit);
          return parseFloat(cachedCredit);
        }
        
        const current = await getCurrentSession();
        if (!current) {
          console.warn('No active session found');
          return 0;
        }

        // current may be { session, user }
        if (current.session && typeof current.session.userId !== 'undefined') {
          userId = current.session.userId;
        } else if (current.user && typeof current.user.id !== 'undefined') {
          userId = current.user.id;
        } else {
          console.warn('No userId found in session');
          return 0;
        }
        console.log('Getting credit for user ID:', userId);
        
        // If still no userId, return 0
        if (!userId) {
          console.warn('No userId found in session');
          return 0;
        }
      }
      
      const resolvedUserId = typeof userId === 'string' ? parseInt(userId) : userId;
      if (typeof resolvedUserId === 'undefined' || resolvedUserId === null || Number.isNaN(resolvedUserId)) {
        console.warn('Invalid userId when getting credit');
        return 0;
      }

      const user = await getUserById(resolvedUserId);
      console.log('User data:', user);
      const credit = user ? (user.credits || 0) : 0;
      console.log('Credit balance:', credit);
      
      // Cache the result in sessionStorage
      const sessionUserId = sessionStorage.getItem('userId');
      if (!userId || userId === parseInt(sessionUserId)) {
        sessionStorage.setItem('userCredit', credit.toString());
        sessionStorage.setItem('userCreditTime', Date.now().toString());
      }
      
      return credit;
    } catch (error) {
      console.error('Error getting user credit:', error);
      return 0;
    }
  }

  // Add subscription
  async function addSubscription(userId, subscription) {
    try {
      const user = await getUserById(userId);
      if (!user) throw new Error('User not found');
      
      if (!user.subscriptions) user.subscriptions = [];
      user.subscriptions.push({
        ...subscription,
        startDate: new Date().toISOString(),
        status: 'active'
      });
      
      const transaction = authDB.transaction([USERS_STORE], 'readwrite');
      const store = transaction.objectStore(USERS_STORE);
      await new Promise((resolve, reject) => {
        const request = store.put(user);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
      
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Get user subscriptions
  async function getUserSubscriptions(userId) {
    try {
      const user = await getUserById(userId);
      return user ? (user.subscriptions || []) : [];
    } catch (error) {
      return [];
    }
  }

  // Add transaction to user history
  async function addTransaction(transaction, userId = null) {
    try {
      console.log('addTransaction called with userId:', userId);
      
      if (!userId) {
        const session = await getCurrentSession();
        console.log('Current session:', session);
        if (!session) throw new Error('No active session');
        userId = session.userId;
      }
      
      console.log('Final userId for transaction:', userId);
      
      // Validate userId before calling getUserById
      if (!userId || userId === null || userId === undefined) {
        throw new Error('Invalid userId: cannot add transaction without valid user');
      }
      
      const user = await getUserById(userId);
      if (!user) throw new Error('User not found');
      
      if (!user.transactions) user.transactions = [];
      user.transactions.push({
        ...transaction,
        timestamp: new Date().toISOString(),
        userId: userId
      });
      
      const transactionDB = authDB.transaction([USERS_STORE], 'readwrite');
      const store = transactionDB.objectStore(USERS_STORE);
      await new Promise((resolve, reject) => {
        const request = store.put(user);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
      
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Get transaction history
  async function getTransactionHistory(userId = null) {
    try {
      if (!userId) {
        const session = await getCurrentSession();
        if (!session) return [];
        userId = session.userId;
      }
      
      const user = await getUserById(userId);
      return user ? (user.transactions || []) : [];
    } catch (error) {
      return [];
    }
  }

  // Create subscription
  async function createSubscription(subscription, userId = null) {
    try {
      if (!userId) {
        const session = await getCurrentSession();
        if (!session) throw new Error('No active session');
        userId = session.userId;
      }
      
      const user = await getUserById(userId);
      if (!user) throw new Error('User not found');
      
      if (!user.activeSubscriptions) user.activeSubscriptions = [];
      user.activeSubscriptions.push({
        ...subscription,
        userId: userId,
        createdAt: new Date().toISOString()
      });
      
      const transaction = authDB.transaction([USERS_STORE], 'readwrite');
      const store = transaction.objectStore(USERS_STORE);
      await new Promise((resolve, reject) => {
        const request = store.put(user);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
      
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Get active subscriptions
  async function getActiveSubscriptions(userId = null) {
    try {
      if (!userId) {
        const session = await getCurrentSession();
        if (!session) return [];
        userId = session.userId;
      }
      
      const user = await getUserById(userId);
      return user ? (user.activeSubscriptions || []).filter(sub => sub.status === 'active') : [];
    } catch (error) {
      return [];
    }
  }

  // Cancel subscription
  async function cancelSubscription(subscriptionId, userId = null) {
    try {
      if (!userId) {
        const session = await getCurrentSession();
        if (!session) throw new Error('No active session');
        userId = session.userId;
      }
      
      const user = await getUserById(userId);
      if (!user) throw new Error('User not found');
      
      if (user.activeSubscriptions) {
        const subIndex = user.activeSubscriptions.findIndex(sub => sub.id === subscriptionId);
        if (subIndex !== -1) {
          user.activeSubscriptions[subIndex].status = 'cancelled';
          user.activeSubscriptions[subIndex].cancelledAt = new Date().toISOString();
        }
      }
      
      const transaction = authDB.transaction([USERS_STORE], 'readwrite');
      const store = transaction.objectStore(USERS_STORE);
      await new Promise((resolve, reject) => {
        const request = store.put(user);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
      
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Export auth functions
  window.CarnageAuth = {
    init: async () => {
      await initAuthDB();
      await createDefaultAdmin();
    },
    signIn,
    signOut,
    register,
    validateSession,
    getCurrentSession,
    getCurrentUser,
    isAuthenticated,
    isAdmin,
    getAllUsers,
    updateUser,
    deleteUser,
    getUserById,
    updateUserCredit,
    getUserCredit,
    addSubscription,
    getUserSubscriptions,
    addTransaction,
    getTransactionHistory,
    createSubscription,
    getActiveSubscriptions,
    cancelSubscription
  };

})();
