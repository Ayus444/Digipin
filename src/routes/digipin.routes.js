const express = require('express');
const router = express.Router();
const { getDigiPin, getLatLngFromDigiPin } = require('../digipin');
const QRCode = require('qrcode');

router.post('/encode', (req, res) => { 
  const { latitude, longitude } = req.body; 
  try { const code = getDigiPin(latitude, longitude); 
    res.json({ digipin: code }); 
  } catch (e) { 
    res.status(400).json({ error: e.message }); 
  } 
});

router.post('/decode', (req, res) => { const { digipin } = req.body; try { const coords = getLatLngFromDigiPin(digipin); res.json(coords); } catch (e) { res.status(400).json({ error: e.message }); } });

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



// Generate QR Code for a given DigiPin
router.get('/qrcode/:digipin', async (req, res) => {
  const { digipin } = req.params;

  if (!digipin || digipin.length < 5) {
    return res.status(400).json({ error: "Invalid DigiPin provided." });
  }

  try {
    // Decode DigiPin to get coordinates
    const { latitude, longitude } = getLatLngFromDigiPin(digipin);

    // Generate Google Maps link
    const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

    // Create QR code for this link
    const qrImage = await QRCode.toDataURL(mapsUrl);

    // Return PNG image
    res.type('image/png');
    res.send(Buffer.from(qrImage.split(',')[1], 'base64'));
  } catch (e) {
    res.status(500).json({ error: 'Failed to generate QR code', detail: e.message });
  }
});

  
module.exports = router;