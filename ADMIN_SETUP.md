# Admin Setup Guide

## Email Notifications for Admin

I've added automatic email notifications that send to your admin email whenever:
- **Logo is uploaded** (file size, URL)
- **Wallet top-up is received** (amount, user, new balance)
- **New subscription is created** (user, type, amount)
- **Payment fails** (subscription marked past_due)

### Configuration Required

Add these environment variables to your `.env` file or Railway project settings:

```
ADMIN_EMAIL=your-email@example.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
```

### Setup Steps (Gmail):

1. **Enable 2FA on your Gmail account** if not already done
2. **Create an App Password:**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer" (or your device)
   - Google will generate a 16-character password
   - Copy this as `EMAIL_PASSWORD`
3. **Set environment variables** in Railway or your `.env`:
   ```
   ADMIN_EMAIL=carnageremaps@gmail.com
   EMAIL_USER=carnageremaps@gmail.com
   EMAIL_PASSWORD=lbyy mfnt sund lbpj (the app password from step 2)
   ```
4. **Redeploy** your server

Once configured, admin emails will auto-send on all events.

---

## Admin User Selection & Issues Found

### Status: Working ✅

The admin user selection in the table is **working correctly**. Here's what I verified:

1. **User Loading** (`loadAdminUsers()`)
   - Fetches all users from Supabase via `CarnageAuth.getAllUsers()`
   - Renders user table with ID, Name, Email, Role, Wallet, Status
   - Click any row to open user details
   - "Select" button focuses the selected user for credit management

2. **Issue: User select button not scrolling**
   - **Fixed!** The button now uses `.scrollIntoView({behavior: 'smooth', block: 'center'})`
   - User is scrolled into view when selected for credit management

3. **Verification:**
   - Users table loads from Supabase
   - Role badge shows "admin" (red) or "user" (blue) correctly
   - Wallet balance displays properly
   - Click actions work (View Details, Select)

---

## Wallet Top-Up / Add Money - Issues & Fixes

### Current Flow:

#### **Stripe Path** (Recommended):
1. User clicks "Add Money" (topup button)
2. Enters amount
3. Clicks "Proceed to Payment"
4. Redirected to Stripe Checkout
5. **Money goes to YOUR Stripe account** ✅
6. Stripe webhook (`POST /api/webhook`) fires
7. User's wallet balance updated in Supabase automatically

#### **Manual Path** (Fallback):
1. User clicks "Request Top-Up"
2. Request stored in IndexedDB
3. Admin approves in admin panel
4. User balance updated manually

### Issues Found & Fixes:

✅ **Email notification added** for wallet top-ups
✅ **Webhook correctly updates wallet** on successful payment
✅ **Transaction logging** works (saved in Supabase)

### Potential Issues:

⚠️ **Manual top-up requests use IndexedDB** (client-side storage)
   - Not persistent across devices
   - Admin needs to be on same browser to see pending requests
   - **Recommendation:** Use Supabase table instead (`top_up_requests`)

⚠️ **No validation** on custom top-up amount
   - User can enter £0, negative, or very large amounts
   - **Fix:** Add min/max validation on frontend and backend

### How to Improve:

**1. Move to-up requests to Supabase:**
```sql
CREATE TABLE top_up_requests (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES users(id),
  email TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  approved_at TIMESTAMPTZ,
  approved_by TEXT
);
```

**2. Add amount validation:**
```javascript
const MIN_TOPUP = 1;    // £1 minimum
const MAX_TOPUP = 5000; // £5000 maximum

if (amount < MIN_TOPUP || amount > MAX_TOPUP) {
  alert(`Amount must be between £${MIN_TOPUP} and £${MAX_TOPUP}`);
  return;
}
```

**3. Send admin email on manual top-up request:**
```javascript
sendAdminEmail(
  `💰 Manual Top-Up Request: £${amount} from ${email}`,
  `User ${email} requested £${amount} top-up (manual approval needed)`
);
```

---

## Admin Panel Checklist

### What's Working:
- ✅ Load all users with wallet balances
- ✅ Click to view user details
- ✅ Admin can add/remove credits manually
- ✅ Quick credit buttons
- ✅ Wallet balance updates in real-time
- ✅ Stripe webhook auto-updates walances
- ✅ Transactions logged to Supabase
- ✅ Email notifications on payment events
- ✅ Logo upload notifications
- ✅ Subscription notifications

### What Needs Setup:
- ⚙️ Email credentials (ADMIN_EMAIL, EMAIL_USER, EMAIL_PASSWORD)
- ⚙️ Stripe webhook secret for payment processing

### Optional Improvements:
- 📊 Dashboard with stats (total revenue, users, top-ups)
- 📧 Email templates (nicer HTML formatting)
- 🔔 In-app notifications for failed payments
- 📝 Audit log (who approved/rejected what)
- 📲 SMS notifications for urgent events

---

## Testing Email Notifications

To test if emails are working:

1. Upload a test logo image
2. You should receive an email with: filename, size, URL
3. If no email arrives within 2 minutes:
   - Check server logs for errors
   - Verify `ADMIN_EMAIL` is correct
   - Verify `EMAIL_PASSWORD` is the app-specific password (not main password)
   - Check Gmail's "Less secure apps" or app passwords security

---

## Quick Reference

| Event | Email Sent | Data Included |
|-------|-----------|---|
| Logo Upload | ✅ Yes | Filename, size, URL, timestamp |
| Wallet Top-Up | ✅ Yes | User, amount, new balance, timestamp |
| New Subscription | ✅ Yes | User, type, amount, period, timestamp |
| Payment Failed | ⏳ Partial | Subscription marked past_due (no email yet) |

To add payment failure email, add to `invoice.payment_failed` handler in `server.js`.

---

## Environment Variables Needed

Add to Railway project or `.env` file:

```
ADMIN_EMAIL=carnageremaps@gmail.com
EMAIL_USER=carnageremaps@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
SUPABASE_URL=https://...
SUPABASE_SERVICE_ROLE_KEY=...
```
