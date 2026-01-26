# Iframe Tracking - Quick Reference

## 🚀 What You Can Do Now

### Track Embeds
```
Admin → VRM Lookup → Copy Code
↓
Automatically tracked in database
↓
Admin → Embed Tracker → See it listed
```

### Lock/Unlock Embeds
```
Embed Tracker Table → Click "🔒 Lock"
↓
Status turns RED 🔒 Locked
↓
Protected from accidental deletion
↓
Click "🔓 Unlock" to revert
```

### Monitor Usage
```
Embed Table Shows:
- Created Date
- Usage Count (increments when accessed)
- Last Used Timestamp
- Total/Active/Locked Stats
```

### Delete Embeds
```
Find Embed → Click "🗑️ Delete"
↓
Confirm deletion
↓
Removed from database
```

---

## 📊 Admin Dashboard Layout

```
ADMIN PANEL
└─ 📋 EMBED TRACKER (NEW TAB)
   ├─ [🔄 Refresh Button]
   │
   ├─ STATS CARDS
   │  ├─ Total Iframes: 5
   │  ├─ Active: 3
   │  └─ Locked: 2
   │
   └─ EMBED TABLE
      └─ Each row shows:
         ├─ Embed URL (test-vrm.html)
         ├─ Status (🔓 Active or 🔒 Locked)
         ├─ Created Date
         ├─ Usage Count
         └─ Actions (🔒 Lock / 🔓 Unlock / 🗑️ Delete)
```

---

## 🔧 System Components

| Component | Purpose | Status |
|-----------|---------|--------|
| Backend API | Track/manage embeds | ✅ Ready |
| Database | Store embed data | ✅ Ready |
| Admin UI | Manage embeds | ✅ Ready |
| Auto-track | Record when copied | ✅ Ready |
| Usage counter | Increment on access | ✅ Ready |
| Lock system | Protect embeds | ✅ Ready |

---

## 📋 Key Files

```
Modified:
├─ server.js (added API endpoints)
├─ assets/js/main.js (added functions)
├─ index.html (added admin tab)
└─ test-vrm.html (added usage tracking)

New:
├─ IFRAME_TRACKER_MIGRATION.sql (database)
├─ IFRAME_TRACKING_DOCS.md (tech docs)
├─ IFRAME_SETUP.md (setup guide)
└─ IFRAME_SYSTEM_SUMMARY.md (overview)
```

---

## 🎯 Quick Start (5 minutes)

### 1. Setup Database
```
Supabase → SQL Editor → New Query
Copy/paste: IFRAME_TRACKER_MIGRATION.sql
Click: Run
```

### 2. Deploy Code
```
Deploy these files:
✓ server.js
✓ assets/js/main.js
✓ index.html
✓ test-vrm.html
```

### 3. Test It
```
1. Admin → VRM Lookup
2. Click "Copy Code"
3. Admin → Embed Tracker
4. See embed in table
5. Try Lock/Unlock/Delete
```

---

## 💻 API Reference

```javascript
// Get all embeds
GET /api/iframes
Authorization: Bearer {token}

// Create/track embed
POST /api/iframes/create
Authorization: Bearer {token}
Body: { url: "..." }

// Lock/unlock
PUT /api/iframes/:id/lock
Authorization: Bearer {token}
Body: { locked: true/false }

// Delete
DELETE /api/iframes/:id
Authorization: Bearer {token}

// Increment usage
POST /api/iframes/:id/use
```

---

## 🔐 Security

✅ Admin-only access  
✅ JWT authentication required  
✅ Row Level Security (RLS) enabled  
✅ User ID audit trail  
✅ Token-based authorization  

---

## 📊 Data Tracked

Per embed, the system stores:
- ✓ Unique ID (UUID)
- ✓ Creator (user_id)
- ✓ URL (embed link)
- ✓ Lock status
- ✓ Usage count
- ✓ Last used date
- ✓ Creation date
- ✓ Locked date (if applicable)

---

## 🎮 Admin Functions

### Available Functions (in console):

```javascript
// Load all iframes
loadAdminIframes()

// Lock/unlock iframe
toggleIframelock(iframeId, currentLocked)

// Delete iframe
deleteIframe(iframeId)

// Refresh data
document.getElementById('admin-iframes-refresh-btn').click()
```

---

## 📈 Usage Flow

```
1. CREATE EMBED
   User clicks "Copy iframe" button
   ↓
2. AUTO-TRACK
   POST /api/iframes/create called
   ↓
3. STORE IN DB
   Entry added to `iframes` table
   ↓
4. DISPLAY IN ADMIN
   Shows in Embed Tracker table
   ↓
5. USE TRACKING
   Each access increments usage_count
   ↓
6. MANAGE
   Admin can lock/unlock/delete
```

---

## 🚨 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Table not appearing | Run SQL migration in Supabase |
| API returns 401 | Check auth token in localStorage |
| Usage not tracking | Ensure iframe is actually loaded |
| Lock/unlock not working | Refresh page, check console |
| Counts don't match | Click refresh button |

---

## 📱 Table Column Reference

```
┌─────────────────────────────────────────────────────┐
│ COLUMN          │ PURPOSE                         │
├─────────────────────────────────────────────────────┤
│ Embed Preview   │ Shows URL preview (test-vrm.html)
│ Status          │ 🔓 Active or 🔒 Locked badge   │
│ Created         │ Date embed was created         │
│ Uses            │ Number of times accessed       │
│ Actions         │ Lock/Unlock & Delete buttons   │
└─────────────────────────────────────────────────────┘
```

---

## 🔄 Refresh Button

Located in top-right of Embed Tracker tab.

**Click to:**
- Reload all embeds from database
- Update usage counts
- Refresh status badges
- See new embeds immediately

---

## ✨ Features Summary

| Feature | Details |
|---------|---------|
| **Create** | Tracked automatically when copy button clicked |
| **Track** | All embeds stored in Supabase database |
| **View** | Admin panel shows all embeds |
| **Lock** | Protect embeds from deletion |
| **Unlock** | Remove lock status |
| **Delete** | Remove embed with confirmation |
| **Monitor** | Track usage count & last accessed |
| **Stats** | Real-time counts (Total/Active/Locked) |

---

## 🎯 Use Cases

### Use Case 1: Multiple Embeds
```
Create multiple embeds for different websites
Lock the important ones to prevent deletion
Monitor usage for each separately
```

### Use Case 2: Testing
```
Create test embeds
Lock them while testing
Delete when no longer needed
```

### Use Case 3: Monitoring
```
Track which embeds are most used
See when each one was last accessed
Monitor active vs locked vs deleted
```

---

## 💡 Pro Tips

1. **Lock Important Embeds** - Prevents accidental deletion
2. **Use Refresh Button** - Always refreshes to latest data
3. **Check Usage Stats** - Know which embeds are active
4. **Monitor Last Used** - Identify unused embeds
5. **Bulk Delete** - Delete old unused embeds to clean up

---

## 📞 Support Files

- `IFRAME_TRACKING_DOCS.md` - Technical details
- `IFRAME_SETUP.md` - Setup instructions
- `IFRAME_SYSTEM_SUMMARY.md` - System overview
- `IFRAME_IMPLEMENTATION_CHECKLIST.md` - Deployment guide

---

## ⚡ Next Steps

1. ✅ Run database migration
2. ✅ Deploy code files
3. ✅ Test in admin panel
4. ✅ Create your first embed
5. ✅ Monitor usage stats
6. ✅ Lock important embeds

---

**System Status: READY TO USE** ✅

All features implemented and documented!
