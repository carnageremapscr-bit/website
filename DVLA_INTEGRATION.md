# DVLA API Integration Guide

## Overview
Your Carnage Remaps website now has secure DVLA Open Data API integration for real-time vehicle lookups. The API key is stored securely server-side and never exposed to the frontend.

## Setup Complete ✅

### What Was Added:
1. **Environment Configuration** (.env file)
   - DVLA API key stored securely
   - Kept out of version control via .gitignore

2. **Backend Integration** (server.js)
   - New endpoint: `GET /api/dvla-lookup?vrm=AB12CDE`
   - Proxies requests to DVLA API securely
   - Frontend never sees your API key

3. **Frontend Wrappers**
   - `assets/js/dvla-client.js` - Browser/frontend library
   - `assets/js/dvla-api.js` - Node.js server library
   - Built-in caching and error handling

---

## Usage

### Frontend (Browser)

#### Basic Lookup
```html
<script src="/assets/js/dvla-client.js"></script>

<script>
  const dvla = new DVLAVehicleLookup();
  
  // Lookup a vehicle
  const result = await dvla.lookupVehicle('AB12CDE');
  
  if (result.success) {
    console.log(result.vehicle); // Full vehicle data
    console.log(result.provider); // Will be 'dvla'
  } else {
    console.error(result.error);
  }
</script>
```

#### With HTML Form
```html
<form id="vrmForm">
  <input 
    type="text" 
    id="vrmInput" 
    placeholder="Enter VRM (e.g., AB12CDE)"
    pattern="[A-Z0-9]{2,7}"
  >
  <button type="submit">Lookup Vehicle</button>
  <div id="results"></div>
</form>

<script src="/assets/js/dvla-client.js"></script>
<script>
  const dvla = new DVLAVehicleLookup();
  
  document.getElementById('vrmForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const vrm = document.getElementById('vrmInput').value;
    const result = await dvla.lookupVehicle(vrm);
    
    if (result.success) {
      const v = result.vehicle;
      document.getElementById('results').innerHTML = `
        <p><strong>${v.make} ${v.model}</strong></p>
        <p>Year: ${v.yearOfManufacture}</p>
        <p>Fuel: ${v.fuelType}</p>
        <p>Colour: ${v.colour}</p>
      `;
    } else {
      document.getElementById('results').innerHTML = `
        <p style="color: red;">Error: ${result.error}</p>
      `;
    }
  });
</script>
```

#### VRM Validation
```javascript
const dvla = new DVLAVehicleLookup();

// Check if VRM format is valid (before API call)
if (DVLAVehicleLookup.isValidVRM('AB12CDE')) {
  console.log('Valid VRM format');
}

// Format VRM (uppercase, remove spaces)
const formatted = DVLAVehicleLookup.formatVRM('ab 12 cde');
console.log(formatted); // "AB12CDE"
```

#### Caching
```javascript
const dvla = new DVLAVehicleLookup();

// Lookup vehicle (uses cache by default)
const result1 = await dvla.lookupVehicle('AB12CDE');

// Same lookup - served from cache (no API call)
const result2 = await dvla.lookupVehicle('AB12CDE');

// Bypass cache
const result3 = await dvla.lookupVehicle('AB12CDE', { useCache: false });

// Clear cache
dvla.clearCache('AB12CDE'); // Clear specific VRM
dvla.clearCache(); // Clear all cache

// Get cache stats
console.log(dvla.getCacheStats());
// { totalCached: 5, validEntries: 4, expiredEntries: 1, cacheSize: 5 }
```

#### Format Vehicle Info
```javascript
const dvla = new DVLAVehicleLookup();

const info = await dvla.getVehicleInfo('AB12CDE');
// Returns: { 
//   vrm, description, make, model, year, fuelType, 
//   colour, engineCapacity, taxStatus, motStatus 
// }

const description = DVLAVehicleLookup.formatVehicleDescription(info);
// "BMW 3 Series (2012) Petrol"
```

### Backend (Node.js/Express)

#### Direct API Endpoint
```javascript
// In your JavaScript code
const response = await fetch('/api/dvla-lookup?vrm=AB12CDE');
const data = await response.json();

// Response format:
{
  success: true,
  vrm: "AB12CDE",
  provider: "dvla",
  vehicle: {
    vrm: "AB12CDE",
    make: "BMW",
    model: "3 Series",
    fuelType: "Petrol",
    engineCapacity: 1995,
    power: 150,
    transmission: "Manual",
    colour: "Black",
    firstRegistrationDate: "2012-01-15",
    yearOfManufacture: 2012,
    taxStatus: "Taxed",
    motStatus: "Valid"
  },
  retrievedAt: "2026-01-26T12:34:56.789Z"
}
```

#### Using Server-Side Library
```javascript
const DVLAClient = require('./assets/js/dvla-api.js');

const dvla = new DVLAClient(
  process.env.DVLA_API_KEY,
  process.env.DVLA_API_BASE_URL
);

// Lookup vehicle
const vehicle = await dvla.lookupVehicleByVRM('AB12CDE');

// Validate VRM
const isValid = await dvla.isValidVRM('AB12CDE');

// Get technical details
const specs = await dvla.getVehicleTechnicals('AB12CDE');

// Batch lookup
const vehicles = await dvla.lookupMultipleVehicles(['AB12CDE', 'CD34EFG']);
```

---

## API Response Format

