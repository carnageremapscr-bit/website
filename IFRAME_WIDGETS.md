# Carnage Remaps - Iframe Widgets Documentation

## Overview
You have TWO separate, distinct iframe widgets for different purposes. They are NOT confused and work independently.

---

## 1. 🚗 Vehicle Performance Search Widget
**File:** `embed.html`  
**Purpose:** Search vehicle database for ECU tuning stages, performance gains, and quote requests  
**Type:** Performance/Database Lookup

### Features:
- Manufacturer → Model → Year → Engine Selection
- Displays tuning stages (Stage 1, 2, 3)
- Shows power (HP) and torque (Nm) gains
- Quote buttons (WhatsApp, Email, SMS)
- Custom colors via URL parameters

### URL Parameters:
```
?color=       - Accent color (red) - default: #dc2626
?colorLight=  - Hover color - default: #b91c1c
?bg=          - Background - default: #1a1a1a
?title=       - Custom title
?desc=        - Custom description
?logo=        - Logo URL
?wa=          - WhatsApp number
?email=       - Email address
?showYear=    - Show year dropdown (1 or 0)
?showPerf=    - Show performance section (1 or 0)
?showStages=  - Show stage cards (1 or 0)
```

### Example Embed:
```html
<iframe src="https://your-domain.com/embed.html?color=%23dc2626&logo=https://example.com/logo.png" width="100%" height="550"></iframe>
```

---

## 2. 📋 VRM Lookup Widget
**File:** `test-vrm.html`  
**Purpose:** Look up UK vehicle registration details (specs, make, model, year, engine, power, torque)  
**Type:** Registration/Data Lookup

### Features:
- Enter registration plate (e.g., AB12 CDE)
- Returns: Make, Model, Year, Engine, Fuel Type, Power, Torque, etc.
- Shows estimated ECU tuning performance gains
- Fully customizable colors and branding
- Support for custom logos and titles

### URL Parameters:
```
?color=       - Accent color (red) - default: #dc2626
?colorLight=  - Hover/light variant - default: #ef4444
?gold=        - Gold/highlight color - default: #ffc107
?bg=          - Dark background - default: #0f172a
?bgPanel=     - Panel background - default: #1e293b
?logo=        - Logo image URL
?title=       - Custom widget title
?subtitle=    - Custom subtitle/description
```

### Example Embed:
```html
<iframe src="https://your-domain.com/test-vrm.html?color=%23dc2626&gold=%23ffc107&logo=https://example.com/logo.png" width="100%" height="600"></iframe>
```

---

## 3. Related Files (Separate Projects)

### `reg-lookup/` folder
- Standalone VRM lookup service
- Independent Node.js server
- Has its own styling (updated to Carnage branding)
- **Use:** Alternative VRM lookup implementation

---

## 🎛️ Admin Dashboard - Iframe Widget Manager

**Location:** Dashboard → Embed Widgets

### Features:
- ✅ Create multiple iframe configurations
- ✅ Custom colors for each configuration
- ✅ Add company logos
- ✅ Set custom titles
- ✅ One-click embed code generation
- ✅ Edit existing configurations
- ✅ Delete configurations

### How to Use:
1. Go to Dashboard → Embed Widgets
2. Click "+ Create New Configuration"
3. Enter:
   - Configuration Name
   - Accent Color (Red)
   - Gold/Highlight Color
   - Logo URL (optional)
   - Title (optional)
4. Click "Save Configuration"
5. Click "📋 Copy Code" to copy the iframe embed code

---

## 📊 Quick Comparison

| Feature | embed.html | test-vrm.html |
|---------|-----------|---------------|
| Purpose | Vehicle tuning search | VRM registration lookup |
| Input | Manufacturer, Model, Year | Registration plate |
| Output | Tuning stages, gains, quote buttons | Vehicle specs, estimated gains |
| Customizable Colors | Yes | Yes |
| Logo Support | Yes | Yes |
| Mobile Responsive | Yes | Yes |
| Performance Data | Calculated | From CheckCar API |

---

## 🚀 Deployment

Both widgets are served from the main server:
- `https://your-domain.com/embed.html` → Vehicle Search Widget
- `https://your-domain.com/test-vrm.html` → VRM Lookup Widget

They work independently and can be embedded on different sites with different configurations.

---

## ✅ Summary
- **embed.html** = Vehicle tuning/performance widget
- **test-vrm.html** = Registration lookup/vehicle info widget
- **Dashboard** = Configuration manager for test-vrm.html
- **No confusion** = Both are fully separate, independent widgets
