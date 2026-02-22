require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client (use service role for webhook access)
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://iffsmbsxwhxehsigtqoe.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseConfigured = SUPABASE_URL && SUPABASE_SERVICE_KEY;
const supabase = supabaseConfigured ? createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY) : null;

console.log('=== Supabase Configuration ===');
console.log('SUPABASE_URL set:', !!SUPABASE_URL);
console.log('SUPABASE_SERVICE_ROLE_KEY set:', !!SUPABASE_SERVICE_KEY);
console.log('Supabase configured:', supabaseConfigured);
console.log('==============================');

// Check if Stripe key is configured
const STRIPE_KEY = (process.env.STRIPE_SECRET_KEY || '').trim();
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const stripeConfigured = STRIPE_KEY && STRIPE_KEY.startsWith('sk_');
const stripe = stripeConfigured ? require('stripe')(STRIPE_KEY) : null;

// Vehicle data lookup (CheckCarDetails)
const CHECKCAR_API_KEY = process.env.CHECKCAR_API_KEY || '';
const CHECKCAR_DATAPOINT = process.env.CHECKCAR_DATAPOINT || 'ukvehicledata';

// DVLA Open Data API
const DVLA_API_KEY = process.env.DVLA_API_KEY || '';
const DVLA_API_BASE_URL = process.env.DVLA_API_BASE_URL || 'https://driver-vehicle-licensing.api.gov.uk';
const DVLA_USERNAME = process.env.DVLA_USERNAME || '';
const DVLA_PASSWORD = process.env.DVLA_PASSWORD || '';

// JWT token cache for DVLA (valid for 1 hour)
let dvlaJwtToken = null;
let dvlaJwtExpiry = null;

// Log configuration status on startup
console.log('=== Stripe Configuration ===');
console.log('STRIPE_SECRET_KEY set:', !!STRIPE_KEY);
console.log('STRIPE_SECRET_KEY length:', STRIPE_KEY?.length || 0);
console.log('Key starts with sk_:', STRIPE_KEY?.startsWith('sk_') || false);
console.log('Key first 7 chars:', STRIPE_KEY?.substring(0, 7) || 'N/A');
console.log('STRIPE_WEBHOOK_SECRET set:', !!STRIPE_WEBHOOK_SECRET);
console.log('Stripe configured:', stripeConfigured);
if (!stripeConfigured && STRIPE_KEY) {
  console.log('⚠️ STRIPE_SECRET_KEY is set but does not start with sk_ - key prefix:', STRIPE_KEY?.substring(0, 3));
}
console.log('===========================');

console.log('=== VRM Lookup Configuration ===');
console.log('CHECKCAR_API_KEY set:', !!CHECKCAR_API_KEY);
console.log('CHECKCAR_DATAPOINT:', CHECKCAR_DATAPOINT);
console.log('DVLA_API_KEY set:', !!DVLA_API_KEY);
console.log('DVLA_API_BASE_URL:', DVLA_API_BASE_URL);
console.log('================================');

const app = express();
const PORT = process.env.PORT || 3002;

// Trust proxy - REQUIRED for Railway/Heroku/etc that use reverse proxies
// This fixes the X-Forwarded-For header issue with express-rate-limit
app.set('trust proxy', 1);

const path = require('path');
const fs = require('fs');
const CarnageVehicleDB = require('./assets/js/vehicle-database.js');

// Optional merged year/engine database enriched from CSV (used for iframe engine lists)
function safeLoadJson(relativePath) {
  try {
    const fullPath = path.join(__dirname, relativePath);
    if (fs.existsSync(fullPath)) {
      // require caches by full path automatically
      return require(fullPath);
    }
  } catch (err) {
    console.warn(`Optional JSON ${relativePath} not loaded:`, err.message);
  }
  return null;
}

const mergedYearEnginesFromCsv = safeLoadJson('vehicle-engine-db-merged-from-csv.json');
let cachedCsvEnginesByModel = null;

function getCsvEnginesByModel() {
  if (cachedCsvEnginesByModel) return cachedCsvEnginesByModel;

  const result = {};
  if (!mergedYearEnginesFromCsv || typeof mergedYearEnginesFromCsv !== 'object') {
    cachedCsvEnginesByModel = result;
    return result;
  }

  for (const [make, models] of Object.entries(mergedYearEnginesFromCsv)) {
    if (!models || typeof models !== 'object') continue;
    const modelMap = {};

    for (const [modelSlug, years] of Object.entries(models)) {
      if (!years || typeof years !== 'object') continue;
      const engineSet = new Set();

      for (const engines of Object.values(years)) {
        if (!Array.isArray(engines)) continue;
        for (const e of engines) {
          const label = String(e || '').trim();
          if (label) engineSet.add(label);
        }
      }

      if (engineSet.size > 0) {
        modelMap[modelSlug] = Array.from(engineSet);
      }
    }

    if (Object.keys(modelMap).length > 0) {
      result[make] = modelMap;
    }
  }

  cachedCsvEnginesByModel = result;
  return result;
}
// Multer for handling file uploads
const multer = require('multer');

// Ensure upload directory exists
const UPLOAD_DIR = path.join(__dirname, 'assets', 'media', 'uploads');
try { fs.mkdirSync(UPLOAD_DIR, { recursive: true }); } catch (e) { /* ignore */ }

// Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const safe = Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    cb(null, safe);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: function (req, file, cb) {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Only image uploads allowed'), false);
    cb(null, true);
  }
});

// Email notifications setup
// Supports: Resend API (recommended for Railway), or Nodemailer with Gmail
const nodemailer = require('nodemailer');
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'carnageremaps@gmail.com';
const EMAIL_USER = process.env.EMAIL_USER || 'carnageremaps@gmail.com';
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || '';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';

console.log('=== Email Configuration ===');
console.log('ADMIN_EMAIL:', ADMIN_EMAIL);
console.log('EMAIL_USER:', EMAIL_USER);
console.log('EMAIL_PASSWORD set:', !!EMAIL_PASSWORD);
console.log('RESEND_API_KEY set:', !!RESEND_API_KEY);

// Create nodemailer transporter (fallback)
const transporter = EMAIL_PASSWORD ? nodemailer.createTransport({
  service: 'gmail',
  auth: { user: EMAIL_USER, pass: EMAIL_PASSWORD },
  connectionTimeout: 10000,
  greetingTimeout: 5000,
  socketTimeout: 10000
}) : null;

console.log('Nodemailer transporter created:', !!transporter);
console.log('Using Resend API:', !!RESEND_API_KEY);
console.log('===========================');

// In-memory admin notification log (last 50 notifications)
// Save notifications to Supabase for persistence
async function addAdminNotification(notification) {
  const notif = {
    type: notification.type,
    icon: notification.icon,
    title: notification.title,
    message: notification.message,
    user_email: notification.user || null,
    badge: notification.badge || null
  };
  
  try {
    const { data, error } = await supabase
      .from('admin_notifications')
      .insert([notif])
      .select();
    
    if (error) {
      console.error('❌ Failed to save notification to Supabase:', error);
      return null;
    }
    
    console.log('📝 Admin notification saved:', notif.title);
    return data[0];
  } catch (err) {
    console.error('❌ Exception saving notification:', err);
    return null;
  }
}

// ============================================
// WHATSAPP CONFIGURATION (using CallMeBot free API)
// ============================================
// To set up WhatsApp notifications:
// 1. Save this number to your phone: +34 644 71 77 15
// 2. Send "I allow callmebot to send me messages" to that number on WhatsApp
// 3. You'll receive an API key - add it to your environment variables
// Alternative: Use Twilio WhatsApp API for production
const WHATSAPP_PHONE = process.env.WHATSAPP_PHONE || ''; // Your phone number with country code (e.g., +447123456789)
const WHATSAPP_API_KEY = process.env.WHATSAPP_API_KEY || ''; // CallMeBot API key
const TWILIO_SID = process.env.TWILIO_SID || '';
const TWILIO_AUTH = process.env.TWILIO_AUTH || '';
const TWILIO_WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM || ''; // e.g., whatsapp:+14155238886

console.log('=== WhatsApp Configuration ===');
console.log('WHATSAPP_PHONE set:', !!WHATSAPP_PHONE);
console.log('WHATSAPP_API_KEY set:', !!WHATSAPP_API_KEY);
console.log('TWILIO configured:', !!(TWILIO_SID && TWILIO_AUTH));
console.log('==============================');

// Helper to send WhatsApp notification
async function sendWhatsAppNotification(message) {
  // Try CallMeBot (free)
  if (WHATSAPP_PHONE && WHATSAPP_API_KEY) {
    try {
      const encodedMessage = encodeURIComponent(message);
      const url = `https://api.callmebot.com/whatsapp.php?phone=${WHATSAPP_PHONE}&text=${encodedMessage}&apikey=${WHATSAPP_API_KEY}`;
      
      const response = await fetch(url);
      if (response.ok) {
        console.log('📱 WhatsApp notification sent via CallMeBot');
        return true;
      }
    } catch (err) {
      console.warn('⚠️ CallMeBot WhatsApp failed:', err.message);
    }
  }
  
  // Try Twilio (paid but more reliable)
  if (TWILIO_SID && TWILIO_AUTH && TWILIO_WHATSAPP_FROM && WHATSAPP_PHONE) {
    try {
      const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`;
      const auth = Buffer.from(`${TWILIO_SID}:${TWILIO_AUTH}`).toString('base64');
      
      const response = await fetch(twilioUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          From: TWILIO_WHATSAPP_FROM,
          To: `whatsapp:${WHATSAPP_PHONE}`,
          Body: message
        })
      });
      
      if (response.ok) {
        console.log('📱 WhatsApp notification sent via Twilio');
        return true;
      }
    } catch (err) {
      console.warn('⚠️ Twilio WhatsApp failed:', err.message);
    }
  }
  
  console.log('📱 WhatsApp not configured - skipping notification');
  return false;
}

// ============================================
// UNIFIED ADMIN NOTIFICATION
// Sends both Email AND WhatsApp
// ============================================
async function notifyAdmin(type, subject, details) {
  console.log(`🔔 Admin notification: [${type}] ${subject}`);
  
  // Build message
  const timestamp = new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' });
  const whatsAppMessage = `🔔 ${type}\n\n${subject}\n\n${details}\n\n⏰ ${timestamp}`;
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #FFD700, #1a1a1a); padding: 20px; text-align: center;">
        <h1 style="color: #fff; margin: 0;">🔔 ${type}</h1>
      </div>
      <div style="padding: 20px; background: #f9f9f9;">
        <h2 style="color: #1a1a1a; margin-top: 0;">${subject}</h2>
        <div style="background: #fff; padding: 15px; border-radius: 8px; border-left: 4px solid #FFD700;">
          ${details.split('\n').map(line => `<p style="margin: 5px 0;">${line}</p>`).join('')}
        </div>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">⏰ ${timestamp}</p>
      </div>
      <div style="background: #1a1a1a; padding: 10px; text-align: center;">
        <p style="color: #FFD700; margin: 0; font-size: 12px;">Carnage Remaps Portal</p>
      </div>
    </div>
  `;
  
  // Send both notifications in parallel
  const results = await Promise.allSettled([
    sendAdminEmail(`[${type}] ${subject}`, details, emailHtml),
    sendWhatsAppNotification(whatsAppMessage)
  ]);
  
  const emailSent = results[0].status === 'fulfilled' && results[0].value;
  const whatsAppSent = results[1].status === 'fulfilled' && results[1].value;
  
  console.log(`📧 Email: ${emailSent ? '✅' : '❌'} | 📱 WhatsApp: ${whatsAppSent ? '✅' : '❌'}`);
  
  return { emailSent, whatsAppSent };
}

// Helper to send admin emails - tries Resend API first, then Nodemailer
async function sendAdminEmail(subject, text, html) {
  console.log('📧 sendAdminEmail called for:', subject);
  
  // Try Resend API first (works on Railway)
  if (RESEND_API_KEY) {
    try {
      console.log('📤 Attempting to send via Resend API to:', ADMIN_EMAIL);
      
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Carnage Remaps <onboarding@resend.dev>',
          to: [ADMIN_EMAIL],
          subject: subject,
          html: html || `<pre>${text}</pre>`,
          text: text
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log('✉️ Email sent via Resend:', data.id);
        return true;
      } else {
        console.error('❌ Resend API error:', data);
        // Fall through to nodemailer
      }
    } catch (err) {
      console.error('❌ Resend API failed:', err.message);
      // Fall through to nodemailer
    }
  }
  
  // Fallback to Nodemailer
  if (!transporter) { 
    console.warn('⚠️ Email not configured (no Resend API key and no nodemailer)');
    return false;
  }
  try {
    console.log('📤 Attempting to send via Nodemailer to:', ADMIN_EMAIL);
    console.log('   From:', EMAIL_USER);
    console.log('   Subject:', subject);
    
    // Create promise with timeout
    const sendPromise = transporter.sendMail({ 
      from: EMAIL_USER, 
      to: ADMIN_EMAIL, 
      subject, 
      text, 
      html: html || `<pre>${text}</pre>` 
    });
    
    // Set 10 second timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Email send timeout after 10 seconds')), 10000)
    );
    
    const result = await Promise.race([sendPromise, timeoutPromise]);
    console.log('✉️ Admin email sent successfully:', subject);
    console.log('   Result:', result);
    return true;
  } catch (err) { 
    console.error('❌ Email send failed:', err.message);
    console.error('   Full error:', {
      name: err.name,
      code: err.code,
      command: err.command,
      responseCode: err.responseCode,
      response: err.response
    });
    return false;
  }
}

