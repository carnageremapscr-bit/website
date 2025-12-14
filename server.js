require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Check if Stripe key is configured
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
const stripeConfigured = STRIPE_KEY && STRIPE_KEY.startsWith('sk_');
const stripe = stripeConfigured ? require('stripe')(STRIPE_KEY) : null;

// Log configuration status on startup
console.log('=== Stripe Configuration ===');
console.log('STRIPE_SECRET_KEY set:', !!STRIPE_KEY);
console.log('Key starts with sk_:', STRIPE_KEY?.startsWith('sk_') || false);
console.log('Stripe configured:', stripeConfigured);
console.log('===========================');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
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
  maxAge: '1y',
  immutable: true,
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=3600');
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
    stripeConfigured: stripeConfigured
  });
});

// Vehicle Database API for embed widget
app.get('/api/vehicles', (req, res) => {
  // Enable CORS for embed widgets on external sites
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
  
  const VEHICLE_DATABASE = {
    'audi': ['A1', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q2', 'Q3', 'Q5', 'Q7', 'Q8', 'TT', 'R8', 'e-tron', 'Q4 e-tron', 'RS3', 'RS4', 'RS5', 'RS6', 'RS7', 'RSQ8'],
    'bmw': ['1 Series', '2 Series', '3 Series', '4 Series', '5 Series', '6 Series', '7 Series', '8 Series', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'Z4', 'i3', 'i4', 'i8', 'iX', 'M2', 'M3', 'M4', 'M5', 'M8', 'X3 M', 'X4 M', 'X5 M', 'X6 M'],
    'mercedes': ['A-Class', 'B-Class', 'C-Class', 'E-Class', 'S-Class', 'CLA', 'CLS', 'GLA', 'GLB', 'GLC', 'GLE', 'GLS', 'G-Class', 'SL', 'AMG GT', 'EQC', 'EQA', 'EQS', 'V-Class', 'Vito', 'Sprinter'],
    'volkswagen': ['Polo', 'Golf', 'Jetta', 'Passat', 'Arteon', 'T-Cross', 'T-Roc', 'Tiguan', 'Touareg', 'Caddy', 'Transporter', 'Crafter', 'ID.3', 'ID.4', 'Golf GTI', 'Golf R', 'Scirocco', 'Amarok'],
    'ford': ['Fiesta', 'Focus', 'Mondeo', 'Mustang', 'Puma', 'Kuga', 'Edge', 'Transit', 'Transit Custom', 'Ranger', 'S-Max', 'Fiesta ST', 'Focus ST', 'Focus RS'],
    'vauxhall': ['Corsa', 'Astra', 'Insignia', 'Mokka', 'Crossland', 'Grandland', 'Combo', 'Vivaro', 'Movano'],
    'land-rover': ['Defender', 'Discovery', 'Discovery Sport', 'Range Rover', 'Range Rover Sport', 'Range Rover Evoque', 'Range Rover Velar'],
    'nissan': ['Micra', 'Juke', 'Qashqai', 'X-Trail', 'Leaf', 'GT-R', 'Navara'],
    'toyota': ['Aygo', 'Yaris', 'Corolla', 'Prius', 'Camry', 'C-HR', 'RAV4', 'Land Cruiser', 'Hilux', 'Supra', 'Yaris GR'],
    'peugeot': ['208', '308', '508', '2008', '3008', '5008', 'Partner', 'Boxer', 'Expert'],
    'renault': ['Clio', 'Captur', 'Megane', 'Kadjar', 'Scenic', 'Kangoo', 'Trafic', 'Master', 'Zoe', 'Arkana'],
    'citroen': ['C1', 'C3', 'C4', 'C5', 'C3 Aircross', 'C5 Aircross', 'Berlingo', 'Dispatch', 'Relay'],
    'seat': ['Ibiza', 'Leon', 'Arona', 'Ateca', 'Tarraco', 'Leon Cupra'],
    'skoda': ['Fabia', 'Scala', 'Octavia', 'Superb', 'Kamiq', 'Karoq', 'Kodiaq', 'Octavia vRS'],
    'volvo': ['S60', 'S90', 'V40', 'V60', 'V90', 'XC40', 'XC60', 'XC90'],
    'mazda': ['Mazda2', 'Mazda3', 'Mazda6', 'CX-3', 'CX-30', 'CX-5', 'CX-60', 'MX-5'],
    'honda': ['Jazz', 'Civic', 'Accord', 'CR-V', 'HR-V', 'Civic Type R'],
    'hyundai': ['i10', 'i20', 'i30', 'i40', 'Kona', 'Tucson', 'Santa Fe', 'Ioniq 5', 'i30 N'],
    'kia': ['Picanto', 'Rio', 'Ceed', 'Stonic', 'Niro', 'Sportage', 'Sorento', 'EV6', 'Stinger'],
    'fiat': ['500', 'Panda', 'Tipo', '500X', 'Ducato', 'Doblo'],
    'alfa-romeo': ['Giulietta', 'Giulia', 'Stelvio', 'Tonale'],
    'jeep': ['Renegade', 'Compass', 'Cherokee', 'Grand Cherokee', 'Wrangler'],
    'mini': ['Hatch', 'Clubman', 'Countryman', 'JCW', 'Cooper S'],
    'porsche': ['718 Cayman', '718 Boxster', '911', 'Panamera', 'Macan', 'Cayenne', 'Taycan'],
    'jaguar': ['XE', 'XF', 'F-Type', 'E-Pace', 'F-Pace', 'I-Pace'],
    'cupra': ['Formentor', 'Leon', 'Ateca', 'Born']
  };

  const MANUFACTURER_ENGINES = {
    'audi': ['1.6 TDI - 105hp', '2.0 TDI - 150hp', '2.0 TDI - 190hp', '3.0 TDI - 272hp', '1.0 TFSI - 116hp', '1.5 TFSI - 150hp', '2.0 TFSI - 190hp', '2.0 TFSI - 245hp'],
    'volkswagen': ['1.6 TDI - 105hp', '2.0 TDI - 150hp', '2.0 TDI - 190hp', '1.0 TSI - 115hp', '1.5 TSI - 150hp', '2.0 TSI - 190hp', '2.0 TSI - 245hp', '2.0 TSI - 300hp'],
    'bmw': ['2.0d - 150hp', '2.0d - 190hp', '3.0d - 265hp', '2.0i - 184hp', '3.0i - 340hp', '4.4 V8 - 530hp'],
    'mercedes': ['2.0 CDI - 163hp', '2.0 CDI - 190hp', '3.0 CDI - 258hp', '2.0 - 184hp', '2.0 - 258hp', '3.0 V6 - 367hp'],
    'ford': ['1.5 TDCi - 120hp', '2.0 TDCi - 150hp', '1.0 EcoBoost - 125hp', '1.5 EcoBoost - 150hp', '2.0 EcoBoost - 245hp', '2.3 EcoBoost - 280hp'],
    'seat': ['1.6 TDI - 105hp', '2.0 TDI - 150hp', '1.0 TSI - 115hp', '1.5 TSI - 150hp', '2.0 TSI - 190hp', '2.0 TSI - 300hp'],
    'skoda': ['1.6 TDI - 105hp', '2.0 TDI - 150hp', '1.0 TSI - 110hp', '1.5 TSI - 150hp', '2.0 TSI - 190hp', '2.0 TSI - 245hp'],
    'porsche': ['2.0 - 300hp', '2.5 - 365hp', '3.0 - 385hp', '3.0 - 450hp', '4.0 - 500hp'],
    'volvo': ['2.0 D3 - 150hp', '2.0 D4 - 190hp', '2.0 T4 - 190hp', '2.0 T5 - 250hp', '2.0 T6 - 310hp']
  };

  const GENERIC_ENGINES = ['1.0 - 70hp', '1.2 - 90hp', '1.4 - 100hp', '1.6 - 120hp', '2.0 - 150hp', '2.0 - 180hp', '2.5 - 200hp', '3.0 - 250hp'];

  res.json({
    models: VEHICLE_DATABASE,
    engines: MANUFACTURER_ENGINES,
    genericEngines: GENERIC_ENGINES
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

// Stripe webhook endpoint (for handling payment events)
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Payment successful:', session);
      
      // Here you would:
      // 1. Get userId from session.metadata
      // 2. Add credits to user's account
      // 3. Update your database
      
      break;
    
    case 'invoice.paid':
      // Handle successful subscription payment
      console.log('Subscription payment received');
      break;
    
    case 'invoice.payment_failed':
      // Handle failed subscription payment
      console.log('Subscription payment failed');
      break;
    
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
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