### Successful Lookup
```json
{
  "success": true,
  "vrm": "AB12CDE",
  "provider": "dvla",
  "vehicle": {
    "vrm": "AB12CDE",
    "make": "BMW",
    "model": "3 Series",
    "fuelType": "Petrol",
    "engineCapacity": 1995,
    "power": 150,
    "transmission": "Manual",
    "colour": "Black",
    "firstRegistrationDate": "2012-01-15",
    "yearOfManufacture": 2012,
    "taxStatus": "Taxed",
    "motStatus": "Valid",
    "engineNumber": "12B34567",
    "vin": "WBABD5245F6123456"
  },
  "retrievedAt": "2026-01-26T12:34:56.789Z"
}
```

### Error Response
```json
{
  "error": "Vehicle not found",
  "success": false,
  "status": 404
}
```

---

## Error Handling

### Common Error Cases

| Status | Error | Meaning |
|--------|-------|---------|
| 400 | `vrm is required` | No VRM provided |
| 400 | `Invalid VRM format` | VRM doesn't match pattern |
| 404 | `Vehicle not found` | VRM not in DVLA database |
| 500 | `DVLA API is not configured` | API key not set in environment |
| 500 | `DVLA lookup failed` | Network or API error |

### Example Error Handling
```javascript
const dvla = new DVLAVehicleLookup();

try {
  const result = await dvla.lookupVehicle('AB12CDE', { throwError: true });
} catch (error) {
  console.error('Lookup failed:', error.message);
  // Handle error...
}

// Or without throwing:
const result = await dvla.lookupVehicle('AB12CDE');
if (!result.success) {
  console.error('Error:', result.error);
}
```

---

## Security Notes

### ✅ What's Secure:
- **API Key Protection**: Your DVLA API key never leaves the server
- **Frontend Proxy**: Frontend sends requests to your backend, which proxies to DVLA
- **Environment Secrets**: Key stored in `.env` file (not committed to git)
- **Rate Limiting**: Consider adding rate limits to the endpoint in production

### 🔒 Best Practices:
1. **Never hardcode the API key** in frontend code
2. **Keep `.env` file in `.gitignore`** (already done)
3. **Regenerate the API key** if it's accidentally exposed
4. **Use rate limiting** to prevent abuse:
   ```javascript
   const rateLimit = require('express-rate-limit');
   
   const dvlaLimiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // 100 requests per window
   });
   
   app.get('/api/dvla-lookup', dvlaLimiter, async (req, res) => {
     // ... endpoint code
   });
   ```

---

## Integration Examples

### Vehicle Rental Lookup
```javascript
async function checkVehicleAvailability(vrm) {
  const dvla = new DVLAVehicleLookup();
  const result = await dvla.lookupVehicle(vrm);
  
  if (!result.success) {
    return { available: false, reason: 'Vehicle not found' };
  }
  
  const vehicle = result.vehicle;
  
  // Check your business rules
  if (vehicle.taxStatus !== 'Taxed') {
    return { available: false, reason: 'Vehicle not taxed' };
  }
  
  if (vehicle.motStatus !== 'Valid') {
    return { available: false, reason: 'MOT invalid' };
  }
  
  return { 
    available: true, 
    vehicle: {
      description: DVLAVehicleLookup.formatVehicleDescription(vehicle),
      make: vehicle.make,
      model: vehicle.model
    }
  };
}
```

### Tuning Database Pre-fill
```javascript
async function prefillTuningForm(vrm) {
  const dvla = new DVLAVehicleLookup();
  const vehicle = await dvla.getVehicleInfo(vrm);
  
  if (vehicle.error) {
    return null;
  }
  
  // Pre-populate form fields
  document.getElementById('vehicleMake').value = vehicle.make;
  document.getElementById('vehicleModel').value = vehicle.model;
  document.getElementById('vehicleYear').value = vehicle.year;
  document.getElementById('vehicleDescription').value = vehicle.description;
  
  return vehicle;
}
```

---

## Troubleshooting

### API Key Not Working
```javascript
// Check if API is configured
fetch('/api/dvla-lookup?vrm=TEST')
  .then(r => r.json())
  .then(data => console.log(data.error)); // Should show if configured
```

### Cache Issues
```javascript
const dvla = new DVLAVehicleLookup();

// Clear cache and retry
dvla.clearCache('AB12CDE');
const result = await dvla.lookupVehicle('AB12CDE', { useCache: false });
```

### Network Errors
```javascript
// Check browser console for CORS or network errors
// If blocked, may need to enable CORS in server.js
// CORS is already configured in your Express app
```

---

## Environment Variables

In your `.env` file:
```env
# DVLA Open Data API Configuration
DVLA_API_KEY=RHjffwbirb22apXq6alBT1BM7ZUdJVKQHHTD9vZ8
DVLA_API_BASE_URL=https://api.dvlaonlineservices.dvla.gov.uk/v1
```

---

## File Locations

- **Frontend Library**: `assets/js/dvla-client.js`
- **Server Library**: `assets/js/dvla-api.js`
- **API Endpoint**: `GET /api/dvla-lookup?vrm=<VRM>`
- **Environment Config**: `.env`

---

## Support

For issues or questions:
1. Check the error message returned by the API
2. Verify your VRM format (should be 2-7 alphanumeric characters)
3. Ensure `.env` is properly configured
4. Check that your DVLA API key is valid at: https://www.dvlaonlineservices.dvla.gov.uk/

For DVLA API support: DVLAAPIAccess@dvla.gov.uk