// ============================================
// WEBHOOK TEST ENDPOINT - Check if webhook is configured
// ============================================
app.get('/api/webhook-status', (req, res) => {
  const webhookSecret = (process.env.STRIPE_WEBHOOK_SECRET || '').trim();
  const isConfigured = webhookSecret && webhookSecret.startsWith('whsec_');
  
  res.json({
    webhookConfigured: isConfigured,
    webhookSecretSet: !!webhookSecret,
    webhookSecretLength: webhookSecret.length,
    webhookSecretPrefix: webhookSecret.substring(0, 6) || 'N/A',
    stripeConfigured: stripeConfigured,
    timestamp: new Date().toISOString()
  });
});

// ============================================
// NOTIFICATION STATUS ENDPOINT - Check notification config
// ============================================
app.get('/api/notification-status', (req, res) => {
  const emailConfigured = !!RESEND_API_KEY || !!transporter;
  const whatsappConfigured = !!(WHATSAPP_PHONE && WHATSAPP_API_KEY) || !!(TWILIO_SID && TWILIO_AUTH);
  
  res.json({
    email: {
      configured: emailConfigured,
      method: RESEND_API_KEY ? 'Resend API' : (transporter ? 'Gmail SMTP' : 'Not configured'),
      admin: ADMIN_EMAIL || 'Not set',
      resendConfigured: !!RESEND_API_KEY,
      nodemailerConfigured: !!transporter
    },
    whatsapp: {
      configured: whatsappConfigured,
      callmebot: !!(WHATSAPP_PHONE && WHATSAPP_API_KEY),
      twilio: !!(TWILIO_SID && TWILIO_AUTH),
      phoneSet: !!WHATSAPP_PHONE
    },
    timestamp: new Date().toISOString()
  });
});

