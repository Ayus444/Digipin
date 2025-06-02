const express = require('express');
const router = express.Router();
const { getDigiPin, getLatLngFromDigiPin, getDistance } = require('../digipin');

router.post('/encode', (req, res) => { const { latitude, longitude } = req.body; try { const code = getDigiPin(latitude, longitude); res.json({ digipin: code }); } catch (e) { res.status(400).json({ error: e.message }); } });

router.post('/decode', (req, res) => { const { digipin } = req.body; try { const coords = getLatLngFromDigiPin(digipin); res.json(coords); } catch (e) { res.status(400).json({ error: e.message }); } });

router.post('/get-distance', (req, res) => { const { src_digipin, dest_digipin } = req.body; try { const distance = getDistance(src_digipin, dest_digipin); res.json({ distance }); } catch (e) { res.status(400).json({ error: e.message }); } });

  router.get('/encode', (req, res) => {
    const { latitude, longitude } = req.query;
    try {
      const code = getDigiPin(parseFloat(latitude), parseFloat(longitude));
      res.json({ digipin: code });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
  
  router.get('/decode', (req, res) => {
    const { digipin } = req.query;
    try {
      const coords = getLatLngFromDigiPin(digipin);
      res.json(coords);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });

  router.get('/get-distance', (req, res) => {
  const { src_digipin, dest_digipin } = req.query;
  try {
      const distance = getDistance(src_digipin, dest_digipin);
      res.json({ distance });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
  
module.exports = router;