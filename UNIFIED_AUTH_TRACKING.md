# Unified Authentication & Tracking System

## Overview
This system provides unified authentication and tracking for both iframe embeds and API calls. Every user is identified by their email and authenticated with active subscription checks, regardless of whether they pre-created an iframe record or just embedded the widget directly.

## How It Works

### 1. Authentication Middleware (`authenticateIframeOrApi`)
Located in `server.js`, this middleware:
- Accepts authentication via `email` parameter OR `iframeId` parameter
- Auto-creates iframe records when a new email+URL combination is detected
- Checks if iframe is locked by admin
- Validates active subscription (vrm, embed, premium, or all-access types)
- Tracks access count and last accessed timestamp
- Attaches user info to request object for downstream use

### 2. Protected Endpoints
All API endpoints that access DVLA/vehicle data are now protected:

#### `/api/vrm-lookup` (Protected)
- **Parameters**: `vrm`, `email`, `iframeId` (email or iframeId required)
- **Authentication**: Via `authenticateIframeOrApi` middleware
- **Returns**: Vehicle data + `authenticatedUser` field
- **Logging**: Logs which user made the request

### 3. Widget Implementation

#### VRM Lookup Widget (`test-vrm.html`)
**URL Parameters:**
```
https://yoursite.com/test-vrm.html?email=user@example.com&iframeId=123
```

**Flow:**
1. Widget loads → extracts `email` and `iframeId` from URL
2. Checks subscription via `/api/check-vrm-subscription`
3. If locked or no subscription → shows overlay
4. User performs lookup → passes `email` + `iframeId` to `/api/vrm-lookup`
5. Backend authenticates → auto-creates iframe record if needed
6. Backend validates subscription → returns vehicle data

**Code Example:**
```javascript
const urlParams = new URLSearchParams(window.location.search);
const userEmail = urlParams.get('email');
const iframeId = urlParams.get('iframeId');

// On lookup
let url = `/api/vrm-lookup?vrm=${vrm}&email=${userEmail}&iframeId=${iframeId}`;
const resp = await fetch(url);
```

#### Vehicle Search Widget (`embed.html`)
Similar flow for embed widget - passes email/iframeId for tracking.

## Benefits

### ✅ Automatic Tracking
- No need to manually create iframe records before embedding
- System auto-creates records when new email+URL detected
- All usage automatically tracked in database

### ✅ Unified Authentication
- Both iframe embeds AND API calls authenticate the same way
- Single source of truth for access control
- Subscription check happens at API level, not just widget level

### ✅ Better Security
- Every API call requires valid email + active subscription
- Admins can lock specific iframes to disable access
- Prevents unauthorized API usage

### ✅ Usage Tracking
- Track access count per iframe
- Track last accessed timestamp
- Know exactly who's using your service

## Database Schema

### `iframes` Table
```sql
- id: Primary key
- email: User email (authentication)
- url: Where widget is embedded
- type: 'vrm-lookup' or 'embed-widget'
- status: 'active' or 'locked'
- created_at: When first created
- last_accessed: Last API call timestamp
- access_count: Number of API calls made
```

### `subscriptions` Table
```sql
- email: User email (matches iframes.email)
- type: 'vrm', 'embed', 'premium', 'all-access'
- status: 'active' or 'inactive'
- current_period_end: Subscription expiry date
```

## Usage Examples

### Example 1: New User Embeds Widget
1. User purchases VRM subscription for `john@example.com`
2. User embeds widget: `<iframe src="https://site.com/test-vrm.html?email=john@example.com">`
3. Widget loads → calls subscription check → finds active sub
4. User performs lookup → API call passes email
5. Backend: No iframe record found → **auto-creates** iframe record
6. Backend: Validates subscription → allows access
7. Result: Vehicle data returned + usage tracked

### Example 2: Existing User
1. iframe record already exists for `jane@example.com` at `https://theirsite.com`
2. User performs lookup on embedded widget
3. API call includes email → finds existing iframe record
4. Updates `last_accessed` and increments `access_count`
5. Validates subscription → returns data

### Example 3: Admin Locks iframe
1. Admin sees iframe #42 making too many requests
2. Admin clicks "Lock" button in admin panel
3. iframe status → 'locked'
4. Next API call → middleware checks status → returns 403 error
5. Widget shows "Access Denied" overlay

## Implementation Checklist

- [x] Create `authenticateIframeOrApi` middleware
- [x] Protect `/api/vrm-lookup` endpoint
- [x] Update `test-vrm.html` to pass email to API calls
- [x] Add auto-create iframe logic
- [x] Add access tracking (count + timestamp)
- [x] Add logging for debugging
- [ ] Update `embed.html` to pass email to API calls (if needed)
- [ ] Add rate limiting per email/iframe
- [ ] Add admin dashboard to view usage stats
- [ ] Add email alerts for unusual usage patterns

## Testing

### Test Authentication Flow:
```bash
# Should fail - no auth
curl "http://localhost:3002/api/vrm-lookup?vrm=AB12CDE"

# Should succeed - with email
curl "http://localhost:3002/api/vrm-lookup?vrm=AB12CDE&email=test@example.com"

# Check if iframe was created
# Look in admin panel or database for new iframe record
```

### Test Subscription Check:
1. Ensure user has active subscription in database
2. Embed widget with email parameter
3. Perform lookup - should work
4. Expire subscription in database
5. Try lookup again - should show subscription required overlay

### Test Admin Lock:
1. Find iframe ID in admin panel
2. Click "Lock" button
3. Try to use widget - should show "Access Denied"
4. Click "Unlock" button
5. Widget should work again

## Future Enhancements

- **Rate Limiting**: Limit lookups per email per day/month
- **Usage Analytics**: Dashboard showing top users, peak times, etc.
- **Webhook Events**: Notify on unusual usage patterns
- **API Keys**: Alternative to email auth for programmatic access
- **Tiered Limits**: Different lookup limits based on subscription tier
