const express = require('express');
const router = express.Router();
const digipinController = require('../controllers/digipin.controller');

router.post('/encode', digipinController.encodePost);
router.post('/decode', digipinController.decodePost);
router.get('/encode', digipinController.encodeGet);
router.get('/decode', digipinController.decodeGet);

module.exports = router;