// ============================================
// SEND TEST NOTIFICATION - Admin test
// ============================================
app.post('/api/test-notification', express.json(), async (req, res) => {
  console.log('\n🔔 TEST NOTIFICATION ENDPOINT CALLED');
  
  try {
    const result = await notifyAdmin(
      '🧪 TEST',
      'Test Notification from Admin Panel',
      `This is a test notification.\nSent at: ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}\nIf you received this, notifications are working!`
    );
    
    console.log('Test notification result:', result);
    
    res.json({
      success: result.emailSent || result.whatsAppSent,
      emailSent: result.emailSent,
      whatsAppSent: result.whatsAppSent,
      timestamp: new Date().toISOString(),
      message: result.emailSent ? '✅ Email sent successfully!' : 
               result.whatsAppSent ? '✅ WhatsApp sent successfully!' :
               '❌ Both email and WhatsApp failed'
    });
  } catch (error) {
    console.error('Test notification error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// ============================================
// TEST NOTIFICATION ENDPOINT - Create sample notification
// ============================================
app.post('/api/admin/test-notification', express.json(), async (req, res) => {
  try {
    const notification = await addAdminNotification({
      type: 'user',
      icon: '🧪',
      title: 'Test Notification',
      message: 'This is a test notification to verify the system is working',
      user: 'admin@test.com',
      badge: 'new'
    });
    
    res.json({
      success: true,
      notification: notification,
      message: 'Test notification created successfully'
    });
  } catch (error) {
    console.error('Test notification error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// PAYMENT VERIFICATION ENDPOINT - Fallback tracking
// Call this after successful payment redirect to ensure tracking
// ============================================
app.post('/api/verify-and-track-payment', async (req, res) => {
  try {
    if (!stripeConfigured) {
      return res.status(500).json({ error: 'Stripe not configured' });
    }
    
    const { sessionId } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID required' });
    }
    
    console.log('🔍 Verifying payment session:', sessionId);
    
    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'payment_intent']
    });
    
    console.log('📋 Session status:', session.payment_status);
    console.log('📋 Session mode:', session.mode);
    
    if (session.payment_status !== 'paid') {
      return res.json({ 
        success: false, 
        status: session.payment_status,
        message: 'Payment not completed'
      });
    }
    
    const email = session.customer_email || session.customer_details?.email;
    const userId = session.metadata?.userId;
    
    // Handle based on payment type
    if (session.mode === 'subscription') {
      // Subscription payment
      console.log('✅ Subscription payment verified for:', email);
      
      if (supabase) {
        const subscriptionId = session.subscription?.id || session.subscription;
        let subscription = session.subscription;
        
        // If subscription is just an ID, retrieve full details
        if (typeof subscription === 'string') {
          subscription = await stripe.subscriptions.retrieve(subscription);
        }
        
        const { error } = await supabase
          .from('subscriptions')
          .upsert({
            user_id: userId || null,
            email: email,
            stripe_customer_id: session.customer,
            stripe_subscription_id: subscriptionId,
            type: session.metadata?.plan || 'embed',
            status: 'active',
            price_amount: session.amount_total,
            currency: session.currency,
            current_period_start: subscription?.current_period_start 
              ? new Date(subscription.current_period_start * 1000).toISOString()
              : new Date().toISOString(),
            current_period_end: subscription?.current_period_end
              ? new Date(subscription.current_period_end * 1000).toISOString()
              : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'stripe_subscription_id'
          });
        
        if (error) {
          console.error('Failed to save subscription:', error);
        } else {
          console.log('✅ Subscription tracked in database for:', email);
          
          // Send admin notification
          const emailHtml = `<h2>✅ New Subscription (Verified)</h2>
            <p><strong>User:</strong> ${email}</p>
            <p><strong>Type:</strong> ${session.metadata?.plan || 'embed'}</p>
            <p><strong>Amount:</strong> £${(session.amount_total / 100).toFixed(2)}</p>
            <p><strong>Session ID:</strong> ${sessionId}</p>
            <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>`;
          sendAdminEmail(`✅ Subscription Verified: ${email}`, `Subscription verified for ${email}`, emailHtml);
        }
      }
      
      return res.json({
        success: true,
        type: 'subscription',
        email: email,
        amount: session.amount_total / 100,
        message: 'Subscription activated successfully'
      });
      
    } else if (session.mode === 'payment') {
      // One-time payment (top-up)
      const amount = parseFloat(session.metadata?.amount) || (session.amount_total / 100);
      console.log('✅ Top-up payment verified:', amount, 'for:', email);
      
      if (supabase && userId) {
        // Get current credits
        const { data: userData, error: fetchError } = await supabase
          .from('users')
          .select('credits')
          .eq('id', userId)
          .single();
        
        if (!fetchError) {
          const currentCredits = userData?.credits || 0;
          const newCredits = currentCredits + amount;
          
          // Update credits
          const { error: updateError } = await supabase
            .from('users')
            .update({ credits: newCredits })
            .eq('id', userId);
          
          if (!updateError) {
            console.log('✅ Credits updated:', currentCredits, '→', newCredits);
            
            // Record transaction
            await supabase.from('transactions').insert({
              user_id: userId,
              email: email,
              type: 'topup',
              amount: amount,
              status: 'completed',
              stripe_session_id: sessionId,
              description: 'Wallet top-up via Stripe (verified)',
              created_at: new Date().toISOString()
            });
            
            // Send admin notification
            const emailHtml = `<h2>💳 Wallet Top-Up (Verified)</h2>
              <p><strong>User:</strong> ${email}</p>
              <p><strong>Amount:</strong> £${amount}</p>
              <p><strong>New Balance:</strong> £${newCredits}</p>
              <p><strong>Session ID:</strong> ${sessionId}</p>`;
            sendAdminEmail(`💳 Top-Up Verified: £${amount} from ${email}`, `Top-up verified`, emailHtml);
            
            return res.json({
              success: true,
              type: 'topup',
              email: email,
              amount: amount,
              newBalance: newCredits,
              message: 'Credits added successfully'
            });
          }
        }
      }
      
      return res.json({
        success: true,
        type: 'topup',
        email: email,
        amount: amount,
        message: 'Payment verified (manual credit update may be needed)'
      });
    }
    
    res.json({ success: true, message: 'Payment verified' });
    
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: error.message || 'Verification failed' });
  }
});

// IMPORTANT: Webhook route MUST be defined BEFORE any body-parsing middleware
// Stripe webhook endpoint (for handling payment events)
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  // CRITICAL: Aggressively clean webhook secret of ALL whitespace
  let webhookSecret = (process.env.STRIPE_WEBHOOK_SECRET || '').trim();
  // Remove any control characters, tabs, newlines, carriage returns, etc.
  webhookSecret = webhookSecret.replace(/[\r\n\t\v\f]/g, '');
  // Remove any leading/trailing spaces again
  webhookSecret = webhookSecret.trim();

  console.log('🔔 Webhook call received');
  console.log('📍 Event type header:', req.headers['stripe-signature'] ? 'Present' : 'Missing');
  console.log('📍 Webhook secret configured:', !!webhookSecret);
  console.log('📍 Webhook secret length:', webhookSecret.length);
  console.log('📍 Webhook secret starts with:', webhookSecret.substring(0, 6));

  if (!webhookSecret) {
    console.error('❌ STRIPE_WEBHOOK_SECRET not configured in environment variables');
    return res.status(400).send('Webhook Error: Missing webhook secret configuration');
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    console.error('   This usually means:');
    console.error('   1. Webhook secret is incorrect');
    console.error('   2. Webhook secret has extra whitespace (spaces/newlines)');
    console.error('   3. Raw body was modified before verification');
    console.error('   4. Signature header is missing or corrupted');
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('✅ Webhook signature verified');
  console.log('✅ Webhook received:', event.type);

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Checkout session completed:', session.id);
      
      // Handle wallet top-up payments
      if (session.mode === 'payment' && session.metadata?.type === 'topup' && supabase) {
        try {
          const email = session.customer_email || session.customer_details?.email;
          const userId = session.metadata?.userId;
          const amount = parseFloat(session.metadata?.amount) || (session.amount_total / 100);
          
          if (userId && amount > 0) {
            // Get current user credits
            const { data: userData, error: fetchError } = await supabase
              .from('users')
              .select('credits')
              .eq('id', userId)
              .single();
            
            if (fetchError) {
              console.error('Error fetching user credits:', fetchError);
            } else {
              const currentCredits = userData?.credits || 0;
              const newCredits = currentCredits + amount;
              
              // Update user credits
              const { error: updateError } = await supabase
                .from('users')
                .update({ credits: newCredits })
                .eq('id', userId);
              
              if (updateError) {
                console.error('Failed to update credits:', updateError);
              } else {
                console.log(`✅ Wallet topped up: £${amount} for user ${userId} (${email}). New balance: £${newCredits}`);
                
                // Add admin notification
                addAdminNotification({
                  type: 'payment',
                  icon: '💳',
                  title: 'Wallet Top-Up',
                  message: `${email} topped up £${amount} - New balance: £${newCredits}`,
                  user: email,
                  badge: 'completed'
                });
                
                // Send admin email notification
                const emailHtml = `<h2>💳 Wallet Top-Up Received</h2><p><strong>User:</strong> ${email}</p><p><strong>Amount:</strong> £${amount}</p><p><strong>New Balance:</strong> £${newCredits}</p><p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>`;
                sendAdminEmail(`💳 Wallet Top-Up: £${amount} from ${email}`, `Wallet topped up by £${amount} for ${email}. New balance: £${newCredits}`, emailHtml);
                
                // Save transaction record
                await supabase
                  .from('transactions')
                  .insert({
                    user_id: userId,
                    email: email,
                    type: 'topup',
                    amount: amount,
                    status: 'completed',
                    stripe_session_id: session.id,
                    description: `Wallet top-up via Stripe`,
                    created_at: new Date().toISOString()
                  });
              }
            }
          }
        } catch (err) {
          console.error('Error processing wallet top-up:', err);
        }
      }
      
      // Handle subscription checkouts
      if (session.mode === 'subscription' && supabase) {
        try {
          const email = session.customer_email || session.customer_details?.email;
          const userId = session.metadata?.userId;
          const subscriptionId = session.subscription;
          const customerId = session.customer;
          
          // Get subscription details from Stripe
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          
          // Upsert subscription in Supabase
          const { error } = await supabase
            .from('subscriptions')
            .upsert({
              user_id: userId || null,
              email: email,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              type: session.metadata?.type || 'embed',
              status: 'active',
              price_amount: session.amount_total,
              currency: session.currency,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'stripe_subscription_id'
            });
          
          if (error) {
            console.error('Failed to save subscription:', error);
            console.error('Subscription data that failed:', { userId, email, subscriptionId, customerId });
          } else {
            console.log('✅ Subscription saved for:', email);
            console.log('   - User ID:', userId);
            console.log('   - Subscription ID:', subscriptionId);
            console.log('   - Customer ID:', customerId);
            console.log('   - Type:', session.metadata?.type || 'embed');
            console.log('   - Amount:', session.amount_total / 100);
            
            // Add admin notification
            addAdminNotification({
              type: 'subscription',
              icon: '✅',
              title: 'New Subscription',
              message: `${email} subscribed via Stripe - £${(session.amount_total / 100).toFixed(2)}/month`,
              user: email,
              badge: 'active'
            });
            
            // Send admin email notification
            const adminEmailHtml = `
              <h2 style="color:#16a34a">✅ New Subscription Activated</h2>
              <div style="background:#f3f4f6;padding:20px;border-radius:8px;margin:20px 0">
                <p><strong>Customer Email:</strong> ${email}</p>
                <p><strong>User ID:</strong> ${userId || 'Not provided'}</p>
                <p><strong>Subscription Type:</strong> ${session.metadata?.type || 'embed'}</p>
                <p><strong>Amount:</strong> £${(session.amount_total / 100).toFixed(2)}/month</p>
                <p><strong>Stripe Customer ID:</strong> ${customerId}</p>
                <p><strong>Stripe Subscription ID:</strong> ${subscriptionId}</p>
                <p><strong>Period End:</strong> ${new Date(subscription.current_period_end * 1000).toLocaleDateString()}</p>
                <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
              </div>
              <p style="color:#6b7280;font-size:14px">This subscription was activated via Stripe webhook.</p>
            `;
            sendAdminEmail(`✅ New Subscription: ${email}`, `New subscription from ${email} - £${(session.amount_total / 100).toFixed(2)}/month`, adminEmailHtml);
            
            // Send customer confirmation email
            if (resendConfigured && email) {
              try {
                const customerEmailHtml = `
                  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#1a1a1a;color:#fff;padding:40px;border-radius:12px">
                    <div style="text-align:center;margin-bottom:30px">
                      <h1 style="color:#eab308;margin:0">🎉 Subscription Activated!</h1>
                      <p style="color:#9ca3af;margin-top:10px">Thank you for subscribing to Carnage Remaps</p>
                    </div>
                    
                    <div style="background:#262626;padding:20px;border-radius:8px;margin:20px 0">
                      <h3 style="color:#eab308;margin-top:0">Subscription Details</h3>
                      <p><strong>Plan:</strong> Embed Widget Access</p>
                      <p><strong>Amount:</strong> £${(session.amount_total / 100).toFixed(2)}/month</p>
                      <p><strong>Next billing date:</strong> ${new Date(subscription.current_period_end * 1000).toLocaleDateString()}</p>
                    </div>
                    
                    <div style="background:#262626;padding:20px;border-radius:8px;margin:20px 0">
                      <h3 style="color:#eab308;margin-top:0">What's included</h3>
                      <ul style="color:#d1d5db;padding-left:20px">
                        <li>Embed vehicle lookup widget on your website</li>
                        <li>Customizable colors and branding</li>
                        <li>Real-time vehicle data lookup</li>
                        <li>Automatic monthly renewal</li>
                        <li>Cancel anytime from your dashboard</li>
                      </ul>
                    </div>
                    
                    <div style="text-align:center;margin-top:30px">
                      <a href="https://web-production-df12d.up.railway.app" 
                         style="display:inline-block;background:#eab308;color:#000;text-decoration:none;padding:15px 30px;border-radius:8px;font-weight:bold">
                        Go to Dashboard
                      </a>
                    </div>
                    
                    <p style="color:#6b7280;font-size:12px;text-align:center;margin-top:30px">
                      If you have any questions, reply to this email or contact support.
                    </p>
                  </div>
                `;
                
                await resend.emails.send({
                  from: 'Carnage Remaps <onboarding@resend.dev>',
                  to: email,
                  subject: '🎉 Your subscription is now active - Carnage Remaps',
                  html: customerEmailHtml
                });
                console.log('✅ Customer confirmation email sent to:', email);
              } catch (emailErr) {
                console.error('Failed to send customer email:', emailErr.message);
              }
            }
          }
        } catch (err) {
          console.error('Error processing checkout:', err);
        }
      }
      break;
    
    case 'invoice.paid':
      // Handle successful subscription renewal
      console.log('Subscription payment received');
      if (supabase) {
        try {
          const invoice = event.data.object;
          const subscriptionId = invoice.subscription;
          
          if (subscriptionId) {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            
            const { error } = await supabase
              .from('subscriptions')
              .update({
                status: 'active',
                current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
                current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
                updated_at: new Date().toISOString()
              })
              .eq('stripe_subscription_id', subscriptionId);
            
            if (error) {
              console.error('Failed to update subscription:', error);
            } else {
              console.log('✅ Subscription renewed:', subscriptionId);
            }
          }
        } catch (err) {
          console.error('Error processing invoice.paid:', err);
        }
      }
      break;
    
    case 'invoice.payment_failed':
      // Handle failed subscription payment
      console.log('Subscription payment failed');
      if (supabase) {
        try {
          const invoice = event.data.object;
          const subscriptionId = invoice.subscription;
          
          if (subscriptionId) {
            const { error } = await supabase
              .from('subscriptions')
              .update({
                status: 'past_due',
                updated_at: new Date().toISOString()
              })
              .eq('stripe_subscription_id', subscriptionId);
            
            if (error) {
              console.error('Failed to update subscription status:', error);
            } else {
              console.log('⚠️ Subscription marked past_due:', subscriptionId);
            }
          }
        } catch (err) {
          console.error('Error processing payment_failed:', err);
        }
      }
      break;
    
    case 'customer.subscription.deleted':
      // Handle subscription cancellation
      console.log('Subscription cancelled');
      if (supabase) {
        try {
          const subscription = event.data.object;
          const subscriptionId = subscription.id;
          
          const { error } = await supabase
            .from('subscriptions')
            .update({
              status: 'cancelled',
              updated_at: new Date().toISOString()
            })
            .eq('stripe_subscription_id', subscriptionId);
          
          if (error) {
            console.error('Failed to cancel subscription:', error);
          } else {
            console.log('❌ Subscription cancelled:', subscriptionId);
          }
        } catch (err) {
          console.error('Error processing subscription deletion:', err);
        }
      }
      break;
    
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// Middleware (AFTER webhook route)
// Security: Rate limiting to prevent brute force attacks
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit auth attempts to 10 per 15 minutes
  message: { error: 'Too many authentication attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting
app.use('/api/', generalLimiter);
app.use('/api/auth', authLimiter);

// CORS configuration - allow Railway production domain
const allowedOrigins = [
  'http://localhost:3000', 
  'http://localhost:3002', 
  'http://127.0.0.1:3000',
  'https://web-production-df12d.up.railway.app'
];

// Add any additional origins from environment
if (process.env.ALLOWED_ORIGINS) {
  process.env.ALLOWED_ORIGINS.split(',').forEach(origin => {
    const trimmed = origin.trim();
    if (trimmed && !allowedOrigins.includes(trimmed)) {
      allowedOrigins.push(trimmed);
    }
  });
}

console.log('Allowed CORS origins:', allowedOrigins);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (same-origin requests, mobile apps, curl)
    if (!origin) {
      return callback(null, true);
    }
    // Allow if origin is in the list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // Allow Railway subdomains
    if (origin.endsWith('.up.railway.app')) {
      return callback(null, true);
    }
    // In development, allow all
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    // Reject others
    console.warn('CORS blocked origin:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'stripe-signature']
}));

app.use(express.json({ limit: '10mb' }));

// Compression for better performance
app.use(compression());

// Security headers with Helmet (EXCLUDING embed.html which needs to be embeddable)
app.use((req, res, next) => {
  // Skip helmet entirely for embed.html - it will be handled by its dedicated route
  if (req.path === '/embed.html') {
    return next();
  }
  
  // Apply helmet for all other routes
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.jsdelivr.net", "https://js.stripe.com", "https://www.googletagmanager.com"],
        scriptSrcAttr: ["'unsafe-inline'"], // Allow inline onclick handlers
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        connectSrc: ["'self'", "https://*.supabase.co", "https://api.stripe.com", "wss://*.supabase.co", "https://cdn.jsdelivr.net", "https://*.google-analytics.com", "https://www.googletagmanager.com", "https://analytics.google.com"],
        frameSrc: ["https://js.stripe.com", "https://hooks.stripe.com"],
        frameAncestors: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })(req, res, next);
});

// Special route for embed.html to ensure it's embeddable
app.get('/embed.html', (req, res) => {
  // Remove X-Frame-Options entirely to avoid conflicts
  res.removeHeader('X-Frame-Options');
  // Allow embedding from any origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Don't set frame-ancestors at all - this allows embedding from anywhere
  res.setHeader('Content-Security-Policy', "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval'; style-src * 'unsafe-inline';");
  res.sendFile(path.join(__dirname, 'embed.html'));
});

// Special route for test-vrm.html to ensure it's embeddable
app.get('/test-vrm.html', (req, res) => {
  // Remove X-Frame-Options entirely to avoid conflicts
  res.removeHeader('X-Frame-Options');
  // Allow embedding from any origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Don't set frame-ancestors at all - this allows embedding from anywhere
  res.setHeader('Content-Security-Policy', "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval'; style-src * 'unsafe-inline'; connect-src *;");
  res.sendFile(path.join(__dirname, 'test-vrm.html'));
});

// Explicit routes for Supabase JS modules (bypass potential static middleware issues)
const supabaseJsFiles = ['supabase-client.js', 'supabase-auth.js', 'supabase-files.js', 'supabase-support.js', 'supabase-compat.js', 'supabase-config.js'];
supabaseJsFiles.forEach(filename => {
  app.get(`/assets/js/${filename}`, (req, res) => {
    const filePath = path.join(__dirname, 'assets', 'js', filename);
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.sendFile(filePath);
  });
});

app.use(express.static(__dirname, {
  setHeaders: (res, filePath) => {
    try {
      const ext = path.extname(filePath).toLowerCase();
      if (ext === '.html') {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      } else if (ext === '.js') {
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache');
      } else if (ext === '.css') {
        res.setHeader('Content-Type', 'text/css; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache');
      } else if (ext === '.avif') {
        res.setHeader('Content-Type', 'image/avif');
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
    } catch (e) {
      console.error('Error setting headers for:', filePath, e);
    }
  }
})); // Serve static files from project directory

// SERVICE STATUS ENDPOINT - Check if a service is enabled/disabled
app.get('/api/service-status/:serviceName', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: 'Database not configured' });
    }
    
    const serviceName = decodeURIComponent(req.params.serviceName).toLowerCase();
    console.log('🔍 Checking service status:', serviceName);
    
    const { data, error } = await supabase
      .from('service_status')
      .select('*')
      .eq('service_name', serviceName)
      .single();
    
    if (error) {
      // Service not found - assume enabled by default
      if (error.code === 'PGRST116') {
        return res.json({ 
          success: true,
          service: serviceName,
          is_enabled: true,
          disabled_reason: null
        });
      }
      console.error('Error checking service status:', error);
      return res.status(500).json({ error: error.message });
    }
    
    res.json({ 
      success: true, 
      service: serviceName,
      is_enabled: data?.is_enabled || false,
      disabled_reason: data?.disabled_reason || null,
      disabled_by: data?.disabled_by || null,
      disabled_at: data?.disabled_at || null
    });
  } catch (err) {
    console.error('Error checking service status:', err);
    res.status(500).json({ error: err.message });
  }
});

