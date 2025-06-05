const express = require('express');
const { body, query, validationResult } = require('express-validator');
const router = express.Router();
const { getDigiPin, getLatLngFromDigiPin } = require('../digipin');

// Input validation middleware
const validateCoordinates = [
  body('latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  body('longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
];

const validateCoordinatesQuery = [
  query('latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  query('longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
];

const validateDigipin = [
  body('digipin')
    .isString()
    .trim()
    .matches(/^[2-9CFJKLMPT]{3}-[2-9CFJKLMPT]{3}-[2-9CFJKLMPT]{4}$/)
    .withMessage('Invalid DIGIPIN format'),
];

const validateDigipinQuery = [
  query('digipin')
    .isString()
    .trim()
    .matches(/^[2-9CFJKLMPT]{3}-[2-9CFJKLMPT]{3}-[2-9CFJKLMPT]{4}$/)
    .withMessage('Invalid DIGIPIN format'),
];

// Error handling middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// Sanitize and process coordinates
const sanitizeCoordinates = (lat, lng) => {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  if (isNaN(latitude) || isNaN(longitude)) {
    throw new Error('Invalid coordinate values');
  }

  return { latitude, longitude };
};

// Routes with validation
router.post('/encode', validateCoordinates, handleValidationErrors, (req, res) => {
  try {
    const { latitude, longitude } = sanitizeCoordinates(req.body.latitude, req.body.longitude);
    const code = getDigiPin(latitude, longitude);
    res.json({ digipin: code });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post('/decode', validateDigipin, handleValidationErrors, (req, res) => {
  try {
    const digipin = req.body.digipin.trim().toUpperCase();
    const coords = getLatLngFromDigiPin(digipin);
    res.json(coords);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get('/encode', validateCoordinatesQuery, handleValidationErrors, (req, res) => {
  try {
    const { latitude, longitude } = sanitizeCoordinates(req.query.latitude, req.query.longitude);
    const code = getDigiPin(latitude, longitude);
    res.json({ digipin: code });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get('/decode', validateDigipinQuery, handleValidationErrors, (req, res) => {
  try {
    const digipin = req.query.digipin.trim().toUpperCase();
    const coords = getLatLngFromDigiPin(digipin);
    res.json(coords);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;