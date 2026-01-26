# Iframe Tracking - Setup Instructions

## Quick Setup (5 minutes)

### Step 1: Run Database Migration
1. Open Supabase Dashboard
2. Go to **SQL Editor**
3. Create new query
4. Copy & paste entire contents of `IFRAME_TRACKER_MIGRATION.sql`
5. Click **Run**
6. Confirm table `iframes` is created

### Step 2: Deploy Updated Files
The following files have been modified/created:

**Modified:**
- `server.js` - Added 5 new API endpoints for iframe management
- `assets/js/main.js` - Added iframe tracking functions
- `index.html` - Added admin "Embed Tracker" tab
- `test-vrm.html` - Added usage tracking beacon

**New:**
- `IFRAME_TRACKER_MIGRATION.sql` - Database migration script
- `IFRAME_TRACKING_DOCS.md` - Full documentation

Push these changes to your repository.

### Step 3: Test the Feature

1. Go to Admin Dashboard
2. Click **🔍 VRM Lookup** tab
3. Click **📋 Copy Code** button (copies iframe code AND tracks it)
4. Switch to **📋 Embed Tracker** tab
5. Should see the new iframe in the table
6. Click **🔒 Lock** to lock it (status changes to red 🔒 Locked)
7. Click **🔓 Unlock** to unlock (status back to green 🔓 Active)
8. Click **🗑️ Delete** to remove it (requires confirmation)

### Step 4: Monitor Usage

When the embed is used (loaded in an iframe elsewhere):
- `usage_count` increments
- `last_used` timestamp updates
- Admin can see live statistics

## What Gets Tracked

✅ **Automatically Tracked:**
- When embed code is copied
- How many times it's been used
- When it was last used
- Current lock status
- Creation date & time

🔒 **Lock/Unlock System:**
- Lock an embed to prevent accidental deletion
- Admin sees visual indicator (🔒 / 🔓)
- Lock doesn't disable the embed, just marks it as protected

📊 **Statistics:**
- Total iframes created
- Active (unlocked) count
- Locked count
- Individual usage counts

## Key Files & Their Changes

### server.js
```javascript
// New endpoints:
POST /api/iframes/create          // Track new embed
GET /api/iframes                  // Get all embeds
PUT /api/iframes/:id/lock         // Lock/unlock
DELETE /api/iframes/:id           // Delete embed
POST /api/iframes/:id/use         // Increment usage
```

### assets/js/main.js
```javascript
// New functions:
loadAdminIframes()                // Load and display all iframes
toggleIframelock(id, locked)      // Toggle lock status
deleteIframe(id)                  // Delete an iframe

// Modified:
copyEmbedBtn click handler        // Now tracks when code is copied
```

### index.html
```html
<!-- Added new admin tab -->
<button data-admin-tab="iframes">📋 Embed Tracker</button>

<!-- Added new panel -->
<div id="admin-iframes" class="admin-panel">
  <!-- Stats, table, actions -->
</div>
```

### test-vrm.html
```javascript
// Added usage tracking:
const iframeId = new URLSearchParams(...).get('id');
if (iframeId) {
  fetch(`/api/iframes/${iframeId}/use`, { method: 'POST' });
}
```

## Database Schema

```sql
CREATE TABLE iframes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,                         -- Creator
  url TEXT NOT NULL,                             -- Embed URL
  locked BOOLEAN DEFAULT FALSE,                  -- Lock status
  locked_at TIMESTAMP,                           -- When locked
  usage_count INTEGER DEFAULT 0,                 -- Times used
  last_used TIMESTAMP,                           -- Last usage
  created_at TIMESTAMP DEFAULT NOW(),            -- Creation time
  updated_at TIMESTAMP DEFAULT NOW()             -- Updated time
);
```

## Admin Tab Layout

```
📋 EMBED TRACKER TAB
├─ Stats Cards (3 columns)
│  ├─ Total Iframes [number]
│  ├─ Active [number]
│  └─ Locked [number]
│
├─ Refresh Button [🔄 Refresh]
│
└─ Iframe Table
   ├─ Embed Code Preview      | Status      | Created    | Uses | Actions
   ├─ test-vrm.html          | 🔓 Active   | Jan 26     | 5    | 🔒 Lock | 🗑️ Delete
   ├─ test-vrm.html          | 🔒 Locked   | Jan 25     | 2    | 🔓 Unlock | 🗑️ Delete
   └─ test-vrm.html          | 🔓 Active   | Jan 24     | 0    | 🔒 Lock | 🗑️ Delete
```

## Common Tasks

### Lock an Embed
1. Admin → Embed Tracker
2. Find the embed in the table
3. Click **🔒 Lock** button
4. Status changes to red
5. Icon shows 🔒 Locked

### Unlock an Embed
1. Find locked embed (red status)
2. Click **🔓 Unlock** button
3. Status changes to green
4. Icon shows 🔓 Active

### View Usage Stats
1. Look at **Uses** column in table
2. Last used is in the row
3. Created date visible in **Created** column

### Delete an Embed
1. Click **🗑️ Delete** button
2. Confirm deletion popup
3. Embed removed from database
4. No longer tracked

### Refresh Data
Click **🔄 Refresh** button to reload latest data from database

## Troubleshooting

**Issue: "Iframes table not found"**
- Run the SQL migration in Supabase
- Ensure table creation succeeded
- Check Supabase → Tables → iframes exists

**Issue: "API returns 401 Unauthorized"**
- Ensure authToken is in localStorage
- Check admin user role in Supabase
- Verify JWT token is valid

**Issue: Usage count not incrementing**
- Ensure iframe ID parameter is passed
- Check browser console for errors
- Verify embed is actually being accessed

**Issue: Lock/Unlock buttons don't work**
- Refresh the page
- Check browser console for errors
- Ensure you have admin role

## Performance Notes

- ✅ Table indexes on user_id, locked, created_at
- ✅ RLS policies for admin-only access
- ✅ Efficient queries with select()
- ✅ Async/await for smooth UI

## Security

- ✅ Admin-only access to all endpoints
- ✅ JWT token authentication required
- ✅ Row Level Security (RLS) on table
- ✅ User ID audit trail
- ✅ Public usage endpoint is read-only

## Next Steps

1. ✅ Run the SQL migration
2. ✅ Deploy the code changes
3. ✅ Test the admin panel
4. ✅ Create some embeds to track
5. ✅ Lock/unlock to verify
6. ✅ Monitor usage stats

## Support

For issues or questions about the iframe tracking system:
1. Check the IFRAME_TRACKING_DOCS.md file
2. Review the migration script
3. Check browser console for errors
4. Check Supabase logs for API errors
