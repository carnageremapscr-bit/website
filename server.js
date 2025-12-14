require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'your_stripe_secret_key_here');

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
  res.json({ status: 'ok', message: 'Carnage Remaps API Server Running' });
});

// Create Stripe checkout session for top-ups
app.post('/api/create-checkout-session', async (req, res) => {
  try {
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
