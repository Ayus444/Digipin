const express = require('express');
const router = express.Router();
const DigiPin = require('../digipin');

// 🔧 Helper: Validate and parse coordinates
function validateCoordinates(lat, lon) {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);

  if (isNaN(latitude) || isNaN(longitude)) {
    throw new Error('Latitude and Longitude must be numbers');
  }

  return { latitude, longitude };
}

// 🔧 Helper: Common encode handler
async function handleEncode(lat, lon, res) {
  try {
    const { latitude, longitude } = validateCoordinates(lat, lon);
    const code = await DigiPin({ type: 'encode', latitude, longitude });
    res.json({ digipin: code });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

// 🔧 Helper: Common decode handler
async function handleDecode(digipin, res) {
  try {
    if (!digipin || typeof digipin !== 'string' || digipin.length < 10) {
      throw new Error('Invalid DIGIPIN');
    }
    const coords = await DigiPin({ type: 'decode', digiPin: digipin });
    res.json(coords);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

// 🧭 POST /encode
router.post('/encode', (req, res) => {
  const { latitude, longitude } = req.body;
  handleEncode(latitude, longitude, res);
});

// 🔓 POST /decode
router.post('/decode', (req, res) => {
  const { digipin } = req.body;
  handleDecode(digipin, res);
});

// 🧭 GET /encode
router.get('/encode', (req, res) => {
  const { latitude, longitude } = req.query;
  handleEncode(latitude, longitude, res);
});

// 🔓 GET /decode
router.get('/decode', (req, res) => {
  const { digipin } = req.query;
  handleDecode(digipin, res);
});

module.exports = router;
