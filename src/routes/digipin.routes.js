const express = require('express');
const router = express.Router();
const { body, query, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { getDigiPin, getLatLngFromDigiPin } = require('../digipin');

// Rate limiting for DIGIPIN endpoints
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil(15 * 60)
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(limiter);

// ✅ VALIDATION RULES
const validateCoordinates = [
  body('latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90')
    .custom((value) => {
      if (isNaN(parseFloat(value))) {
        throw new Error('Latitude must be a valid number');
      }
      return true;
    }),
  body('longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180')
    .custom((value) => {
      if (isNaN(parseFloat(value))) {
        throw new Error('Longitude must be a valid number');
      }
      return true;
    }),
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
    .isLength({ min: 11, max: 11 })
    .withMessage('DIGIPIN must be exactly 11 characters including hyphens')
    .matches(/^[2-9CFJKLMPT]{3}-[2-9CFJKLMPT]{3}-[2-9CFJKLMPT]{4}$/)
    .withMessage('Invalid DIGIPIN format. Expected: XXX-XXX-XXXX using valid characters (2-9, C, F, J, K, L, M, P, T)'),
];

const validateDigipinQuery = [
  query('digipin')
    .isString()
    .trim()
    .isLength({ min: 11, max: 11 })
    .withMessage('DIGIPIN must be exactly 11 characters including hyphens')
    .matches(/^[2-9CFJKLMPT]{3}-[2-9CFJKLMPT]{3}-[2-9CFJKLMPT]{4}$/)
    .withMessage('Invalid DIGIPIN format. Expected: XXX-XXX-XXXX using valid characters (2-9, C, F, J, K, L, M, P, T)'),
];

// ✅ ERROR HANDLING MIDDLEWARE
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

// ✅ SANITIZATION FUNCTION
const sanitizeCoordinates = (lat, lng) => {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  // Additional validation after parsing
  if (isNaN(latitude) || isNaN(longitude)) {
    throw new Error('Invalid coordinate values');
  }

  if (!isFinite(latitude) || !isFinite(longitude)) {
    throw new Error('Coordinate values must be finite numbers');
  }

  return { latitude, longitude };
};

const sanitizeDigipin = (digipin) => {
  if (!digipin || typeof digipin !== 'string') {
    throw new Error('DIGIPIN must be a string');
  }

  // Remove any extra whitespace and convert to uppercase
  return digipin.trim().toUpperCase();
};

// ✅ SECURE ROUTES WITH VALIDATION

// POST /encode - with validation
router.post('/encode', validateCoordinates, handleValidationErrors, (req, res) => {
  try {
    const { latitude, longitude } = sanitizeCoordinates(req.body.latitude, req.body.longitude);
    const code = getDigiPin(latitude, longitude);
    res.json({
      digipin: code,
      coordinates: {
        latitude: parseFloat(latitude.toFixed(6)),
        longitude: parseFloat(longitude.toFixed(6))
      }
    });
  } catch (e) {
    res.status(400).json({
      error: 'Encoding failed',
      message: e.message
    });
  }
});

// POST /decode - with validation
router.post('/decode', validateDigipin, handleValidationErrors, (req, res) => {
  try {
    const digipin = sanitizeDigipin(req.body.digipin);
    const coords = getLatLngFromDigiPin(digipin);
    res.json({
      ...coords,
      digipin: digipin
    });
  } catch (e) {
    res.status(400).json({
      error: 'Decoding failed',
      message: e.message
    });
  }
});

// GET /encode - with validation
router.get('/encode', validateCoordinatesQuery, handleValidationErrors, (req, res) => {
  try {
    const { latitude, longitude } = sanitizeCoordinates(req.query.latitude, req.query.longitude);
    const code = getDigiPin(latitude, longitude);
    res.json({
      digipin: code,
      coordinates: {
        latitude: parseFloat(latitude.toFixed(6)),
        longitude: parseFloat(longitude.toFixed(6))
      }
    });
  } catch (e) {
    res.status(400).json({
      error: 'Encoding failed',
      message: e.message
    });
  }
});

// GET /decode - with validation  
router.get('/decode', validateDigipinQuery, handleValidationErrors, (req, res) => {
  try {
    const digipin = sanitizeDigipin(req.query.digipin);
    const coords = getLatLngFromDigiPin(digipin);
    res.json({
      ...coords,
      digipin: digipin
    });
  } catch (e) {
    res.status(400).json({
      error: 'Decoding failed',
      message: e.message
    });
  }
});

module.exports = router;