// ADMIN: UPDATE SERVICE STATUS
app.post('/api/admin/service-status/:serviceName', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: 'Database not configured' });
    }
    
    const serviceName = decodeURIComponent(req.params.serviceName).toLowerCase();
    const { is_enabled, disabled_reason } = req.body;
    
    console.log(`🔧 Updating service status: ${serviceName} => ${is_enabled}`);
    
    // Update service status
    const { data, error } = await supabase
      .from('service_status')
      .upsert({
        service_name: serviceName,
        is_enabled: is_enabled === true,
        disabled_reason: is_enabled ? null : (disabled_reason || 'Disabled by admin'),
        disabled_by: req.body.adminEmail || 'admin',
        disabled_at: is_enabled ? null : new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, { onConflict: 'service_name' })
      .select()
      .single();
    
    if (error) {
      console.error('Error updating service status:', error);
      return res.status(500).json({ error: error.message });
    }
    
    res.json({ 
      success: true, 
      service: serviceName,
      is_enabled: data.is_enabled,
      message: is_enabled ? `${serviceName} service enabled` : `${serviceName} service disabled`
    });
  } catch (err) {
    console.error('Error updating service status:', err);
    res.status(500).json({ error: err.message });
  }
});

// Legacy VRM status endpoint (admin UI)
app.get('/api/vrm-status', async (req, res) => {
  try {
    if (!supabase) {
      return res.json({ enabled: true });
    }

    const { data, error } = await supabase
      .from('service_status')
      .select('is_enabled')
      .eq('service_name', 'vrm_lookup')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.json({ enabled: true });
      }
      throw error;
    }

    res.json({ enabled: data?.is_enabled !== false });
  } catch (err) {
    console.error('Error loading VRM status:', err);
    res.status(500).json({ error: err.message });
  }
});

// Legacy admin toggle VRM status (admin UI)
app.post('/api/admin/vrm-status', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    const { enabled } = req.body;
    const isEnabled = enabled === true;

    const { data, error } = await supabase
      .from('service_status')
      .upsert({
        service_name: 'vrm_lookup',
        is_enabled: isEnabled,
        disabled_reason: isEnabled ? null : 'Disabled by admin',
        disabled_by: req.body.adminEmail || 'admin',
        disabled_at: isEnabled ? null : new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, { onConflict: 'service_name' })
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, enabled: data?.is_enabled !== false });
  } catch (err) {
    console.error('Error toggling VRM status:', err);
    res.status(500).json({ error: err.message });
  }
});

// Health check endpoint - SECURE: No sensitive data exposed
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Carnage Remaps API Server Running',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    services: {
      email: RESEND_API_KEY ? 'Resend API configured' : (transporter ? 'SMTP configured' : 'not configured'),
      stripe: stripeConfigured ? 'configured' : 'not configured',
      database: supabaseConfigured ? 'configured' : 'not configured'
    }
  });
});

// Get admin notifications endpoint
app.get('/api/admin/notifications', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('admin_notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (error) {
      console.error('Failed to fetch notifications:', error);
      return res.status(500).json({ error: 'Failed to fetch notifications' });
    }
    
    // Transform to match frontend format
    const notifications = data.map(n => ({
      id: n.id,
      type: n.type,
      icon: n.icon,
      title: n.title,
      message: n.message,
      user: n.user_email,
      badge: n.badge,
      timestamp: n.created_at
    }));
    
    res.json({ 
      success: true, 
      notifications: notifications,
      count: notifications.length
    });
  } catch (err) {
    console.error('Exception fetching notifications:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Debug file paths endpoint
app.get('/api/debug-files', (req, res) => {
  const jsPath = path.join(__dirname, 'assets', 'js');
  let files = [];
  try {
    files = fs.readdirSync(jsPath);
  } catch (e) {
    files = ['ERROR: ' + e.message];
  }
  res.json({
    __dirname,
    jsPath,
    jsFilesExist: files,
    cwd: process.cwd()
  });
});

// Direct file test endpoint
app.get('/api/test-js/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'assets', 'js', req.params.filename);
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      res.send(content);
    } else {
      res.status(404).json({ error: 'File not found', path: filePath });
    }
  } catch (e) {
    res.status(500).json({ error: e.message, path: filePath });
  }
});

// Debug endpoint - only available in development mode
if (process.env.NODE_ENV !== 'production') {
  app.get('/api/debug-config', (req, res) => {
    res.json({ 
      email: {
        configured: !!transporter,
        userSet: !!process.env.EMAIL_USER,
        passwordSet: !!process.env.EMAIL_PASSWORD,
      },
      stripe: {
        configured: stripeConfigured,
        keySet: !!process.env.STRIPE_SECRET_KEY,
        webhookSecretSet: !!process.env.STRIPE_WEBHOOK_SECRET
      },
      database: {
        configured: supabaseConfigured
      }
    });
  });
}

// Simple image upload endpoint for embed logo
app.post('/api/upload-logo', upload.single('logo'), async (req, res) => {
  console.log('\n========== UPLOAD ENDPOINT HIT ==========');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Request received');
  console.log('File object:', req.file ? 'YES' : 'NO');
  console.log('Files array:', req.files ? 'YES' : 'NO');
  console.log('Body:', req.body);
  console.log('Headers:', Object.keys(req.headers));
  console.log('========================================\n');
  
  if (!req.file) {
    console.warn('❌ No file in request');
    console.log('Available properties:', Object.keys(req));
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  console.log('✅ File received:', req.file.filename);
  console.log('   Original name:', req.file.originalname);
  console.log('   Size:', req.file.size);
  console.log('   Path:', req.file.path);
  
  // Build public URL relative to server
  const fileUrl = `${req.protocol}://${req.get('host')}/assets/media/uploads/${req.file.filename}`;
  console.log('📍 File URL:', fileUrl);
  
  // Send admin email notification
  console.log('📧 Calling sendAdminEmail...');
  const emailHtml = `<h2>🖼️ Logo Uploaded</h2><p><strong>File:</strong> ${req.file.originalname}</p><p><strong>Size:</strong> ${(req.file.size / 1024).toFixed(2)} KB</p><p><strong>URL:</strong> <a href="${fileUrl}">View</a></p><p><strong>Time:</strong> ${new Date().toISOString()}</p>`;
  
  try {
    const emailResult = await sendAdminEmail(
      `🖼️ Logo Uploaded: ${req.file.originalname}`, 
      `Logo file uploaded: ${req.file.originalname}`, 
      emailHtml
    );
    console.log('📧 Email send result:', emailResult);
  } catch (emailError) {
    console.error('❌ Error in sendAdminEmail:', emailError.message);
    console.error('Stack:', emailError.stack);
  }
  
  console.log('✅ Upload response sent');
  res.json({ url: fileUrl });
});

// TEST EMAIL ENDPOINT - for debugging (GET for browser, POST for API)
app.get('/api/test-email', async (req, res) => {
  console.log('\n📧 TEST EMAIL ENDPOINT CALLED (GET)');
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASSWORD set:', !!process.env.EMAIL_PASSWORD);
  console.log('EMAIL_PASSWORD length:', (process.env.EMAIL_PASSWORD || '').length);
  console.log('Transporter exists:', !!transporter);
  
  if (!transporter) {
    console.log('❌ Transporter is NULL - EMAIL_PASSWORD not configured');
    return res.status(500).json({ 
      error: 'Email not configured',
      email_user: process.env.EMAIL_USER || 'NOT SET',
      email_password_set: !!process.env.EMAIL_PASSWORD,
      email_password_length: (process.env.EMAIL_PASSWORD || '').length,
      admin_email: process.env.ADMIN_EMAIL || 'NOT SET',
      details: 'EMAIL_PASSWORD environment variable is not set or invalid'
    });
  }

  try {
    console.log('📤 Sending test email to:', process.env.ADMIN_EMAIL);
    const result = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || 'carnageremaps@gmail.com',
      subject: '✅ TEST EMAIL - Carnage Remaps Email System',
      html: `
        <h2>✅ Email System Test</h2>
        <p><strong>Status:</strong> Email configuration is working!</p>
        <p><strong>Sent at:</strong> ${new Date().toISOString()}</p>
        <p><strong>From:</strong> ${process.env.EMAIL_USER}</p>
        <p><strong>To:</strong> ${process.env.ADMIN_EMAIL}</p>
        <p>This email confirms that your email system is properly configured.</p>
      `
    });
    
    console.log('✅ TEST EMAIL SENT SUCCESSFULLY');
    console.log('Response:', result);
    return res.json({ 
      success: true, 
      message: 'Test email sent successfully! Check your inbox.',
      details: {
        messageId: result.messageId,
        to: process.env.ADMIN_EMAIL
      }
    });
  } catch (error) {
    console.error('❌ TEST EMAIL FAILED:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    
    return res.status(500).json({
      success: false,
      error: error.message,
      code: error.code,
      email_user: process.env.EMAIL_USER,
      admin_email: process.env.ADMIN_EMAIL,
      details: 'Check server logs for full error details'
    });
  }
});

app.post('/api/test-email', express.json(), async (req, res) => {
  console.log('\n📧 TEST EMAIL ENDPOINT CALLED');
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASSWORD set:', !!process.env.EMAIL_PASSWORD);
  console.log('Transporter exists:', !!transporter);
  
  if (!transporter) {
    console.log('❌ Transporter is NULL - EMAIL_PASSWORD not configured');
    return res.status(500).json({ 
      error: 'Email not configured',
      details: 'EMAIL_PASSWORD environment variable is not set'
    });
  }

  try {
    console.log('📤 Sending test email...');
    const result = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || 'carnageremaps@gmail.com',
      subject: '✅ TEST EMAIL - Carnage Remaps Email System',
      html: `
        <h2>✅ Email System Test</h2>
        <p><strong>Status:</strong> Email configuration is working!</p>
        <p><strong>Sent at:</strong> ${new Date().toISOString()}</p>
        <p><strong>From:</strong> ${process.env.EMAIL_USER}</p>
        <p><strong>To:</strong> ${process.env.ADMIN_EMAIL}</p>
        <p>This email confirms that your email system is properly configured.</p>
      `
    });
    
    console.log('✅ TEST EMAIL SENT SUCCESSFULLY');
    console.log('Response:', result);
    return res.json({ 
      success: true, 
      message: 'Test email sent successfully!',
      details: {
        messageId: result.messageId,
        to: process.env.ADMIN_EMAIL
      }
    });
  } catch (error) {
    console.error('❌ TEST EMAIL FAILED:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Full error:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message,
      code: error.code,
      details: 'Check server logs for full error details'
    });
  }
});

// Notify admin of ECU file upload
app.post('/api/notify-file-upload', express.json(), async (req, res) => {
  const { customer_name, customer_email, vehicle, engine, filename, stage, total_price } = req.body;
  
  console.log('\n📧 FILE UPLOAD NOTIFICATION ENDPOINT CALLED');
  console.log('   Customer:', customer_name, '(' + customer_email + ')');
  console.log('   Vehicle:', vehicle);
  console.log('   Engine:', engine);
  console.log('   Filename:', filename);
  
  if (!customer_name || !customer_email || !vehicle) {
    console.warn('❌ Missing required fields');
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Add admin notification
    addAdminNotification({
      type: 'file',
      icon: '📁',
      title: 'File Upload',
      message: `${customer_name} uploaded ${filename} for ${vehicle}`,
      user: customer_name,
      badge: stage || 'pending'
    });
    
    // Use unified notification (Email + WhatsApp)
    const result = await notifyAdmin(
      '📁 NEW FILE',
      `ECU File from ${customer_name}`,
      `Customer: ${customer_name}\nEmail: ${customer_email}\nVehicle: ${vehicle}\nEngine: ${engine || 'N/A'}\nStage: ${stage || 'N/A'}\nPrice: £${(total_price || 0).toFixed(2)}\nFilename: ${filename}`
    );

    if (result.emailSent || result.whatsAppSent) {
      console.log('✅ NOTIFICATION SENT - Admin alerted');
      return res.json({ success: true, message: 'Notification sent', ...result });
    } else {
      console.log('⚠️ NOTIFICATION FAILED - Check server logs');
      return res.status(500).json({ success: false, message: 'Failed to send notification' });
    }
  } catch (error) {
    console.error('❌ Error in notification endpoint:', error.message);
    res.status(500).json({ error: 'Failed to send notification', details: error.message });
  }
});

