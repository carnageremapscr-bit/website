require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client (use service role for webhook access)
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://jvjyqpesanfugsysdnku.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseConfigured = SUPABASE_URL && SUPABASE_SERVICE_KEY;
const supabase = supabaseConfigured ? createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY) : null;

console.log('=== Supabase Configuration ===');
console.log('SUPABASE_URL set:', !!SUPABASE_URL);
console.log('SUPABASE_SERVICE_ROLE_KEY set:', !!SUPABASE_SERVICE_KEY);
console.log('Supabase configured:', supabaseConfigured);
console.log('==============================');

// Check if Stripe key is configured
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const stripeConfigured = STRIPE_KEY && STRIPE_KEY.startsWith('sk_');
const stripe = stripeConfigured ? require('stripe')(STRIPE_KEY) : null;

// Log configuration status on startup
console.log('=== Stripe Configuration ===');
console.log('STRIPE_SECRET_KEY set:', !!STRIPE_KEY);
console.log('Key starts with sk_:', STRIPE_KEY?.startsWith('sk_') || false);
console.log('STRIPE_WEBHOOK_SECRET set:', !!STRIPE_WEBHOOK_SECRET);
console.log('Webhook secret length:', STRIPE_WEBHOOK_SECRET?.length || 0);
console.log('Webhook secret first char code:', STRIPE_WEBHOOK_SECRET?.charCodeAt(0));
console.log('Webhook secret last char code:', STRIPE_WEBHOOK_SECRET?.charCodeAt(STRIPE_WEBHOOK_SECRET?.length - 1));
console.log('Stripe configured:', stripeConfigured);
console.log('===========================');

const app = express();
const PORT = process.env.PORT || 3002;

const path = require('path');
const fs = require('fs');
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

// Email notifications setup (nodemailer)
const nodemailer = require('nodemailer');
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'carnageremaps@gmail.com';
const EMAIL_USER = process.env.EMAIL_USER || 'carnageremaps@gmail.com';
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || '';

console.log('=== Email Configuration ===');
console.log('ADMIN_EMAIL:', ADMIN_EMAIL);
console.log('EMAIL_USER:', EMAIL_USER);
console.log('EMAIL_PASSWORD set:', !!EMAIL_PASSWORD);
console.log('EMAIL_PASSWORD length:', EMAIL_PASSWORD?.length || 0);
console.log('EMAIL_PASSWORD (first 10 chars):', EMAIL_PASSWORD ? EMAIL_PASSWORD.substring(0, 10) + '***' : 'NOT SET');

// Create transporter
const transporter = EMAIL_PASSWORD ? nodemailer.createTransport({
  service: 'gmail',
  auth: { user: EMAIL_USER, pass: EMAIL_PASSWORD }
}) : null;

console.log('Transporter created:', !!transporter);
console.log('===========================');

// Helper to send admin emails
async function sendAdminEmail(subject, text, html) {
  console.log('📧 sendAdminEmail called for:', subject);
  if (!transporter) { 
    console.warn('⚠️ Email not configured (transporter is null):', subject);
    console.warn('   EMAIL_PASSWORD must be set in environment variables');
    return false;
  }
  try {
    console.log('📤 Attempting to send email to:', ADMIN_EMAIL);
    await transporter.sendMail({ from: EMAIL_USER, to: ADMIN_EMAIL, subject, text, html: html || `<pre>${text}</pre>` });
    console.log('✉️ Admin email sent successfully:', subject);
    return true;
  } catch (err) { 
    console.error('❌ Email send failed:', err.message);
    console.error('   Error details:', err);
    return false;
  }
}

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
          } else {
            console.log('✅ Subscription saved for:', email);
            // Send admin email notification
            const emailHtml = `<h2>✅ New Subscription</h2><p><strong>User:</strong> ${email}</p><p><strong>Type:</strong> ${session.metadata?.type || 'embed'}</p><p><strong>Amount:</strong> £${(session.amount_total / 100).toFixed(2)}</p><p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>`;
            sendAdminEmail(`✅ New Subscription: ${email}`, `New subscription from ${email}`, emailHtml);
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
app.use(cors({
  origin: true, // Allow all origins (or specify your frontend domain)
  credentials: true
}));
app.use(express.json());

// Security and performance headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

app.use(express.static('.', {
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    } else if (path.endsWith('.avif')) {
      res.setHeader('Content-Type', 'image/avif');
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (path.match(/\.(css|js|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
})); // Serve static files from current directory

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Carnage Remaps API Server Running',
    timestamp: new Date().toISOString(),
    email: {
      configured: !!transporter,
      user: process.env.EMAIL_USER || 'not set',
      admin: process.env.ADMIN_EMAIL || 'not set',
      passwordSet: !!process.env.EMAIL_PASSWORD,
      passwordLength: process.env.EMAIL_PASSWORD?.length || 0,
      passwordFirst10: process.env.EMAIL_PASSWORD ? process.env.EMAIL_PASSWORD.substring(0, 10) + '***' : 'NOT SET'
    },
    stripe: {
      configured: stripeConfigured,
      keySet: !!process.env.STRIPE_SECRET_KEY,
      webhookSecretSet: !!process.env.STRIPE_WEBHOOK_SECRET
    }
  });
});

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

