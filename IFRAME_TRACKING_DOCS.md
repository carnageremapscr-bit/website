# Iframe Tracking & Management System

## Overview
A complete system to track, manage, and control all generated iframe embeds with lock/unlock functionality.

## Features Implemented

### 1. **Iframe Tracking Database** (Supabase)
- **Table**: `iframes`
- **Fields**:
  - `id` - Unique identifier (UUID)
  - `user_id` - Creator/owner
  - `url` - Embed URL
  - `locked` - Lock status (boolean)
  - `locked_at` - When locked
  - `usage_count` - Number of times used
  - `last_used` - Last usage timestamp
  - `created_at` - Creation timestamp
  - `updated_at` - Update timestamp

### 2. **Backend API Endpoints** (server.js)

#### Create/Track Iframe
```
POST /api/iframes/create
Authorization: Bearer {token}
Body: { url: "https://..." }
Response: { success: true, iframe: {...} }
```

#### Get All Iframes
```
GET /api/iframes
Authorization: Bearer {token}
Response: { iframes: [...] }
```

#### Lock/Unlock Iframe
```
PUT /api/iframes/:id/lock
Authorization: Bearer {token}
Body: { locked: true/false }
Response: { success: true, iframe: {...} }
```

#### Delete Iframe
```
DELETE /api/iframes/:id
Authorization: Bearer {token}
Response: { success: true }
```

#### Increment Usage
```
POST /api/iframes/:id/use
Response: { success: true, iframe: {...} }
```

### 3. **Admin Dashboard Tab**
- **Tab**: "📋 Embed Tracker"
- **Location**: Admin Panel (after VRM Lookup tab)
- **Features**:
  - Real-time statistics cards:
    - Total Iframes
    - Active (Unlocked)
    - Locked
  - Sortable table with:
    - Embed code preview
    - Status badge (🔓 Active / 🔒 Locked)
    - Creation date
    - Usage count
    - Action buttons (Lock/Unlock, Delete)
  - Refresh button for real-time updates

### 4. **Frontend Functions** (assets/js/main.js)

#### Load Admin Iframes
```javascript
loadAdminIframes()
// Fetches all iframes, updates counts, renders table
```

#### Toggle Iframe Lock
```javascript
toggleIframelock(iframeId, currentLocked)
// Switches lock status, calls API, refreshes table
```

#### Delete Iframe
```javascript
deleteIframe(iframeId)
// Confirms deletion, calls API, refreshes table
```

### 5. **Automatic Tracking**
- **When Copy Button Clicked**: Iframe is created in database
- **When Embed Loads**: Usage counter increments
- **When Locked**: Timestamp recorded

## Lock/Unlock System

### Locked Iframe
- ✅ Still works normally (full functionality)
- ✅ Usage tracking continues
- ✅ Shows "🔒 Locked" status in admin panel
- ⚠️ Visual indicator shows it's locked
- Can only be unlocked by admin

### Unlocked Iframe
- ✅ Shows "🔓 Active" status
- ✅ Full functionality
- ✅ Usage tracked
- ⚠️ Can be locked at any time by admin

## Usage Tracking

Each iframe tracks:
- **Total Uses**: Number of times someone accessed the embed
- **Last Used**: When was it last accessed
- **Creation Date**: When the embed was generated
- **Created By**: User who created the embed (user_id)

## Migration Setup

To set up the database table, run the SQL migration:
```sql
-- See: IFRAME_TRACKER_MIGRATION.sql
-- Includes:
-- - Table creation
-- - Indexes for performance
-- - Row Level Security (RLS)
-- - Admin access policies
```

Run in Supabase SQL Editor:
1. Go to Supabase Dashboard → SQL Editor
2. Create a new query
3. Paste contents of `IFRAME_TRACKER_MIGRATION.sql`
4. Run the query

## User Interface

### Admin Panel
```
📋 Embed Tracker Tab
├─ Stats Cards (Total, Active, Locked)
├─ Refresh Button
└─ Iframe Table
   ├─ Embed Code Preview (code snippet)
   ├─ Status Badge (Active/Locked)
   ├─ Created Date
   ├─ Usage Count
   └─ Actions (Lock/Unlock, Delete)
```

### Table Features
- Real-time status updates
- Color-coded badges (green=active, red=locked)
- Quick action buttons
- Usage statistics visible at a glance
- Confirmation dialogs for destructive actions

## Security Considerations

- ✅ Admin-only access to management endpoints
- ✅ Row Level Security (RLS) on database
- ✅ User ID tracking for audit purposes
- ✅ Token-based authentication
- ✅ Public usage endpoint (increments only, read-only)

## Future Enhancements

Possible additions:
1. Usage analytics (graphs, trends)
2. Custom embed parameters
3. Bulk actions (lock all, delete all)
4. Usage alerts/limits
5. Export embed tracking data
6. Embed analytics dashboard
7. Custom expiration dates
8. Whitelist domains for embeds

## Technical Stack

- **Backend**: Node.js/Express
- **Database**: Supabase PostgreSQL
- **Frontend**: Vanilla JavaScript
- **API**: RESTful endpoints
- **Security**: JWT tokens, RLS policies