// Notify admin of manual top-up request
app.post('/api/notify-topup-request', express.json(), async (req, res) => {
  const { user_name, user_email, amount, request_id } = req.body;
  
  if (!user_name || !user_email || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    // Add admin notification
    addAdminNotification({
      type: 'payment',
      icon: '💰',
      title: 'Top-Up Request',
      message: `${user_name} requested £${amount.toFixed(2)} credit top-up`,
      user: user_name,
      badge: 'pending'
    });
    
    // Use unified notification (Email + WhatsApp)
    const result = await notifyAdmin(
      '💰 TOP-UP REQUEST',
      `£${amount.toFixed(2)} from ${user_name}`,
      `User: ${user_name}\nEmail: ${user_email}\nAmount: £${amount.toFixed(2)}\nRequest ID: ${request_id || 'N/A'}\nStatus: Awaiting approval`
    );
    
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Error sending top-up notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

// Notify admin of new user registration
app.post('/api/notify-new-user', express.json(), async (req, res) => {
  const { user_name, user_email, registration_time } = req.body;
  
  if (!user_name || !user_email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    // Add admin notification
    addAdminNotification({
      type: 'user',
      icon: '👤',
      title: 'New User',
      message: `${user_name} registered an account`,
      user: user_name,
      badge: 'new'
    });
    
    // Use unified notification (Email + WhatsApp)
    const result = await notifyAdmin(
      '👤 NEW USER',
      `${user_name} registered`,
      `Name: ${user_name}\nEmail: ${user_email}\nRegistered: ${registration_time || new Date().toISOString()}`
    );
    
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Error sending new user notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

// Notify admin of payment (backup for webhook)
app.post('/api/notify-payment', express.json(), async (req, res) => {
  const { user_name, user_email, amount, type, session_id } = req.body;
  
  if (!user_email || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    const paymentType = type === 'subscription' ? '🔄 SUBSCRIPTION' : '💳 PAYMENT';
    
    // Use unified notification (Email + WhatsApp)
    const result = await notifyAdmin(
      paymentType,
      `£${amount.toFixed(2)} from ${user_name || user_email}`,
      `User: ${user_name || 'N/A'}\nEmail: ${user_email}\nAmount: £${amount.toFixed(2)}\nType: ${type || 'payment'}\nSession: ${session_id || 'N/A'}`
    );
    
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Error sending payment notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

// Vehicle Database API for embed widget
app.get('/api/vehicles', (req, res) => {
  // Enable CORS for embed widgets on external sites
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache'); // Don't cache so updates reflect immediately

  const core = CarnageVehicleDB.getAPIData();
  const csvEngines = getCsvEnginesByModel();

  res.json({
    models: core.models || {},
    yearEngines: core.yearEngines || {},
    csvEngines: csvEngines || {}
  });
});

// VRM lookup via CheckCarDetails
function pickVehicleField(source, candidateKeys) {
  if (!source) return null;
  const queue = [source];
  const keySet = candidateKeys.map(k => k.toLowerCase());
  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) continue;
    if (Array.isArray(current)) {
      queue.push(...current);
      continue;
    }
    if (typeof current !== 'object') continue;
    for (const [key, value] of Object.entries(current)) {
      if (keySet.includes(key.toLowerCase())) {
        if (typeof value === 'string' || typeof value === 'number') {
          const text = String(value).trim();
          if (text) return text;
        }
      }
      if (value && typeof value === 'object') {
        queue.push(value);
      }
    }
  }
  return null;
}

function formatEngineCapacity(value) {
  if (value === null || value === undefined) return null;
  const numeric = parseFloat(value);
  if (!Number.isNaN(numeric)) {
    if (numeric > 100 && numeric < 10000) {
      const liters = numeric / 1000;
      return liters % 1 === 0 ? `${liters.toFixed(0)}L` : `${liters.toFixed(1)}L`;
    }
    if (numeric > 0 && numeric < 20) {
      return numeric % 1 === 0 ? `${numeric.toFixed(1)}L` : `${numeric.toFixed(1)}L`;
    }
  }
  const text = String(value).trim();
  if (!text) return null;
  return /cc|cm3|l/i.test(text) ? text : `${text}L`;
}

function buildEngineLabel(vehicle) {
  const parts = [];
  const capacity = formatEngineCapacity(vehicle.engineCapacity);
  if (capacity) parts.push(capacity);
  if (vehicle.fuelType) parts.push(vehicle.fuelType);
  if (vehicle.powerBhp) {
    const powerText = String(vehicle.powerBhp).toLowerCase().includes('hp')
      ? String(vehicle.powerBhp)
      : `${vehicle.powerBhp}hp`;
    parts.push(powerText);
  }
  if (vehicle.torqueNm) {
    const torqueText = String(vehicle.torqueNm).toLowerCase().includes('nm')
      ? String(vehicle.torqueNm)
      : `${vehicle.torqueNm}nm`;
    parts.push(torqueText);
  }
  if (!parts.length && vehicle.engine) {
    parts.push(vehicle.engine);
  }
  return parts.join(' ').trim();
}

function normalizeVehicleResponse(data) {
  const dataItems = data?.Response?.DataItems || data?.DataItems || data?.dataItems || data?.data || data;

  // Pull out rich blocks first (vehiclespecs), then fallbacks
  const blocks = [
    dataItems?.VehicleSpecs || dataItems?.vehiclespecs,
    dataItems?.UkVehicleData || dataItems?.ukvehicledata,
    dataItems?.VehicleRegistration || dataItems?.vehicleregistration,
    dataItems?.VehicleData || dataItems?.vehicledata || dataItems?.vehicle,
    dataItems
  ].filter(block => block && typeof block === 'object');

  const source = blocks[0] || {};
  const vehicle = {
    // Prefer SMMT/DVLA naming when present
    make: pickVehicleField(source, ['make', 'manufacturer', 'marque']),
    model: pickVehicleField(source, ['model', 'range', 'vehiclemodel', 'description']),
    year: pickVehicleField(source, ['dateoffirstregistration', 'yearofmanufacture', 'registrationyear', 'manufactureyear', 'modelyear', 'plateyear', 'year']),
    fuelType: pickVehicleField(source, ['fueltype', 'fuel', 'fuel_type']),
    engineCapacity: pickVehicleField(source, ['enginecapacity', 'engine_cubic_capacity', 'enginecc', 'cc', 'cubiccapacity', 'enginecapacityltr']),
    powerBhp: pickVehicleField(source, ['performancebhp', 'maximumpowerbhp', 'powerbhp', 'power_bhp', 'maxpowerbhp', 'bhp', 'power']),
    engine: pickVehicleField(source, ['engine', 'enginedescription', 'enginecode'] ),
    transmission: pickVehicleField(source, ['transmission', 'gearbox']),
    vin: pickVehicleField(source, ['vin', 'vehicleidentificationnumber']),
    bodyStyle: pickVehicleField(source, ['bodystyle', 'body_type', 'body'])
  };

  // Vehiclespecs-specific overrides (richer data)
  const specsRoot = source.VehicleIdentification || source.vehicleidentification || source;
  const modelData = source.ModelData || source.modeldata || {};
  const smmt = source.SmmtDetails || source.smmtdetails || {};
  const tech = source.DvlaTechnicalDetails || source.dvlatechnicaldetails || {};
  const perf = source.Performance || source.performance || {};
  const power = source.Power || source.power || {};
  const powerSource = source.PowerSource || source.powersource || {};
  const bodyDetails = source.BodyDetails || source.bodydetails || {};
  const dimensions = source.Dimensions || source.dimensions || {};
  const weights = source.Weights || source.weights || {};
  const iceDetails = powerSource.IceDetails || powerSource.icedetails || {};
  const exciseDuty = source.VehicleExciseDutyDetails || source.vehicleexcisedutydetails || {};
  const torqueObj = perf.Torque || perf.torque || {};
  const powerObj = perf.Power || perf.power || {};

  vehicle.make = smmt.Make || tech.Make || specsRoot.Make || modelData.Manufacturer || vehicle.make;
  vehicle.model = smmt.Model || tech.Model || specsRoot.Model || modelData.Model || vehicle.model;
  vehicle.year = (source.DateOfFirstRegistration || source.dateoffirstregistration || '').toString().slice(0, 4)
    || smmt.YearOfManufacture || tech.YearOfManufacture || vehicle.year;
  vehicle.engineCapacity = tech.EngineCapacity || powerSource.EngineCapacity || specsRoot.EngineCapacity || vehicle.engineCapacity;
  vehicle.fuelType = tech.FuelType || powerSource.FuelType || smmt.FuelType || vehicle.fuelType;
  vehicle.powerBhp = power.PerformanceBhp || perf.MaximumPowerBhp || powerObj.Bhp || smmt.PowerBhp || vehicle.powerBhp;
  
  // Extract torque - handle both object and scalar formats
  let torqueFinal = null;
  if (torqueObj && typeof torqueObj === 'object' && torqueObj.Nm) {
    torqueFinal = torqueObj.Nm;
  } else if (power && power.PerformanceTorque && typeof power.PerformanceTorque === 'object' && power.PerformanceTorque.Nm) {
    torqueFinal = power.PerformanceTorque.Nm;
  } else if (power && power.Torque && typeof power.Torque === 'object' && power.Torque.Nm) {
    torqueFinal = power.Torque.Nm;
  } else if (smmt && smmt.TorqueNm) {
    torqueFinal = smmt.TorqueNm;
  }
  vehicle.torqueNm = torqueFinal || null;

  // Additional rich fields from vehiclespecs
  vehicle.vin = specsRoot.Vin || vehicle.vin || null;
  vehicle.engineNumber = specsRoot.EngineNumber || iceDetails.EngineNumber || null;
  vehicle.v5cCount = specsRoot.V5cCertificateCount || null;
  vehicle.co2 = exciseDuty.DvlaCo2 || tech.Co2 || smmt.Co2 || null;
  vehicle.fuelTankCapacity = bodyDetails.FuelTankCapacityLitres || null;
  vehicle.towingCapacityBraked = tech.MaxTowableMassBraked || null;
  vehicle.towingCapacityUnbraked = tech.MaxTowableMassUnbraked || null;
  vehicle.kerbWeight = weights.KerbWeightKg || tech.MassInService || smmt.KerbWeight || null;
  vehicle.grossWeight = weights.GrossVehicleWeightKg || tech.GrossWeight || smmt.GrossVehicleWeight || null;
  vehicle.numberOfDoors = bodyDetails.NumberOfDoors || smmt.NumberOfDoors || tech.SeatCountIncludingDriver || null;
  vehicle.numberOfSeats = bodyDetails.NumberOfSeats || smmt.NumberOfSeats || null;
  vehicle.numberOfCylinders = iceDetails.NumberOfCylinders || smmt.NumberOfCylinders || null;
  vehicle.bore = iceDetails.Bore || smmt.Bore || null;
  vehicle.stroke = iceDetails.Stroke || smmt.Stroke || null;
  vehicle.aspiration = iceDetails.Aspiration || smmt.Aspiration || null;
  vehicle.valveGear = iceDetails.ValveGear || smmt.ValveGear || null;
  vehicle.numberOfGears = modelData.NumberOfGears || smmt.NumberOfGears || null;
  vehicle.transmissionType = modelData.TransmissionType || smmt.Transmission || null;
  vehicle.driveType = modelData.DriveType || smmt.DriveType || null;
  vehicle.maxSpeedKph = perf.Statistics?.MaxSpeedKph || smmt.MaxSpeedKph || null;
  vehicle.maxSpeedMph = perf.Statistics?.MaxSpeedMph || smmt.MaxSpeedMph || null;
  vehicle.torqueRpm = torqueObj.Rpm || smmt.TorqueRpm || null;
  vehicle.powerRpm = powerObj.Rpm || smmt.PowerRpm || null;
  vehicle.length = dimensions.LengthMm || smmt.Length || null;
  vehicle.width = dimensions.WidthMm || smmt.Width || null;
  vehicle.height = dimensions.HeightMm || smmt.Height || null;
  vehicle.wheelbase = dimensions.WheelBaseLengthMm || smmt.WheelBase || null;

  vehicle.engineLabel = buildEngineLabel(vehicle);
  return vehicle;
}

app.get('/api/vrm-lookup', async (req, res) => {
  try {
    const vrmRaw = (req.query.vrm || '').toString().trim();
    const email = (req.query.email || '').toString().trim();
    const iframeId = (req.query.iframeId || '').toString().trim();

    if (!vrmRaw) {
      return res.status(400).json({ error: 'vrm is required' });
    }

    // Check if iframe is locked
    if (iframeId) {
      try {
        const { data: iframe, error: iframeError } = await supabase
          .from('iframes')
          .select('id, status, email')
          .eq('id', iframeId)
          .single();

        if (!iframeError && iframe && iframe.status === 'locked') {
          console.log(`🔒 VRM Lookup blocked - iframe ${iframeId} is locked`);
          return res.status(403).json({ 
            error: 'This widget has been locked by an admin',
            locked: true
          });
        }
      } catch (err) {
        console.warn('Error checking iframe lock status:', err);
        // Continue - don't block on database errors
      }
    } else if (email) {
      // Check email-based lock status if no iframeId
      try {
        const { data: lockedIframe, error: lockedError } = await supabase
          .from('iframes')
          .select('id, status')
          .eq('email', email)
          .eq('status', 'locked')
          .eq('type', 'vrm')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (!lockedError && lockedIframe) {
          console.log(`🔒 VRM Lookup blocked - email ${email} has locked iframe`);
          return res.status(403).json({ 
            error: 'This widget has been locked by an admin',
            locked: true
          });
        }
      } catch (err) {
        console.warn('Error checking email lock status:', err);
        // Continue - don't block on database errors
      }
    }

    // Check VRM subscription (including expiry date)
    if (email) {
      try {
        const { data: subs, error: subError } = await supabase
          .from('subscriptions')
          .select('id, status, subscription_type, current_period_end')
          .eq('email', email)
          .eq('subscription_type', 'vrm')
          .eq('status', 'active');

        if (subError) {
          console.error('Error checking subscriptions:', subError);
        } else if (!subs || subs.length === 0) {
          console.log(`❌ VRM Lookup blocked - no active VRM subscription for ${email}`);
          return res.status(403).json({ 
            error: 'VRM Lookup requires an active subscription (£17.99/month)',
            needsSubscription: true,
            subscriptionType: 'vrm'
          });
        } else {
          // Check if subscription has expired
          const sub = subs[0];
          const expiryDate = new Date(sub.current_period_end);
          const now = new Date();
          
          if (expiryDate < now) {
            console.log(`❌ VRM Lookup blocked - subscription expired on ${expiryDate.toISOString()} for ${email}`);
            return res.status(403).json({ 
              error: 'VRM Lookup subscription expired. Please renew your subscription.',
              needsSubscription: true,
              subscriptionType: 'vrm',
              expiredDate: expiryDate.toISOString()
            });
          }
          
          console.log(`✅ VRM Lookup allowed - active subscription for ${email}, expires ${expiryDate.toISOString()}`);
        }
      } catch (err) {
        console.error('Subscription check error:', err);
        // Don't block on subscription check errors
      }
    } else {
      // No email provided - block access
      console.log('❌ VRM Lookup blocked - no email provided');
      return res.status(403).json({ 
        error: 'VRM Lookup requires an active subscription',
        needsSubscription: true,
        subscriptionType: 'vrm'
      });
    }

    // Service status check temporarily disabled - always allow VRM lookups
    // TODO: Re-enable when service_status table is properly populated
    /*
    if (supabase) {
      const { data, error } = await supabase
        .from('service_status')
        .select('is_enabled, disabled_reason')
        .eq('service_name', 'vrm_lookup')
        .single();
      
      if (!error && data && !data.is_enabled) {
        console.log('🚫 VRM Lookup service is disabled');
        return res.status(403).json({ 
          error: 'This service is temporarily turned off by the admin.',
          disabled: true,
          reason: data.disabled_reason || 'VRM Lookup service is currently disabled'
        });
      }
    }
    */
    
    // Prefer env key; if missing, fall back to provided test key (letters must include 'A')
    const apiKey = CHECKCAR_API_KEY || 'e80ce7141c39ae0b111a1999f6a0891b';

    if (!apiKey) {
      console.warn('⚠️ CHECKCAR_API_KEY not configured');
      return res.status(500).json({ error: 'VRM lookup is not configured' });
    }

    const vrm = vrmRaw.replace(/\s+/g, '').toUpperCase();
    // Default to vehiclespecs for richer data, allow explicit override
    const datapoint = (req.query.datapoint || 'vehiclespecs').toString().trim();
    const url = `https://api.checkcardetails.co.uk/vehicledata/${encodeURIComponent(datapoint)}?apikey=${encodeURIComponent(apiKey)}&vrm=${encodeURIComponent(vrm)}`;

    console.log(`📍 VRM Lookup: ${vrm} via ${datapoint}`);

    const providerResp = await fetch(url, { headers: { 'Accept': 'application/json' } });
    const rawText = await providerResp.text();
    let providerJson = null;

    try {
      providerJson = JSON.parse(rawText);
    } catch (err) {
      // Keep raw text when JSON parse fails
      console.warn('⚠️ Failed to parse provider response as JSON');
    }

    if (!providerResp.ok) {
      console.error(`❌ Provider error (${providerResp.status}):`, providerJson?.error || rawText?.substring(0, 200));
      return res.status(providerResp.status).json({
        error: providerJson?.error || providerJson?.message || 'Lookup failed',
        providerStatus: providerResp.status,
        providerBody: providerJson || rawText
      });
    }

    const vehicle = normalizeVehicleResponse(providerJson || {});

    res.json({
      success: true,
      vrm,
      datapoint,
      provider: 'checkcardetails',
      vehicle,
      providerStatus: providerResp.status
    });
  } catch (err) {
    console.error('❌ VRM lookup error:', err);
    res.status(500).json({ error: 'VRM lookup failed', details: err.message });
  }
});

// ============================================
// DVLA Open Data API Endpoint
// ============================================
// Step 1: Authenticate to get JWT token (valid 1 hour) — optional; VES can run with API key only
async function getDvlaJwtToken() {
  // Check if cached token is still valid
  if (dvlaJwtToken && dvlaJwtExpiry && Date.now() < dvlaJwtExpiry) {
    return dvlaJwtToken;
  }

  if (!DVLA_USERNAME || !DVLA_PASSWORD) {
    throw new Error('DVLA username and password not configured');
  }

  console.log('📍 Authenticating with DVLA API...');
  
  const authResponse = await fetch(`${DVLA_API_BASE_URL}/thirdparty-access/v1/authenticate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      userName: DVLA_USERNAME,
      password: DVLA_PASSWORD
    })
  });

  if (!authResponse.ok) {
    const errorData = await authResponse.json().catch(() => ({}));
    console.error('❌ DVLA authentication failed:', errorData);
    throw new Error(errorData.detail || errorData.title || 'DVLA authentication failed');
  }

  const authData = await authResponse.json();
  dvlaJwtToken = authData['id-token'];
  dvlaJwtExpiry = Date.now() + (55 * 60 * 1000); // Cache for 55 minutes (JWT valid for 1 hour)
  
  console.log('✅ DVLA JWT obtained, expires in 55 minutes');
  return dvlaJwtToken;
}

// Step 2: Lookup vehicle information via DVLA API
app.get('/api/dvla-lookup', async (req, res) => {
  try {
    // TEMPORARILY DISABLED - Service status check
    // Check if VRM lookup service is enabled
    /*
    if (supabase) {
      const { data, error } = await supabase
        .from('service_status')
        .select('is_enabled, disabled_reason')
        .eq('service_name', 'vrm_lookup')
        .single();
      
      if (!error && data && !data.is_enabled) {
        console.log('🚫 VRM Lookup service is disabled');
        return res.status(403).json({ 
          error: 'This service is temporarily turned off by the admin.',
          disabled: true,
          reason: data.disabled_reason || 'VRM Lookup service is currently disabled'
        });
      }
    }
    */
    
    const vrmRaw = (req.query.vrm || '').toString().trim();

    if (!vrmRaw) {
      return res.status(400).json({ error: 'vrm is required' });
    }

    if (!DVLA_API_KEY) {
      console.warn('⚠️ DVLA_API_KEY not configured');
      return res.status(500).json({ error: 'DVLA API is not configured' });
    }

    // Clean and validate VRM
    const vrm = vrmRaw.replace(/\s+/g, '').toUpperCase();
    if (!/^[A-Z0-9]{2,7}$/.test(vrm)) {
      return res.status(400).json({ error: 'Invalid VRM format' });
    }

    console.log(`📍 DVLA Lookup: ${vrm}`);

    // Optional JWT: only used if username/password are configured
    let jwtToken = null;
    if (DVLA_USERNAME && DVLA_PASSWORD) {
      try {
        jwtToken = await getDvlaJwtToken();
      } catch (authError) {
        console.warn('⚠️ DVLA auth unavailable, falling back to API key only:', authError.message);
      }
    }

    // DVLA VES accepts API key; JWT (if present) is added for third-party flows
    const response = await fetch(`${DVLA_API_BASE_URL}/vehicle-enquiry/v1/vehicles`, {
      method: 'POST',
      headers: {
        'x-api-key': DVLA_API_KEY,
        ...(jwtToken ? { 'Authorization': jwtToken } : {}),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        registrationNumber: vrm
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`❌ DVLA error (${response.status}):`, JSON.stringify(data));
      
      // If 401 and we tried JWT, clear cache
      if (response.status === 401 && jwtToken) {
        console.log('🔄 JWT expired, clearing cache...');
        dvlaJwtToken = null;
        dvlaJwtExpiry = null;
      }
      
      return res.status(response.status).json({
        error: data.errors?.[0]?.title || data.error || data.message || 'DVLA lookup failed',
        details: data.errors?.[0]?.detail || data.detail,
        dvlaStatus: response.status
      });
    }

    // Transform DVLA response to our standard format
    const vehicle = {
      make: data.make,
      model: data.model,
      yearOfManufacture: data.yearOfManufacture,
      engineCapacity: data.engineCapacity,
      fuelType: data.fuelType,
      colour: data.colour
    };

    console.log(`✅ DVLA Lookup success: ${data.make} ${data.model} (${data.yearOfManufacture})`);

    res.json({
      success: true,
      vrm,
      provider: 'dvla',
      vehicle,
      dvlaStatus: response.status,
      retrievedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('❌ DVLA lookup error:', err.message);
    res.status(500).json({ error: 'DVLA lookup failed', details: err.message });
  }
});

// Admin endpoint to fix subscription types
app.post('/api/admin/fix-subscription-types', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: 'Database not configured' });
    }
    
    console.log('🔧 Fixing subscription types...');
    
    // Update all subscriptions with type 'subscription' to 'embed'
    const { data, error } = await supabase
      .from('subscriptions')
      .update({ type: 'embed' })
      .or('type.eq.subscription,type.is.null')
      .select();
    
    if (error) {
      console.error('Error fixing subscriptions:', error);
      return res.status(500).json({ error: error.message });
    }
    
    console.log('✅ Fixed', data?.length || 0, 'subscriptions');
    res.json({ success: true, fixed: data?.length || 0, subscriptions: data });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Admin endpoint to check subscription status for a user
app.get('/api/admin/check-subscription/:email', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: 'Database not configured' });
    }
    
    const email = decodeURIComponent(req.params.email);
    console.log('🔍 Checking subscription for:', email);
    
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('email', email);
    
    if (error) {
      console.error('Error checking subscription:', error);
      return res.status(500).json({ error: error.message });
    }
    
    // Enrich with expiry status
    const now = new Date();
    const enriched = (data || []).map(sub => {
      const expiryDate = new Date(sub.current_period_end);
      const isExpired = expiryDate < now;
      const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
      
      return {
        ...sub,
        is_expired: isExpired,
        days_until_expiry: isExpired ? 0 : daysUntilExpiry,
        expiry_date_readable: expiryDate.toLocaleDateString(),
        payment_interval: 'monthly' // Stripe handles monthly billing
      };
    });
    
    res.json({ email, subscriptions: enriched || [] });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Admin endpoint to manually activate subscription
app.post('/api/admin/activate-subscription', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: 'Database not configured' });
    }
    
    const { email, userId, type, days } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }
    
    const subscriptionType = type || 'embed';
    const subscriptionDays = parseInt(days) || 30;
    
    console.log('🔧 Manually activating subscription for:', email, 'Type:', subscriptionType, 'Days:', subscriptionDays);
    
    // Check if subscription already exists for this email
    const { data: existing } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('email', email)
      .single();
    
    let data, error;
    
    if (existing) {
      // Update existing subscription
      const result = await supabase
        .from('subscriptions')
        .update({
          type: subscriptionType,
          status: 'active',
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + subscriptionDays * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('email', email)
        .select();
      data = result.data;
      error = result.error;
    } else {
      // Insert new subscription
      const manualSubId = 'manual_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      const result = await supabase
        .from('subscriptions')
        .insert({
          user_id: userId || null,
          email: email,
          stripe_subscription_id: manualSubId,
          type: subscriptionType,
          status: 'active',
          price_amount: 999,
          currency: 'gbp',
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + subscriptionDays * 24 * 60 * 60 * 1000).toISOString()
        })
        .select();
      data = result.data;
      error = result.error;
    }
    
    if (error) {
      console.error('Error activating subscription:', error);
      return res.status(500).json({ error: error.message });
    }
    
    console.log('✅ Subscription manually activated for:', email);
    
    // Send email notification to customer using Resend API
    if (RESEND_API_KEY && email) {
      try {
        const customerEmailHtml = `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#1a1a1a;color:#fff;padding:40px;border-radius:12px">
            <div style="text-align:center;margin-bottom:30px">
              <h1 style="color:#eab308;margin:0">🎉 Subscription Activated!</h1>
              <p style="color:#9ca3af;margin-top:10px">Your subscription has been manually activated by an admin</p>
            </div>
            <div style="background:#262626;padding:20px;border-radius:8px;margin:20px 0">
              <h3 style="color:#eab308;margin-top:0">You now have access to:</h3>
              <ul style="color:#d1d5db;padding-left:20px">
                <li>Embed vehicle lookup widget on your website</li>
                <li>Customizable colors and branding</li>
                <li>Real-time vehicle data lookup</li>
              </ul>
            </div>
            <div style="text-align:center;margin-top:30px">
              <a href="https://web-production-df12d.up.railway.app" 
                 style="display:inline-block;background:#eab308;color:#000;text-decoration:none;padding:15px 30px;border-radius:8px;font-weight:bold">
                Go to Dashboard
              </a>
            </div>
          </div>
        `;
        
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'Carnage Remaps <onboarding@resend.dev>',
            to: email,
            subject: '🎉 Your subscription is now active - Carnage Remaps',
            html: customerEmailHtml
          })
        });
        
        const emailData = await emailResponse.json();
        if (emailData.id) {
          console.log('✅ Activation email sent to:', email, 'ID:', emailData.id);
        } else {
          console.error('❌ Email API error:', emailData);
        }
      } catch (emailErr) {
        console.error('❌ Failed to send activation email:', emailErr.message);
      }
    } else {
      console.warn('⚠️ Email not sent - RESEND_API_KEY:', !!RESEND_API_KEY, 'email:', !!email);
    }
    
    // Add admin notification
    addAdminNotification({
      type: 'subscription',
      icon: '✅',
      title: 'Subscription Activated',
      message: `Manually activated subscription for ${email} (${type}, ${days} days)`,
      user: email,
      badge: 'active'
    });
    
    // Send admin notification email
    try {
      const adminEmailHtml = `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#111;color:#fff;padding:30px;border-radius:8px">
          <h2 style="color:#eab308;margin-top:0">✅ Subscription Manually Activated</h2>
          <div style="background:#1a1a1a;padding:20px;border-radius:6px;margin:20px 0">
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Type:</strong> ${type}</p>
            <p><strong>Duration:</strong> ${days} days</p>
            <p><strong>Expires:</strong> ${expirationDate.toLocaleDateString()}</p>
          </div>
          <p style="color:#9ca3af;font-size:0.875rem">Customer has been notified via email.</p>
        </div>
      `;
      await sendAdminEmail(
        `✅ Subscription Activated: ${email}`,
        `Subscription manually activated for ${email} (${type}, ${days} days)`,
        adminEmailHtml
      );
    } catch (adminEmailErr) {
      console.error('❌ Failed to send admin notification:', adminEmailErr.message);
    }
    
    res.json({ success: true, message: 'Subscription activated', subscription: data?.[0] });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Admin endpoint to update subscription status (activate/deactivate)
app.post('/api/admin/update-subscription-status', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: 'Database not configured' });
    }
    
    const { email, status } = req.body;
    
    if (!email || !status) {
      return res.status(400).json({ error: 'Email and status required' });
    }
    
    console.log(`🔧 Updating subscription status for ${email} to ${status}`);
    
    const updateData = {
      status: status,
      updated_at: new Date().toISOString()
    };
    
    // If activating, extend the period
    if (status === 'active') {
      updateData.current_period_end = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    }
    
    const { data, error } = await supabase
      .from('subscriptions')
      .update(updateData)
      .eq('email', email)
      .select();
    
    if (error) {
      console.error('Error updating subscription:', error);
      return res.status(500).json({ error: error.message });
    }
    
    console.log(`✅ Subscription status updated for ${email} to ${status}`);
    
    // Add admin notification
    addAdminNotification({
      type: 'subscription',
      icon: status === 'active' ? '✅' : '❌',
      title: `Subscription ${status === 'active' ? 'Activated' : 'Deactivated'}`,
      message: `Subscription status changed to ${status} for ${email}`,
      user: email,
      badge: status
    });
    
    res.json({ success: true, message: `Subscription ${status}`, subscription: data?.[0] });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Admin endpoint to extend subscription
app.post('/api/admin/extend-subscription', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: 'Database not configured' });
    }
    
    const { email, days } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }
    
    const extensionDays = parseInt(days) || 30;
    
    console.log(`🔧 Extending subscription for ${email} by ${extensionDays} days`);
    
    // Get current subscription
    const { data: current, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('email', email)
      .single();
    
    if (fetchError || !current) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    
    // Calculate new end date
    const currentEnd = current.current_period_end ? new Date(current.current_period_end) : new Date();
    const baseDate = currentEnd > new Date() ? currentEnd : new Date();
    const newPeriodEnd = new Date(baseDate.getTime() + extensionDays * 24 * 60 * 60 * 1000);
    
    const { data, error } = await supabase
      .from('subscriptions')
      .update({
        status: 'active',
        current_period_end: newPeriodEnd.toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('email', email)
      .select();
    
    if (error) {
      console.error('Error extending subscription:', error);
      return res.status(500).json({ error: error.message });
    }
    
    console.log(`✅ Subscription extended for ${email} to ${newPeriodEnd.toISOString()}`);
    
    // Add admin notification
    addAdminNotification({
      type: 'subscription',
      icon: '🔄',
      title: 'Subscription Extended',
      message: `Extended subscription for ${email} by ${extensionDays} days`,
      user: email,
      badge: 'extended'
    });
    
    res.json({ 
      success: true, 
      message: `Subscription extended by ${extensionDays} days`,
      newPeriodEnd: newPeriodEnd.toISOString(),
      subscription: data?.[0] 
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Admin endpoint to get all subscriptions
app.get('/api/admin/subscriptions', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: 'Database not configured' });
    }
    
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching subscriptions:', error);
      return res.status(500).json({ error: error.message });
    }
    
    res.json({ success: true, subscriptions: data || [] });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Test endpoint to check subscriptions for an email
app.get('/api/check-subscription/:email', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: 'Database not configured' });
    }
    
    const email = decodeURIComponent(req.params.email);
    console.log('🔍 Checking subscriptions for:', email);
    
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('email', email)
      .eq('status', 'active');
    
    if (error) {
      console.error('Error checking subscription:', error);
      return res.status(500).json({ error: error.message });
    }
    
    console.log('📋 Found subscriptions:', data?.length || 0);
    res.json({ 
      success: true, 
      email: email,
      hasActiveSubscription: (data && data.length > 0),
      subscriptions: data || [] 
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Input validation helper
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors.array().map(e => ({ field: e.path, message: e.msg }))
    });
  }
  next();
};

// Create Stripe checkout session for top-ups with input validation
app.post('/api/create-checkout-session', 
  [
    body('amount').isFloat({ min: 1, max: 10000 }).withMessage('Amount must be between £1 and £10,000'),
    body('userEmail').optional().isEmail().normalizeEmail().withMessage('Invalid email format'),
    body('userId').optional().isString().trim().escape()
  ],
  validateRequest,
  async (req, res) => {
  try {
    if (!stripeConfigured) {
      console.error('Stripe not configured - STRIPE_SECRET_KEY missing or invalid');
      return res.status(500).json({ 
        error: 'Payment system temporarily unavailable' 
      });
    }

    const { amount, userId, userEmail } = req.body;

    // Additional server-side validation
    const sanitizedAmount = parseFloat(amount);
    if (isNaN(sanitizedAmount) || sanitizedAmount <= 0 || sanitizedAmount > 10000) {
      return res.status(400).json({ error: 'Invalid amount. Must be between £1 and £10,000' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: 'Carnage Remaps Credit Top-Up',
              description: `Add £${sanitizedAmount.toFixed(2)} to your account`,
            },
            unit_amount: Math.round(sanitizedAmount * 100), // Convert to pence
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin || 'http://localhost:3000'}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin || 'http://localhost:3000'}?payment=cancelled`,
      customer_email: userEmail,
      metadata: {
        userId: userId?.toString() || '',
        type: 'topup',
        amount: amount.toString(),
      },
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({ error: error.message || 'Failed to create checkout session' });
  }
});

// Create Stripe subscription session
// Supports both direct priceId and dynamic price_data creation
app.post('/api/create-subscription-session', async (req, res) => {
  try {
    if (!stripeConfigured) {
      console.error('Stripe not configured - STRIPE_SECRET_KEY missing or invalid');
      return res.status(500).json({ 
        error: 'Stripe not configured. Please set STRIPE_SECRET_KEY environment variable with a valid Stripe secret key (starts with sk_)' 
      });
    }

    const { priceId, userId, userEmail, plan, amount, currency, interval, description } = req.body;
    
    console.log('Creating subscription session:', { priceId, userId, userEmail, plan, amount, currency, interval });

    // Build line items - either from priceId or dynamically from amount
    let lineItems;
    
    if (priceId) {
      // Use existing Stripe Price ID
      lineItems = [{
        price: priceId,
        quantity: 1,
      }];
    } else if (amount && currency && interval) {
      // Create price dynamically using price_data
      lineItems = [{
        price_data: {
          currency: currency || 'gbp',
          product_data: {
            name: description || 'Vehicle Stats Widget Subscription',
            description: 'Monthly access to embed vehicle lookup widget on your website',
          },
          unit_amount: Math.round((amount || 9.99) * 100), // Convert to pence
          recurring: {
            interval: interval || 'month',
          },
        },
        quantity: 1,
      }];
    } else {
      // Default to £9.99/month embed widget subscription
      lineItems = [{
        price_data: {
          currency: 'gbp',
          product_data: {
            name: 'Vehicle Stats Widget - Monthly Subscription',
            description: 'Embed the vehicle lookup widget on your dealer website',
          },
          unit_amount: 999, // £9.99 in pence
          recurring: {
            interval: 'month',
          },
        },
        quantity: 1,
      }];
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'subscription',
      success_url: `${req.headers.origin || 'http://localhost:3000'}?subscription=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin || 'http://localhost:3000'}?subscription=cancelled`,
      customer_email: userEmail,
      metadata: {
        userId: userId?.toString() || '',
        type: 'embed',
        plan: plan || 'embed-widget',
      },
    });

    console.log('Subscription session created:', session.id);
    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe subscription error:', error);
    res.status(500).json({ error: error.message || 'Failed to create subscription session' });
  }
});

// Create subscription via wallet payment (manual renewal)
app.post('/api/wallet-subscription', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    const { userId, amount, currency = 'gbp' } = req.body;

    if (!userId || !amount) {
      return res.status(400).json({ error: 'User ID and amount required' });
    }

    const { data: wallet } = await supabase
      .from('user_wallets')
      .select('balance')
      .eq('user_id', userId)
      .single();

    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ error: 'Insufficient wallet balance' });
    }

    const { data: subscription } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        subscription_type: 'embed-widget',
        start_date: new Date(),
        next_renewal: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        status: 'active',
      })
      .select();

    await supabase
      .from('user_wallets')
      .update({ balance: wallet.balance - amount })
      .eq('user_id', userId);

    res.json({ success: true, message: 'Subscription activated' });

  } catch (error) {
    console.error('Wallet subscription error:', error);
    res.status(500).json({ error: error.message || 'Failed to create wallet subscription' });
  }
});