// TEST EMAIL ENDPOINT - for debugging
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
    const emailHtml = `
      <h2>📁 New ECU File Uploaded</h2>
      <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
        <p><strong>Customer:</strong> ${customer_name} (${customer_email})</p>
        <p><strong>Vehicle:</strong> ${vehicle}</p>
        <p><strong>Engine:</strong> ${engine || 'N/A'}</p>
        <p><strong>Stage:</strong> ${stage || 'N/A'}</p>
        <p><strong>Price:</strong> £${(total_price || 0).toFixed(2)}</p>
        <p><strong>Filename:</strong> ${filename}</p>
        <p><strong>Time:</strong> ${new Date().toISOString()}</p>
      </div>
      <p><strong>Action Required:</strong> Review and process this file in your admin panel.</p>
    `;

    const emailResult = await sendAdminEmail(
      `📁 New ECU File Uploaded: ${vehicle}`,
      `New ECU file uploaded by ${customer_name}\n\nVehicle: ${vehicle}\nEngine: ${engine}\nFilename: ${filename}`,
      emailHtml
    );

    console.log('✉️ Upload notification email sent:', emailResult);
    res.json({ success: true, message: 'Notification sent' });
  } catch (error) {
    console.error('❌ Error sending notification:', error.message);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

// Notify admin of manual top-up request
app.post('/api/notify-topup-request', express.json(), async (req, res) => {
  const { user_name, user_email, amount, request_id } = req.body;
  
  if (!user_name || !user_email || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    const emailHtml = `<h2>💰 Manual Top-Up Request</h2><p><strong>User:</strong> ${user_name}</p><p><strong>Email:</strong> ${user_email}</p><p><strong>Amount:</strong> £${amount.toFixed(2)}</p><p><strong>Request ID:</strong> ${request_id}</p><p><strong>Action:</strong> Review in admin panel</p><p><strong>Time:</strong> ${new Date().toISOString()}</p>`;
    
    await sendAdminEmail(
      `💰 Manual Top-Up Request: £${amount} from ${user_name}`,
      `${user_name} (${user_email}) requested £${amount.toFixed(2)} wallet credit`,
      emailHtml
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error sending top-up notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

// Vehicle Database API for embed widget
app.get('/api/vehicles', (req, res) => {
  // Enable CORS for embed widgets on external sites
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache'); // Don't cache so updates reflect immediately
  
  // FULL VEHICLE DATABASE - matches main.js exactly
  const VEHICLE_DATABASE = {
    'audi': ['A1', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q2', 'Q3', 'Q5', 'Q7', 'Q8', 'TT', 'R8', 'e-tron', 'Q4 e-tron', 'RS3', 'RS4', 'RS5', 'RS6', 'RS7', 'RSQ8'],
    'bmw': ['1 Series', '2 Series', '3 Series', '4 Series', '5 Series', '6 Series', '7 Series', '8 Series', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'Z4', 'i3', 'i4', 'i8', 'iX', 'M2', 'M3', 'M4', 'M5', 'M8', 'X3 M', 'X4 M', 'X5 M', 'X6 M'],
    'mercedes': ['A-Class', 'B-Class', 'C-Class', 'E-Class', 'S-Class', 'CLA', 'CLS', 'GLA', 'GLB', 'GLC', 'GLE', 'GLS', 'G-Class', 'SL', 'SLC', 'AMG GT', 'EQC', 'EQA', 'EQB', 'EQS', 'EQE', 'V-Class', 'Vito', 'Sprinter', 'A35 AMG', 'A45 AMG', 'C43 AMG', 'C63 AMG', 'E43 AMG', 'E63 AMG', 'GLC43 AMG', 'GLC63 AMG', 'GLE43 AMG', 'GLE63 AMG'],
    'volkswagen': ['Polo', 'Golf', 'Jetta', 'Passat', 'Arteon', 'T-Cross', 'T-Roc', 'Tiguan', 'Touareg', 'Caddy', 'Transporter', 'Crafter', 'ID.3', 'ID.4', 'ID.5', 'ID.Buzz', 'Golf GTI', 'Golf R', 'Scirocco', 'Beetle', 'Sharan', 'up!', 'Amarok'],
    'ford': ['Fiesta', 'Focus', 'Mondeo', 'Mustang', 'EcoSport', 'Puma', 'Kuga', 'Edge', 'Explorer', 'Transit', 'Transit Custom', 'Ranger', 'F-150', 'S-Max', 'Galaxy', 'Tourneo', 'Fiesta ST', 'Focus ST', 'Focus RS', 'Mustang Mach-E', 'Bronco'],
    'vauxhall': ['Corsa', 'Astra', 'Insignia', 'Mokka', 'Crossland', 'Grandland', 'Combo', 'Vivaro', 'Movano', 'Corsa-e', 'Mokka-e', 'Zafira', 'Ampera', 'Corsa VXR', 'Astra VXR'],
    'land-rover': ['Defender', 'Discovery', 'Discovery Sport', 'Range Rover', 'Range Rover Sport', 'Range Rover Evoque', 'Range Rover Velar', 'Freelander', 'Range Rover Autobiography', 'Range Rover SVR'],
    'nissan': ['Micra', 'Note', 'Pulsar', 'Juke', 'Qashqai', 'X-Trail', 'Leaf', 'GT-R', 'Navara', 'NV200', 'NV300', 'NV400', 'Ariya', '370Z', '350Z', 'Patrol', 'Pathfinder', 'Primastar', 'Interstar', 'Pixo'],
    'toyota': ['Aygo', 'Yaris', 'Corolla', 'Prius', 'Camry', 'C-HR', 'RAV4', 'Highlander', 'Land Cruiser', 'Hilux', 'Proace', 'Avensis', 'Auris', 'Verso', 'Supra', 'GT86', 'bZ4X', 'Mirai', 'Yaris GR'],
    'peugeot': ['108', '208', '308', '508', '2008', '3008', '5008', 'Rifter', 'Partner', 'Boxer', 'e-208', 'e-2008', '307', '407', '4007', 'Expert', '208 GTi', '308 GTi', 'RCZ'],
    'renault': ['Twingo', 'Clio', 'Captur', 'Megane', 'Kadjar', 'Koleos', 'Scenic', 'Kangoo', 'Trafic', 'Master', 'Zoe', 'Arkana', 'Espace', 'Laguna', 'Fluence', 'Wind', 'Twizy', 'Clio RS', 'Megane RS'],
    'citroen': ['C1', 'C3', 'C4', 'C5', 'C3 Aircross', 'C5 Aircross', 'Berlingo', 'Dispatch', 'Relay', 'C5 X', 'C4 Cactus', 'C3 Picasso', 'C4 Picasso', 'C4 Grand Picasso', 'Nemo', 'Jumpy', 'e-Berlingo', 'e-C4'],
    'seat': ['Ibiza', 'Leon', 'Arona', 'Ateca', 'Tarraco', 'Alhambra', 'Mii', 'Toledo', 'Leon Cupra', 'Ibiza Cupra', 'Exeo'],
    'skoda': ['Fabia', 'Scala', 'Octavia', 'Superb', 'Kamiq', 'Karoq', 'Kodiaq', 'Enyaq iV', 'Citigo', 'Rapid', 'Yeti', 'Roomster', 'Octavia vRS', 'Superb Scout'],
    'volvo': ['S60', 'S90', 'V40', 'V60', 'V90', 'XC40', 'XC60', 'XC90', 'C30', 'C40', 'C70', 'V50', 'V70', 'S40', 'S80', 'XC70', 'XC40 Recharge', 'C40 Recharge'],
    'mazda': ['Mazda2', 'Mazda3', 'Mazda6', 'CX-3', 'CX-30', 'CX-5', 'CX-60', 'MX-5', 'CX-7', 'CX-9', 'RX-8', 'MX-30', 'Bongo'],
    'honda': ['Jazz', 'Civic', 'Accord', 'CR-V', 'HR-V', 'e', 'Civic Type R', 'NSX', 'Insight', 'Legend', 'FR-V', 'Stream', 'CR-Z', 'S2000', 'ZR-V'],
    'hyundai': ['i10', 'i20', 'i30', 'i40', 'Kona', 'Tucson', 'Santa Fe', 'Ioniq', 'Ioniq 5', 'Ioniq 6', 'ix35', 'ix20', 'Veloster', 'Genesis', 'i30 N', 'Kona N', 'Bayon', 'Palisade', 'Nexo'],
    'kia': ['Picanto', 'Rio', 'Ceed', 'Stonic', 'Niro', 'Sportage', 'Sorento', 'EV6', 'XCeed', 'ProCeed', 'Venga', 'Soul', 'Optima', 'Stinger', 'EV9', 'Carnival', 'Ceed GT'],
    'fiat': ['500', 'Panda', 'Tipo', '500X', '500L', 'Ducato', 'Doblo', 'Punto', 'Bravo', 'Qubo', 'Fiorino', 'Talento', '500e', '600e'],
    'alfa-romeo': ['Mito', 'Giulietta', 'Giulia', 'Stelvio', 'Tonale', '159', 'Brera', 'Spider', 'GT', '147', '156', 'Giulia Quadrifoglio', 'Stelvio Quadrifoglio'],
    'jeep': ['Renegade', 'Compass', 'Cherokee', 'Grand Cherokee', 'Wrangler', 'Gladiator', 'Avenger', 'Commander', 'Liberty', 'Patriot'],
    'mini': ['Hatch', 'Clubman', 'Countryman', 'Convertible', 'Paceman', 'Coupe', 'Roadster', 'JCW', 'Cooper S', 'Electric'],
    'porsche': ['718 Cayman', '718 Boxster', '911', 'Panamera', 'Macan', 'Cayenne', 'Taycan', '911 Turbo', '911 GT3', 'Carrera', 'Cayman GT4', 'Boxster Spyder'],
    'lexus': ['CT', 'IS', 'ES', 'GS', 'LS', 'UX', 'NX', 'RX', 'LC', 'LX', 'RC', 'RC F', 'GS F', 'IS F', 'LFA'],
    'jaguar': ['XE', 'XF', 'XJ', 'F-Type', 'E-Pace', 'F-Pace', 'I-Pace', 'X-Type', 'S-Type', 'XK', 'XFR', 'XKR', 'F-Type R', 'F-Pace SVR'],
    'dacia': ['Sandero', 'Logan', 'Duster', 'Jogger', 'Spring', 'Dokker', 'Lodgy'],
    'suzuki': ['Ignis', 'Swift', 'Baleno', 'Vitara', 'S-Cross', 'Jimny', 'Celerio', 'SX4', 'Grand Vitara', 'Splash', 'Alto', 'Swift Sport'],
    'subaru': ['Impreza', 'Legacy', 'Outback', 'Forester', 'XV', 'BRZ', 'Levorg', 'WRX', 'WRX STI', 'Tribeca', 'Solterra'],
    'mitsubishi': ['Mirage', 'Eclipse Cross', 'Outlander', 'ASX', 'L200', 'Colt', 'Lancer', 'Shogun', 'Pajero', 'Space Star', 'Outlander PHEV'],
    'tesla': ['Model 3', 'Model S', 'Model X', 'Model Y', 'Roadster', 'Cybertruck'],
    'bentley': ['Continental GT', 'Flying Spur', 'Bentayga', 'Mulsanne', 'Continental GTC'],
    'maserati': ['Ghibli', 'Quattroporte', 'Levante', 'MC20', 'GranTurismo', 'GranCabrio', 'Grecale'],
    'abarth': ['595', '695', '500e', '124 Spider', 'Grande Punto', 'Punto Evo'],
    'ds': ['DS 3', 'DS 4', 'DS 7', 'DS 9', 'DS 3 Crossback', 'DS 5'],
    'smart': ['Fortwo', 'Forfour', 'EQ', 'Roadster', '#1', '#3'],
    'ssangyong': ['Tivoli', 'Korando', 'Rexton', 'Musso', 'Rodius', 'Kyron', 'Actyon'],
    'infiniti': ['Q30', 'Q50', 'Q60', 'QX30', 'QX50', 'QX70', 'Q70', 'QX80', 'FX', 'G'],
    'iveco': ['Daily', 'Eurocargo', 'Stralis', 'S-Way', 'Trakker', 'X-Way'],
    'dodge': ['Challenger', 'Charger', 'Durango', 'Ram 1500', 'Ram 2500', 'Ram 3500', 'Journey', 'Grand Caravan', 'Viper', 'Nitro'],
    'chevrolet': ['Spark', 'Cruze', 'Malibu', 'Camaro', 'Corvette', 'Equinox', 'Traverse', 'Silverado', 'Tahoe', 'Suburban', 'Colorado', 'Trax', 'Blazer', 'Volt', 'Bolt'],
    'chrysler': ['300', 'Pacifica', 'Voyager', 'Sebring', 'PT Cruiser', 'Grand Voyager'],
    'opel': ['Corsa', 'Astra', 'Insignia', 'Mokka', 'Crossland', 'Grandland', 'Combo', 'Vivaro', 'Movano', 'Meriva', 'Antara', 'Agila', 'Adam', 'Karl', 'Cascada'],
    'mg': ['MG3', 'MG4', 'MG5', 'HS', 'ZS', 'ZS EV', 'MG4 EV', 'Marvel R', 'MG TF', 'MG ZT'],
    'cupra': ['Formentor', 'Leon', 'Ateca', 'Born', 'Tavascan'],
    'genesis': ['G70', 'G80', 'G90', 'GV60', 'GV70', 'GV80'],
    'polestar': ['Polestar 1', 'Polestar 2', 'Polestar 3', 'Polestar 4'],
    'lotus': ['Elise', 'Exige', 'Evora', 'Emira', 'Eletre'],
    'aston-martin': ['Vantage', 'DB11', 'DBS', 'DBX', 'Rapide'],
    'mclaren': ['540C', '570S', '720S', '765LT', 'GT', 'Artura'],
    'ferrari': ['488', 'F8 Tributo', 'SF90', 'Roma', 'Portofino', '812 Superfast', 'Purosangue'],
    'lamborghini': ['Huracan', 'Aventador', 'Urus'],
    'rolls-royce': ['Ghost', 'Wraith', 'Dawn', 'Phantom', 'Cullinan', 'Spectre'],
    'bugatti': ['Chiron', 'Veyron', 'Divo'],
    'gmc': ['Sierra', 'Canyon', 'Yukon', 'Terrain', 'Acadia'],
    'cadillac': ['CT4', 'CT5', 'CT6', 'XT4', 'XT5', 'XT6', 'Escalade', 'Lyriq'],
    'buick': ['Encore', 'Envision', 'Enclave', 'Regal'],
    'lincoln': ['Corsair', 'Nautilus', 'Aviator', 'Navigator'],
    'ram': ['1500', '2500', '3500', 'ProMaster'],
    'hummer': ['EV', 'H2', 'H3'],
    'saab': ['9-3', '9-5'],
    'lancia': ['Ypsilon', 'Delta', 'Musa', 'Thema'],
    'alpine': ['A110'],
    'greatwall': ['Steed', 'Voleex C10'],
    'proton': ['Persona', 'Saga', 'Exora', 'Preve'],
    'perodua': ['Myvi', 'Axia', 'Bezza', 'Aruz']
  };

  // FULL ENGINE DATABASE - matches main.js exactly
  const MANUFACTURER_ENGINES = {
    'audi': ['1.6 TDI - 90hp', '1.6 TDI - 95hp', '1.6 TDI - 105hp', '1.6 TDI - 116hp', '2.0 TDI - 136hp', '2.0 TDI - 140hp', '2.0 TDI - 143hp', '2.0 TDI - 150hp', '2.0 TDI - 170hp', '2.0 TDI - 190hp', '2.0 TDI - 200hp', '2.0 TDI - 204hp', '3.0 TDI - 204hp', '3.0 TDI - 218hp', '3.0 TDI - 231hp', '3.0 TDI - 272hp', '1.0 TFSI - 82hp', '1.0 TFSI - 95hp', '1.0 TFSI - 110hp', '1.0 TFSI - 115hp', '1.0 TFSI - 116hp', '1.2 TFSI - 86hp', '1.4 TFSI - 122hp', '1.4 TFSI - 125hp', '1.4 TFSI - 140hp', '1.4 TFSI - 150hp', '1.5 TFSI - 150hp', '1.8 T - 150hp', '1.8 T - 163hp', '1.8 T - 180hp', '1.8 TFSI - 160hp', '1.8 TFSI - 170hp', '1.8 TFSI - 180hp', '1.8 TFSI - 192hp', '2.0 TFSI - 190hp', '2.0 TFSI - 200hp', '2.0 TFSI - 245hp', '2.0 TFSI - 300hp', '2.5 TFSI - 400hp', '3.0 TFSI - 340hp', '3.0 V6 - 220hp'],
    'volkswagen': ['1.6 TDI - 105hp', '1.6 TDI - 116hp', '2.0 TDI - 136hp', '2.0 TDI - 140hp', '2.0 TDI - 150hp', '2.0 TDI - 184hp', '2.0 TDI - 190hp', '3.0 TDI - 204hp', '3.0 TDI - 286hp', '1.0 TSI - 95hp', '1.0 TSI - 115hp', '1.4 TSI - 125hp', '1.4 TSI - 150hp', '1.5 TSI - 130hp', '1.5 TSI - 150hp', '1.8 T - 150hp', '1.8 T - 180hp', '1.8 TSI - 160hp', '1.8 TSI - 180hp', '2.0 TSI - 190hp', '2.0 TSI - 245hp', '2.0 TSI - 300hp'],
    'seat': ['1.6 TDI - 105hp', '1.6 TDI - 116hp', '2.0 TDI - 143hp', '2.0 TDI - 150hp', '2.0 TDI - 184hp', '1.0 TSI - 95hp', '1.0 TSI - 115hp', '1.4 TSI - 125hp', '1.4 TSI - 150hp', '1.5 TSI - 130hp', '1.5 TSI - 150hp', '1.8 T - 150hp', '1.8 T - 180hp', '1.8 TSI - 160hp', '1.8 TSI - 180hp', '2.0 TSI - 190hp', '2.0 TSI - 245hp', '2.0 TSI - 300hp'],
    'skoda': ['1.6 TDI - 105hp', '1.6 TDI - 116hp', '2.0 TDI - 143hp', '2.0 TDI - 150hp', '2.0 TDI - 200hp', '1.0 TSI - 95hp', '1.0 TSI - 110hp', '1.4 TSI - 125hp', '1.4 TSI - 150hp', '1.5 TSI - 150hp', '1.8 T - 150hp', '1.8 T - 180hp', '1.8 TSI - 160hp', '1.8 TSI - 180hp', '2.0 TSI - 190hp', '2.0 TSI - 245hp'],
    'fiat': ['1.3 MultiJet - 75hp', '1.3 MultiJet - 95hp', '1.6 MultiJet - 105hp', '1.6 MultiJet - 120hp', '2.0 MultiJet - 140hp', '2.0 MultiJet - 170hp', '0.9 TwinAir - 85hp', '1.0 FireFly - 70hp', '1.0 FireFly - 100hp', '1.4 MultiAir - 95hp', '1.4 MultiAir - 120hp', '1.4 T-Jet - 120hp', '1.4 T-Jet - 150hp', '1.6 MultiJet II - 120hp', '2.0 MultiJet II - 170hp'],
    'alfa-romeo': ['1.3 JTDm - 95hp', '1.6 JTDm - 105hp', '1.6 JTDm - 120hp', '2.0 JTDm - 136hp', '2.0 JTDm - 150hp', '2.0 JTDm - 180hp', '2.2 JTD - 136hp', '2.2 JTD - 150hp', '2.2 JTD - 180hp', '1.4 TB MultiAir - 120hp', '1.4 TB MultiAir - 140hp', '1.4 TB MultiAir - 170hp', '1.8 TBi - 200hp', '2.0 TB - 200hp', '2.0 TB - 280hp', '2.9 V6 Bi-Turbo - 510hp'],
    'bmw': ['1.6d - 116hp', '2.0d - 150hp', '2.0d - 163hp', '2.0d - 190hp', '2.0d - 204hp', '3.0d - 218hp', '3.0d - 249hp', '3.0d - 265hp', '3.0d - 286hp', '1.5i - 136hp', '2.0i - 184hp', '2.0i - 252hp', '3.0i - 258hp', '3.0i - 340hp', '3.0i - 374hp', '4.4 V8 - 530hp'],
    'mercedes': ['1.5 CDI - 116hp', '1.6 CDI - 136hp', '2.0 CDI - 136hp', '2.0 CDI - 163hp', '2.0 CDI - 190hp', '2.1 CDI - 136hp', '2.1 CDI - 170hp', '2.2 CDI - 170hp', '3.0 CDI - 204hp', '3.0 CDI - 231hp', '3.0 CDI - 258hp', '1.3 - 136hp', '1.5 - 156hp', '1.6 - 122hp', '2.0 - 184hp', '2.0 - 211hp', '2.0 - 258hp', '3.0 V6 - 367hp'],
    'ford': ['1.5 TDCi - 95hp', '1.5 TDCi - 120hp', '1.6 TDCi - 95hp', '1.6 TDCi - 115hp', '2.0 TDCi - 150hp', '2.0 TDCi - 170hp', '2.0 TDCi - 185hp', '2.0 Bi-Turbo - 213hp', '1.0 EcoBoost - 100hp', '1.0 EcoBoost - 125hp', '1.0 EcoBoost - 140hp', '1.5 EcoBoost - 150hp', '1.5 EcoBoost - 182hp', '2.0 EcoBoost - 245hp', '2.3 EcoBoost - 280hp', '2.7 EcoBoost V6 - 325hp'],
    'vauxhall': ['1.5 Turbo D - 102hp', '1.5 Turbo D - 120hp', '1.6 CDTI - 110hp', '1.6 CDTI - 136hp', '2.0 CDTI - 170hp', '1.0 Turbo - 105hp', '1.2 Turbo - 110hp', '1.2 Turbo - 130hp', '1.4 Turbo - 125hp', '1.4 Turbo - 145hp', '1.6 Turbo - 200hp', '2.0 Turbo - 230hp'],
    'land-rover': ['2.0 D - 163hp', '2.0 D - 180hp', '2.0 D - 204hp', '2.0 D - 240hp', '3.0 D - 249hp', '3.0 D - 300hp', '2.0 P - 200hp', '2.0 P - 249hp', '2.0 P - 300hp', '3.0 P - 360hp', '3.0 P - 400hp', '5.0 V8 - 525hp'],
    'peugeot': ['1.5 BlueHDi - 100hp', '1.5 BlueHDi - 130hp', '1.6 BlueHDi - 100hp', '1.6 BlueHDi - 120hp', '2.0 BlueHDi - 150hp', '2.0 BlueHDi - 180hp', '1.2 PureTech - 100hp', '1.2 PureTech - 110hp', '1.2 PureTech - 130hp', '1.6 PureTech - 165hp', '1.6 PureTech - 180hp'],
    'renault': ['1.5 dCi - 75hp', '1.5 dCi - 85hp', '1.5 dCi - 90hp', '1.5 dCi - 95hp', '1.5 dCi - 110hp', '1.5 Blue dCi - 115hp', '1.6 dCi - 130hp', '1.7 Blue dCi - 150hp', '2.0 dCi - 150hp', '2.0 dCi - 160hp', '0.9 TCe - 90hp', '1.0 SCe - 65hp', '1.0 SCe - 75hp', '1.0 TCe - 90hp', '1.0 TCe - 100hp', '1.2 TCe - 115hp', '1.2 TCe - 120hp', '1.3 TCe - 130hp', '1.3 TCe - 140hp', '1.3 TCe - 155hp', '1.3 TCe - 160hp', '1.6 TCe - 165hp', '1.6 TCe - 190hp', '1.8 TCe - 280hp'],
    'citroen': ['1.5 BlueHDi - 100hp', '1.5 BlueHDi - 130hp', '1.6 BlueHDi - 100hp', '1.6 BlueHDi - 120hp', '2.0 BlueHDi - 150hp', '2.0 BlueHDi - 180hp', '1.2 PureTech - 82hp', '1.2 PureTech - 110hp', '1.2 PureTech - 130hp', '1.6 PureTech - 165hp'],
    'nissan': ['1.5 dCi - 90hp', '1.5 dCi - 110hp', '1.6 dCi - 130hp', '2.0 dCi - 150hp', '2.0 dCi - 177hp', '0.9 IG-T - 90hp', '1.0 DIG-T - 100hp', '1.2 DIG-T - 115hp', '1.3 DIG-T - 140hp', '1.3 DIG-T - 160hp', '1.6 DIG-T - 163hp', '2.0 - 144hp'],
    'toyota': ['1.4 D-4D - 90hp', '1.6 D-4D - 112hp', '2.0 D-4D - 116hp', '2.0 D-4D - 143hp', '2.2 D-4D - 150hp', '2.2 D-4D - 177hp', '1.0 VVT-i - 72hp', '1.2 Turbo - 116hp', '1.5 VVT-i - 111hp', '1.8 VVT-i - 140hp', '2.0 VVT-i - 152hp', '2.5 Hybrid - 184hp', '3.5 V6 - 299hp'],
    'honda': ['1.6 i-DTEC - 120hp', '2.2 i-DTEC - 150hp', '2.2 i-DTEC - 160hp', '1.0 VTEC Turbo - 129hp', '1.5 VTEC Turbo - 182hp', '1.5 i-VTEC - 130hp', '1.8 i-VTEC - 142hp', '2.0 i-VTEC - 158hp', '2.0 VTEC Turbo - 320hp'],
    'mazda': ['1.5 SKYACTIV-D - 105hp', '1.8 SKYACTIV-D - 116hp', '2.2 SKYACTIV-D - 150hp', '2.2 SKYACTIV-D - 184hp', '1.5 SKYACTIV-G - 90hp', '1.5 SKYACTIV-G - 120hp', '2.0 SKYACTIV-G - 122hp', '2.0 SKYACTIV-G - 165hp', '2.5 SKYACTIV-G - 194hp'],
    'hyundai': ['1.5 CRDi - 110hp', '1.6 CRDi - 115hp', '1.6 CRDi - 136hp', '2.0 CRDi - 185hp', '1.0 T-GDi - 100hp', '1.0 T-GDi - 120hp', '1.4 T-GDi - 140hp', '1.6 T-GDi - 177hp', '1.6 T-GDi - 204hp', '2.0 T-GDi - 245hp'],
    'kia': ['1.5 CRDi - 110hp', '1.6 CRDi - 115hp', '1.6 CRDi - 136hp', '2.0 CRDi - 185hp', '1.0 T-GDi - 100hp', '1.0 T-GDi - 120hp', '1.4 T-GDi - 140hp', '1.6 T-GDi - 177hp', '1.6 T-GDi - 204hp', '2.0 T-GDi - 245hp'],
    'porsche': ['3.0 Diesel - 245hp', '3.0 Diesel - 262hp', '4.0 Diesel - 421hp', '2.0 - 300hp', '2.5 - 365hp', '3.0 - 340hp', '3.0 - 385hp', '3.0 - 450hp', '4.0 - 500hp', '4.0 - 550hp'],
    'jaguar': ['2.0 D - 163hp', '2.0 D - 180hp', '2.0 D - 204hp', '3.0 D - 300hp', '2.0 P - 200hp', '2.0 P - 250hp', '2.0 P - 300hp', '3.0 P - 340hp', '3.0 P - 380hp', '5.0 V8 - 575hp'],
    'volvo': ['2.0 D3 - 150hp', '2.0 D4 - 190hp', '2.0 D5 - 235hp', '2.0 T4 - 190hp', '2.0 T5 - 250hp', '2.0 T6 - 310hp', '2.0 T8 Hybrid - 390hp']
  };

  const GENERIC_ENGINES = ['1.0 - 70hp', '1.2 - 80hp', '1.4 - 90hp', '1.5 - 100hp', '1.6 - 110hp', '1.8 - 140hp', '2.0 - 150hp', '2.0 - 180hp', '2.2 - 150hp', '2.5 - 200hp', '3.0 - 250hp'];

  // Year-specific engine database (matches main.js VEHICLE_ENGINE_DATABASE)
  const VEHICLE_ENGINE_DATABASE = {
    'audi': {
      'a3': {
        '2003-2005': ['1.6 - 102hp', '2.0 FSI - 150hp', '3.2 V6 - 250hp', '1.9 TDI - 105hp', '2.0 TDI - 140hp'],
        '2006-2008': ['1.6 - 102hp', '2.0 FSI - 150hp', '2.0 TFSI - 200hp', '1.9 TDI - 105hp', '2.0 TDI - 140hp', '2.0 TDI - 170hp'],
        '2009-2012': ['1.2 TFSI - 105hp', '1.4 TFSI - 125hp', '1.8 TFSI - 160hp', '2.0 TFSI - 200hp', '1.6 TDI - 105hp', '2.0 TDI - 140hp', '2.0 TDI - 170hp'],
        '2013-2016': ['1.0 TFSI - 115hp', '1.4 TFSI - 125hp', '1.4 TFSI - 150hp', '1.8 TFSI - 180hp', '2.0 TFSI - 190hp', '1.6 TDI - 110hp', '2.0 TDI - 150hp', '2.0 TDI - 184hp'],
        '2017-2020': ['1.0 TFSI - 116hp', '1.5 TFSI - 150hp', '2.0 TFSI - 190hp', '2.0 TFSI - 310hp', '1.6 TDI - 116hp', '2.0 TDI - 150hp', '2.0 TDI - 184hp'],
        '2021-2024': ['1.5 TFSI - 150hp', '2.0 TFSI - 190hp', '2.0 TFSI - 310hp', '2.0 TDI - 150hp', '2.0 TDI - 200hp']
      },
      'a4': {
        '1995-2000': ['1.6 - 100hp', '1.8 - 125hp', '1.8 T - 150hp', '1.8 T - 180hp', '2.4 V6 - 165hp', '1.9 TDI - 90hp', '1.9 TDI - 110hp', '2.5 TDI - 150hp'],
        '2001-2004': ['1.8 T - 163hp', '2.0 - 130hp', '3.0 V6 - 220hp', '1.9 TDI - 130hp', '2.5 TDI - 155hp'],
        '2005-2008': ['1.8 T - 163hp', '2.0 - 130hp', '3.0 V6 - 220hp', '1.9 TDI - 116hp', '2.0 TDI - 140hp', '2.7 TDI - 180hp', '3.0 TDI - 204hp'],
        '2009-2012': ['1.8 TFSI - 120hp', '1.8 TFSI - 160hp', '2.0 TFSI - 180hp', '2.0 TFSI - 211hp', '2.0 TDI - 143hp', '2.0 TDI - 170hp', '3.0 TDI - 240hp'],
        '2013-2016': ['1.8 TFSI - 170hp', '2.0 TFSI - 225hp', '2.0 TFSI - 252hp', '2.0 TDI - 150hp', '2.0 TDI - 190hp', '3.0 TDI - 218hp', '3.0 TDI - 272hp'],
        '2017-2019': ['1.4 TFSI - 150hp', '2.0 TFSI - 190hp', '2.0 TFSI - 252hp', '2.0 TDI - 150hp', '2.0 TDI - 190hp', '3.0 TDI - 218hp', '3.0 TDI - 286hp'],
        '2020-2024': ['2.0 TFSI - 204hp', '2.0 TFSI - 265hp', '2.0 TDI - 163hp', '2.0 TDI - 204hp', '3.0 TDI - 231hp']
      },
      'q5': {
        '2009-2012': ['2.0 TFSI - 211hp', '3.0 TFSI - 272hp', '2.0 TDI - 143hp', '2.0 TDI - 170hp', '3.0 TDI - 240hp'],
        '2013-2016': ['2.0 TFSI - 220hp', '2.0 TFSI - 230hp', '2.0 TDI - 150hp', '2.0 TDI - 190hp', '3.0 TDI - 258hp'],
        '2017-2024': ['2.0 TFSI - 252hp', '3.0 TFSI - 354hp', '2.0 TDI - 190hp', '3.0 TDI - 286hp']
      }
    },
    'volkswagen': {
      'golf': {
        '1998-2003': ['1.4 - 75hp', '1.6 - 100hp', '1.8 - 125hp', '1.8T GTI - 180hp', '1.9 TDI - 90hp', '1.9 TDI - 110hp', '1.9 TDI - 130hp', '1.9 TDI - 150hp'],
        '2004-2008': ['1.4 - 75hp', '1.6 - 102hp', '2.0 FSI - 150hp', '2.0 GTI - 200hp', '1.9 TDI - 90hp', '1.9 TDI - 105hp', '2.0 TDI - 140hp', '2.0 GTD - 170hp'],
        '2009-2012': ['1.2 TSI - 85hp', '1.2 TSI - 105hp', '1.4 TSI - 122hp', '1.4 TSI - 160hp', '2.0 TSI GTI - 210hp', '1.6 TDI - 90hp', '1.6 TDI - 105hp', '2.0 TDI - 110hp', '2.0 TDI - 140hp', '2.0 GTD - 170hp'],
        '2013-2016': ['1.0 TSI - 85hp', '1.2 TSI - 105hp', '1.4 TSI - 125hp', '1.4 TSI - 150hp', '2.0 TSI GTI - 220hp', '2.0 TSI R - 300hp', '1.6 TDI - 90hp', '1.6 TDI - 110hp', '2.0 TDI - 150hp', '2.0 GTD - 184hp'],
        '2017-2020': ['1.0 TSI - 90hp', '1.0 TSI - 115hp', '1.5 TSI - 130hp', '1.5 TSI - 150hp', '2.0 TSI GTI - 245hp', '2.0 TSI R - 310hp', '1.6 TDI - 115hp', '2.0 TDI - 150hp', '2.0 GTD - 200hp'],
        '2021-2024': ['1.0 eTSI - 110hp', '1.5 eTSI - 130hp', '1.5 eTSI - 150hp', '2.0 TSI GTI - 245hp', '2.0 TSI R - 320hp', '2.0 TDI - 150hp', '2.0 GTD - 200hp']
      },
      'polo': {
        '2002-2009': ['1.2 - 55hp', '1.2 - 64hp', '1.4 - 75hp', '1.6 - 105hp', '1.4 TDI - 70hp', '1.4 TDI - 80hp', '1.9 TDI - 100hp'],
        '2010-2017': ['1.0 - 60hp', '1.0 - 75hp', '1.2 TSI - 90hp', '1.2 TSI - 110hp', '1.4 TSI GTI - 180hp', '1.2 TDI - 75hp', '1.6 TDI - 90hp', '1.6 TDI - 105hp'],
        '2018-2024': ['1.0 TSI - 80hp', '1.0 TSI - 95hp', '1.0 TSI - 110hp', '2.0 TSI GTI - 207hp', '1.6 TDI - 80hp', '1.6 TDI - 95hp']
      },
      'passat': {
        '2005-2010': ['1.6 - 102hp', '1.8 TSI - 160hp', '2.0 FSI - 150hp', '1.9 TDI - 105hp', '2.0 TDI - 140hp', '2.0 TDI - 170hp'],
        '2011-2014': ['1.4 TSI - 122hp', '1.8 TSI - 160hp', '2.0 TSI - 210hp', '1.6 TDI - 105hp', '2.0 TDI - 140hp', '2.0 TDI - 170hp', '2.0 TDI - 177hp'],
        '2015-2019': ['1.4 TSI - 125hp', '1.8 TSI - 180hp', '2.0 TSI - 220hp', '1.6 TDI - 120hp', '2.0 TDI - 150hp', '2.0 TDI - 190hp', '2.0 TDI BiTurbo - 240hp'],
        '2020-2024': ['1.5 TSI - 150hp', '2.0 TSI - 190hp', '2.0 TDI - 150hp', '2.0 TDI - 200hp']
      },
      'tiguan': {
        '2008-2011': ['1.4 TSI - 150hp', '2.0 TSI - 170hp', '2.0 TSI - 200hp', '2.0 TDI - 140hp', '2.0 TDI - 170hp'],
        '2012-2016': ['1.4 TSI - 125hp', '1.4 TSI - 150hp', '2.0 TSI - 180hp', '2.0 TSI - 220hp', '2.0 TDI - 110hp', '2.0 TDI - 140hp', '2.0 TDI - 150hp', '2.0 TDI - 184hp'],
        '2017-2020': ['1.5 TSI - 150hp', '2.0 TSI - 180hp', '2.0 TSI - 220hp', '2.0 TDI - 150hp', '2.0 TDI - 190hp', '2.0 TDI BiTurbo - 240hp'],
        '2021-2024': ['1.5 TSI - 150hp', '2.0 TSI - 190hp', '2.0 TSI - 245hp', '2.0 TDI - 150hp', '2.0 TDI - 200hp']
      }
    },
    'bmw': {
      '3-series': {
        '1999-2005': ['1.8 316i - 105hp', '2.0 320i - 150hp', '2.5 325i - 192hp', '3.0 330i - 231hp', '2.0 318d - 116hp', '2.0 320d - 150hp', '3.0 330d - 204hp'],
        '2005-2011': ['2.0 316i - 122hp', '2.0 318i - 129hp', '2.0 320i - 170hp', '3.0 325i - 218hp', '3.0 330i - 272hp', '2.0 318d - 143hp', '2.0 320d - 184hp', '3.0 330d - 245hp'],
        '2012-2018': ['1.6 316i - 136hp', '2.0 320i - 184hp', '2.0 328i - 245hp', '3.0 335i - 306hp', '2.0 318d - 150hp', '2.0 320d - 190hp', '3.0 330d - 258hp'],
        '2019-2024': ['2.0 320i - 184hp', '2.0 330i - 258hp', '3.0 M340i - 374hp', '2.0 318d - 150hp', '2.0 320d - 190hp', '3.0 330d - 286hp']
      },
      '5-series': {
        '2005-2010': ['2.0 520i - 170hp', '2.5 523i - 190hp', '3.0 530i - 272hp', '2.0 520d - 177hp', '3.0 530d - 235hp', '3.0 535d - 286hp'],
        '2011-2016': ['2.0 520i - 184hp', '3.0 528i - 245hp', '3.0 535i - 306hp', '2.0 520d - 184hp', '3.0 530d - 258hp', '3.0 535d - 313hp'],
        '2017-2023': ['2.0 520i - 184hp', '2.0 530i - 252hp', '3.0 540i - 340hp', '2.0 520d - 190hp', '3.0 530d - 265hp', '3.0 540d - 320hp'],
        '2024': ['2.0 520i - 184hp', '2.0 530i - 252hp', '3.0 540i - 340hp', '2.0 520d - 190hp', '3.0 530d - 286hp']
      },
      'x3': {
        '2005-2010': ['2.0 xDrive20i - 150hp', '2.5 xDrive25i - 218hp', '3.0 xDrive30i - 272hp', '2.0 xDrive18d - 143hp', '2.0 xDrive20d - 177hp', '3.0 xDrive30d - 235hp'],
        '2011-2017': ['2.0 xDrive20i - 184hp', '2.0 xDrive28i - 245hp', '3.0 xDrive35i - 306hp', '2.0 xDrive18d - 143hp', '2.0 xDrive20d - 184hp', '3.0 xDrive30d - 258hp', '3.0 xDrive35d - 313hp'],
        '2018-2024': ['2.0 xDrive20i - 184hp', '2.0 xDrive30i - 252hp', '3.0 M40i - 360hp', '2.0 xDrive18d - 150hp', '2.0 xDrive20d - 190hp', '3.0 xDrive30d - 286hp']
      }
    },
    'ford': {
      'focus': {
        '2005-2010': ['1.4 - 80hp', '1.6 - 100hp', '1.8 - 125hp', '2.0 - 145hp', '2.5 ST - 225hp', '1.6 TDCi - 90hp', '1.6 TDCi - 109hp', '1.8 TDCi - 115hp', '2.0 TDCi - 136hp'],
        '2011-2014': ['1.0 EcoBoost - 100hp', '1.0 EcoBoost - 125hp', '1.6 - 105hp', '2.0 ST - 250hp', '1.6 TDCi - 95hp', '1.6 TDCi - 115hp', '2.0 TDCi - 140hp', '2.0 TDCi - 163hp'],
        '2015-2018': ['1.0 EcoBoost - 100hp', '1.0 EcoBoost - 125hp', '1.5 EcoBoost - 150hp', '1.5 EcoBoost - 182hp', '2.3 EcoBoost RS - 350hp', '1.5 TDCi - 95hp', '1.5 TDCi - 120hp', '2.0 TDCi - 150hp', '2.0 TDCi - 185hp'],
        '2019-2024': ['1.0 EcoBoost - 100hp', '1.0 EcoBoost - 125hp', '1.5 EcoBoost - 150hp', '2.3 EcoBoost ST - 280hp', '1.5 EcoBlue - 95hp', '1.5 EcoBlue - 120hp', '2.0 EcoBlue - 150hp']
      },
      'fiesta': {
        '2009-2012': ['1.25 - 82hp', '1.4 - 96hp', '1.6 - 120hp', '1.6 ST - 182hp', '1.4 TDCi - 70hp', '1.6 TDCi - 75hp', '1.6 TDCi - 95hp'],
        '2013-2017': ['1.0 EcoBoost - 100hp', '1.0 EcoBoost - 125hp', '1.0 EcoBoost - 140hp', '1.6 ST - 182hp', '1.5 TDCi - 75hp', '1.5 TDCi - 95hp'],
        '2018-2023': ['1.0 EcoBoost - 85hp', '1.0 EcoBoost - 100hp', '1.0 EcoBoost - 125hp', '1.5 EcoBoost ST - 200hp', '1.5 TDCi - 85hp', '1.5 TDCi - 120hp']
      },
      'kuga': {
        '2008-2012': ['1.6 EcoBoost - 150hp', '2.0 - 145hp', '2.0 TDCi - 136hp', '2.0 TDCi - 163hp'],
        '2013-2019': ['1.5 EcoBoost - 120hp', '1.5 EcoBoost - 150hp', '1.5 EcoBoost - 182hp', '1.5 TDCi - 120hp', '2.0 TDCi - 120hp', '2.0 TDCi - 150hp', '2.0 TDCi - 180hp'],
        '2020-2024': ['1.5 EcoBoost - 120hp', '1.5 EcoBoost - 150hp', '2.5 PHEV - 225hp', '1.5 EcoBlue - 120hp', '2.0 EcoBlue - 150hp', '2.0 EcoBlue - 190hp']
      }
    },
    'mercedes': {
      'a-class': {
        '2013-2018': ['1.6 A180 - 122hp', '2.0 A200 - 156hp', '2.0 A250 - 211hp', '2.0 A45 AMG - 360hp', '1.5 A180d - 109hp', '2.1 A200d - 136hp', '2.1 A220d - 177hp'],
        '2019-2024': ['1.3 A180 - 136hp', '2.0 A200 - 163hp', '2.0 A250 - 224hp', '2.0 A35 AMG - 306hp', '2.0 A45 AMG - 421hp', '1.5 A180d - 116hp', '2.0 A200d - 150hp', '2.0 A220d - 190hp']
      },
      'c-class': {
        '2008-2014': ['1.8 C180 - 156hp', '1.8 C200 - 184hp', '3.5 C350 - 306hp', '6.2 C63 AMG - 457hp', '2.1 C200 CDI - 136hp', '2.1 C220 CDI - 170hp', '3.0 C320 CDI - 231hp'],
        '2015-2021': ['1.6 C160 - 129hp', '2.0 C200 - 184hp', '2.0 C300 - 245hp', '4.0 C63 AMG - 476hp', '1.6 C200d - 136hp', '2.1 C220d - 170hp', '2.1 C300d - 204hp'],
        '2022-2024': ['1.5 C180 - 170hp', '2.0 C200 - 204hp', '2.0 C300 - 258hp', '2.0 C200d - 163hp', '2.0 C220d - 200hp', '3.0 C300d - 265hp']
      },
      'glc': {
        '2016-2019': ['2.0 GLC200 - 184hp', '2.0 GLC250 - 211hp', '2.0 GLC300 - 245hp', '3.0 GLC43 AMG - 367hp', '2.1 GLC220d - 170hp', '2.1 GLC250d - 204hp', '3.0 GLC350d - 258hp'],
        '2020-2024': ['2.0 GLC200 - 197hp', '2.0 GLC300 - 258hp', '3.0 GLC43 AMG - 390hp', '4.0 GLC63 AMG - 476hp', '2.0 GLC200d - 163hp', '2.0 GLC220d - 194hp', '2.0 GLC300d - 245hp']
      }
    }
  };

  res.json({
    models: VEHICLE_DATABASE,
    engines: MANUFACTURER_ENGINES,
    genericEngines: GENERIC_ENGINES,
    yearEngines: VEHICLE_ENGINE_DATABASE
  });
});

// Create Stripe checkout session for top-ups
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    if (!stripeConfigured) {
      console.error('Stripe not configured - STRIPE_SECRET_KEY missing or invalid');
      return res.status(500).json({ 
        error: 'Stripe not configured. Please set STRIPE_SECRET_KEY environment variable with a valid Stripe secret key (starts with sk_)' 
      });
    }

    const { amount, userId, userEmail } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: 'Carnage Remaps Credit Top-Up',
              description: `Add £${amount.toFixed(2)} to your account`,
              images: ['https://your-domain.com/logo.png'], // Optional: Add your logo URL
            },
            unit_amount: Math.round(amount * 100), // Convert to pence
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
app.post('/api/create-subscription-session', async (req, res) => {
  try {
    if (!stripeConfigured) {
      console.error('Stripe not configured - STRIPE_SECRET_KEY missing or invalid');
      return res.status(500).json({ 
        error: 'Stripe not configured. Please set STRIPE_SECRET_KEY environment variable with a valid Stripe secret key (starts with sk_)' 
      });
    }

    const { priceId, userId, userEmail } = req.body;

    if (!priceId) {
      return res.status(400).json({ error: 'Price ID required' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId, // Use your Stripe price ID for the subscription
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.origin || 'http://localhost:3000'}?subscription=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin || 'http://localhost:3000'}?subscription=cancelled`,
      customer_email: userEmail,
      metadata: {
        userId: userId?.toString() || '',
        type: 'subscription',
      },
    });

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
    
    const { userId, email, userName, type, amount, periodStart, periodEnd } = req.body;
    
    if (!email || !type) {
      return res.status(400).json({ error: 'Email and subscription type required' });
    }
    
    // Generate a unique ID for wallet subscriptions
    const walletSubId = 'wallet_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    // Upsert subscription (update if exists, insert if not)
    const { data, error } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId || null,
        email: email,
        stripe_customer_id: null,
        stripe_subscription_id: walletSubId,
        type: type,
        status: 'active',
        price_amount: Math.round(amount * 100), // Store in pence
        currency: 'gbp',
        current_period_start: periodStart,
        current_period_end: periodEnd,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'email,type',
        ignoreDuplicates: false
      });
    
    if (error) {
      // If upsert fails due to unique constraint, try update instead
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({
          status: 'active',
          price_amount: Math.round(amount * 100),
          current_period_start: periodStart,
          current_period_end: periodEnd,
          updated_at: new Date().toISOString()
        })
        .eq('email', email)
        .eq('type', type);
      
      if (updateError) {
        console.error('Failed to save wallet subscription:', updateError);
        return res.status(500).json({ error: 'Failed to activate subscription' });
      }
    }
    
    console.log('✅ Wallet subscription activated for:', email);
    
    // Log transaction
    await supabase
      .from('transactions')
      .insert({
        user_id: userId || null,
        email: email,
        type: 'wallet_subscription',
        amount: amount,
        status: 'completed',
        description: `Embed widget subscription (1 month) - paid from wallet`,
        created_at: new Date().toISOString()
      });
    
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

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Carnage Remaps API Server running on http://localhost:${PORT}`);
  console.log(`📝 API Endpoints:`);
  console.log(`   - POST http://localhost:${PORT}/api/create-checkout-session`);
  console.log(`   - POST http://localhost:${PORT}/api/create-subscription-session`);
  console.log(`   - POST http://localhost:${PORT}/api/webhook`);
  console.log(`   - POST http://localhost:${PORT}/api/verify-payment`);
  console.log(`\n⚠️  Don't forget to set your Stripe keys in .env file!\n`);
});
