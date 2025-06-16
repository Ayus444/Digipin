const express = require('express');
const router = express.Router();
const { getDigiPin, getLatLngFromDigiPin } = require('../digipin');

// Helper to parse and validate coordinates
function parseCoords(req, fromQuery = false) {
  const source = fromQuery ? req.query : req.body;
  const lat = parseFloat(source.latitude);
  const lng = parseFloat(source.longitude);
  if (isNaN(lat) || isNaN(lng)) throw new Error('Invalid or missing latitude/longitude');
  return { lat, lng };
}

// ENCODE
router.post('/encode', (req, res) => {
  try {
    const { lat, lng } = parseCoords(req);
    const code = getDigiPin(lat, lng);
    res.json({ digipin: code });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get('/encode', (req, res) => {
  try {
    const { lat, lng } = parseCoords(req, true);
    const code = getDigiPin(lat, lng);
    res.json({ digipin: code });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// DECODE
router.post('/decode', (req, res) => {
  const { digipin } = req.body;
  if (!digipin) return res.status(400).json({ error: 'DigiPin is required' });

  try {
    const coords = getLatLngFromDigiPin(digipin);
    res.json(coords);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get('/decode', (req, res) => {
  const { digipin } = req.query;
  if (!digipin) return res.status(400).json({ error: 'DigiPin is required' });

  try {
    const coords = getLatLngFromDigiPin(digipin);
    res.json(coords);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;