const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const axios = require('axios');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static('public'));



// Vehicle lookup endpoint
app.post('/api/vehicle-lookup', async (req, res) => {
  try {
    const { registration } = req.body;

    if (!registration) {
      return res.status(400).json({ error: 'Registration number required' });
    }

    // Query DVLA API
    const response = await axios.post(
      `${process.env.DVLA_API_BASE_URL}/vehicle-enquiry/v1/vehicles`,
      {
        registrationNumber: registration.toUpperCase()
      },
      {
        headers: {
          'x-api-key': process.env.DVLA_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    return res.json(response.data);
  } catch (error) {
    console.error('Vehicle Lookup Error:', error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    return res.status(500).json({ error: 'Failed to lookup vehicle', details: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