// Verify payment session
app.post('/api/verify-payment', async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID required' });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    res.json({
      status: session.payment_status,
      amount: session.amount_total / 100,
      metadata: session.metadata,
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: error.message || 'Failed to verify payment' });
  }
});

// ============ IFRAME TRACKING ENDPOINTS ============

// Track/create a new iframe embed
app.post('/api/iframes/create', async (req, res) => {
  try {
    const {
      url,
      email,
      user_id,
      type,
      title,
      color_accent,
      color_bg,
      logo_url,
      whatsapp,
      contact_email
    } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    console.log(`[IFRAME CREATE] Creating ${type || 'embed'} iframe for email: ${email}`);

    // Insert into iframes table (user_id can be null for now)
    const { data, error } = await supabase
      .from('iframes')
      .insert({
        user_id: user_id || null,
        email: email,
        url: url,
        type: type || 'embed',
        status: 'active',
        title: title || null,
        color_accent: color_accent || null,
        color_bg: color_bg || null,
        logo_url: logo_url || null,
        whatsapp: whatsapp || null,
        contact_email: contact_email || null,
        uses: 0,
        last_used: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select();

    if (error) throw error;

    console.log(`[IFRAME CREATE] Success - created iframe with ID: ${data[0].id}`);
    res.json({ success: true, iframe: data[0] });
  } catch (error) {
    console.error('[IFRAME CREATE] Error:', error);
    res.status(500).json({ error: error.message || 'Failed to create iframe record' });
  }
});

// Get all iframes for admin
app.get('/api/iframes', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('iframes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const iframes = data || [];
    const emails = [...new Set(iframes.map(i => i.email).filter(Boolean))];
    let subsByEmail = {};

    if (emails.length) {
      const { data: subs, error: subsError } = await supabase
        .from('subscriptions')
        .select('email,type,status,current_period_end')
        .in('email', emails)
        .eq('status', 'active');

      if (!subsError && subs) {
        const now = new Date();
        subs.forEach(sub => {
          const end = sub.current_period_end ? new Date(sub.current_period_end) : null;
          const isActive = !end || end > now;
          if (!isActive) return;
          const existing = subsByEmail[sub.email];
          if (!existing || (existing.current_period_end || '') < (sub.current_period_end || '')) {
            subsByEmail[sub.email] = sub;
          }
        });
      }
    }

    const enriched = iframes.map(i => {
      const sub = subsByEmail[i.email];
      const end = sub?.current_period_end || null;
      const active = !!sub && (!end || new Date(end) > new Date());
      return {
        ...i,
        has_active_subscription: active,
        subscription_type: sub?.type || null,
        subscription_expires: end
      };
    });

    res.json({ iframes: enriched });
  } catch (error) {
    console.error('Error fetching iframes:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch iframes' });
  }
});

