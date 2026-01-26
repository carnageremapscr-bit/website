const path = require('path');
const express = require('express');
const cors = require('cors');

const vehicles = require('./data/vehicles.json');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/lookup', (req, res) => {
  const reg = String(req.query.reg || '').trim().toUpperCase();

  if (!reg) {
    return res.status(400).json({ error: 'Registration is required' });
  }

  const match = vehicles.find(
    (v) => v.registration.toUpperCase() === reg
  );

  if (!match) {
    return res.status(404).json({ error: 'Registration not found' });
  }

  return res.json(match);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Reg lookup running on port ${PORT}`);
});