// Admin alias - maintain backward compatibility
app.get('/api/admin/iframes', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('iframes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const iframes = data || [];
    const emails = [...new Set(iframes.map(i => i.email).filter(Boolean))];
    let subsByEmail = {};

    if (emails.length) {
      const { data: subs, error: subsError } = await supabase
        .from('subscriptions')
        .select('email,type,status,current_period_end')
        .in('email', emails)
        .eq('status', 'active');

      if (!subsError && subs) {
        const now = new Date();
        subs.forEach(sub => {
          const end = sub.current_period_end ? new Date(sub.current_period_end) : null;
          const isActive = !end || end > now;
          if (!isActive) return;
          const existing = subsByEmail[sub.email];
          if (!existing || (existing.current_period_end || '') < (sub.current_period_end || '')) {
            subsByEmail[sub.email] = sub;
          }
        });
      }
    }

    const enriched = iframes.map(i => {
      const sub = subsByEmail[i.email];
      const end = sub?.current_period_end || null;
      const active = !!sub && (!end || new Date(end) > new Date());
      return {
        ...i,
        has_active_subscription: active,
        subscription_type: sub?.type || null,
        subscription_expires: end
      };
    });

    res.json({ iframes: enriched });
  } catch (error) {
    console.error('Error fetching admin iframes:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch iframes' });
  }
});

// Debug endpoint - get specific iframe by UUID
app.get('/api/iframes/debug/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`[DEBUG] Fetching iframe: ${id}`);
    
    const { data, error } = await supabase
      .from('iframes')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.log(`[DEBUG] Error fetching: ${error.code} - ${error.message}`);
      return res.json({ 
        success: false, 
        error: error.message,
        errorCode: error.code,
        id: id
      });
    }
    
    console.log(`[DEBUG] Found iframe:`, {
      id: data.id,
      email: data.email,
      status: data.status,
      type: data.type,
      url: data.url,
      created_at: data.created_at,
      updated_at: data.updated_at
    });
    
    res.json({ success: true, iframe: data });
  } catch (err) {
    console.error('[DEBUG] Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get iframe status by ID
app.get('/api/iframes/:id/status', async (req, res) => {
    try {
      const { id } = req.params;

      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      const baseSelect = 'id, status, email, url, created_at, last_used, user_id, type';

      const query = isUuid
        ? supabase.from('iframes').select(baseSelect).eq('id', id).single()
        : supabase.from('iframes').select(baseSelect).eq('user_id', Number(id)).order('created_at', { ascending: false }).limit(1).single();

      const { data, error } = await query;

      if (error) {
        // If iframe doesn't exist, return active status (don't block)
        if (error.code === 'PGRST116') {
          console.log(`[IFRAME STATUS] No record found for ${isUuid ? 'UUID' : 'user_id'}: ${id} - returning active`);
          return res.json({ 
            success: true, 
            iframe: { 
              id, 
              status: 'active',
              locked: false
            } 
          });
        }
        throw error;
      }

      console.log(`[IFRAME STATUS] Found iframe: ${data.id}, status: ${data.status}, type: ${data.type}`);
      res.json({ success: true, iframe: { ...data, locked: data?.status === 'locked' } });
    } catch (error) {
      console.error('Error fetching iframe status:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch iframe status' });
    }
  });

// Get iframe status by email (fallback when iframeId is missing)
app.get('/api/iframes/status-by-email', async (req, res) => {
  try {
    const email = (req.query.email || '').toString().trim();
    const type = (req.query.type || '').toString().trim();

    if (!email) {
      return res.status(400).json({ error: 'email is required' });
    }

    console.log(`[IFRAME STATUS BY EMAIL] Checking email: ${email}, type: ${type || 'ANY'}`);

    // CRITICAL: Check for ANY locked iframe for this email, REGARDLESS of type
    // This ensures if ANY embed/vrm is locked, the lock shows
    let allLockedQuery = supabase
      .from('iframes')
      .select('id, status, email, url, created_at, last_used, user_id, type')
      .eq('email', email)
      .eq('status', 'locked');

    const { data: allLockedRows, error: allLockedError } = await allLockedQuery;

    console.log(`[IFRAME STATUS BY EMAIL] ANY type locked check - error: ${allLockedError ? allLockedError.message : 'none'}, found: ${allLockedRows?.length || 0}`);

    if (!allLockedError && allLockedRows && allLockedRows.length > 0) {
      const lockedRow = allLockedRows[0];
      console.log(`[IFRAME STATUS BY EMAIL] ✅ Found locked iframe: ${lockedRow.id}, type: ${lockedRow.type}`);
      return res.json({ success: true, iframe: { ...lockedRow, locked: true } });
    }

    // If no locked iframe found, check for active iframe of the requested type
    let query = supabase
      .from('iframes')
      .select('id, status, email, url, created_at, last_used, user_id, type')
      .eq('email', email)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1);

    if (type) {
      query = query.eq('type', type);
    }

    const { data: activeRows, error: activeError } = await query;

    console.log(`[IFRAME STATUS BY EMAIL] Active check (type=${type || 'ANY'}) - error: ${activeError ? activeError.message : 'none'}, found: ${activeRows?.length || 0}`);

    if (!activeError && activeRows && activeRows.length > 0) {
      const data = activeRows[0];
      console.log(`[IFRAME STATUS BY EMAIL] Found active iframe: ${data.id}, type: ${data.type}, status: ${data.status}`);
      return res.json({ success: true, iframe: { ...data, locked: false } });
    }

    console.log(`[IFRAME STATUS BY EMAIL] No records found for ${email} (type=${type || 'ANY'}) - returning default active`);
    res.json({ success: true, iframe: { status: 'active', locked: false } });
  } catch (error) {
    console.error('Error fetching iframe status by email:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch iframe status' });
  }
});

// Lock/unlock an iframe
app.put('/api/iframes/:id/lock', async (req, res) => {
  try {
    const { id } = req.params;
    const { locked } = req.body;
    const status = locked ? 'locked' : 'active';

    const { data, error } = await supabase
      .from('iframes')
      .update({
        status: status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select();

    if (error) throw error;

    res.json({ success: true, iframe: data[0] });
  } catch (error) {
    console.error('Error updating iframe lock:', error);
    res.status(500).json({ error: error.message || 'Failed to update iframe' });
  }
});

// Admin toggle iframe status
app.post('/api/admin/iframes/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Toggle: if current status is locked, change to active; if active, change to locked
    const nextStatus = status === 'locked' ? 'active' : 'locked';
    
    console.log(`[IFRAME TOGGLE] Toggling iframe ${id}: ${status} -> ${nextStatus}`);

    // First, verify the iframe exists
    const { data: existing, error: fetchError } = await supabase
      .from('iframes')
      .select('id, status, email')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error(`[IFRAME TOGGLE] Failed to fetch iframe: ${fetchError.message}`);
      return res.status(404).json({ error: 'Iframe not found', fetchError: fetchError.message });
    }

    console.log(`[IFRAME TOGGLE] Found iframe - current status: ${existing.status}`);

    const { data, error } = await supabase
      .from('iframes')
      .update({
        status: nextStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`[IFRAME TOGGLE] Update failed: ${error.message}`);
      throw error;
    }

    if (!data) {
      console.error(`[IFRAME TOGGLE] Update returned no data`);
      return res.status(500).json({ error: 'Update failed - no data returned' });
    }

    console.log(`[IFRAME TOGGLE] Success - iframe ${id} now has status: ${data.status}`);
    res.json({ success: true, iframe: data });
  } catch (error) {
    console.error('Error toggling iframe status:', error);
    res.status(500).json({ error: error.message || 'Failed to update iframe' });
  }
});

// Delete an iframe
app.delete('/api/iframes/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('iframes')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting iframe:', error);
    res.status(500).json({ error: error.message || 'Failed to delete iframe' });
  }
});

// Increment iframe usage count
app.post('/api/iframes/:id/use', async (req, res) => {
  try {
    const { id } = req.params;

    // Get current usage count
    const { data: current, error: fetchError } = await supabase
      .from('iframes')
      .select('uses')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    const newCount = (current?.uses || 0) + 1;

    const { data, error } = await supabase
      .from('iframes')
      .update({
        uses: newCount,
        last_used: new Date().toISOString(),
      })
      .eq('id', id)
      .select();

    if (error) throw error;

    res.json({ success: true, iframe: data[0] });
  } catch (error) {
    console.error('Error updating iframe usage:', error);
    res.status(500).json({ error: error.message || 'Failed to update usage' });
  }
});

// Global error handler - catch all unhandled errors
app.use((err, req, res, next) => {
  console.error('🔥 Unhandled error:', err);
  console.error('   Request:', req.method, req.url);
  console.error('   Stack:', err.stack);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Start server (close any unclosed block)
app.listen(PORT, () => {
  console.log(`\n🚀 Carnage Remaps API Server running on http://localhost:${PORT}`);
  console.log(`📝 API Endpoints:`);
  console.log(`   - POST http://localhost:${PORT}/api/create-checkout-session`);
  console.log(`   - POST http://localhost:${PORT}/api/create-subscription-session`);
  console.log(`   - POST http://localhost:${PORT}/api/webhook`);
  console.log(`   - POST http://localhost:${PORT}/api/verify-payment`);
  console.log(`\n⚠️  Don't forget to set your Stripe keys in .env file!\n`);
});

