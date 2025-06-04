const express = require("express");
const router = express.Router();
const {
  getDigiPin,
  getLatLngFromDigiPin,
  isValidDigiPin,
} = require("../digipin");

router.post("/encode", (req, res) => {
  const { latitude, longitude } = req.body;
  try {
    const code = getDigiPin(latitude, longitude);
    res.json({ digipin: code });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post("/decode", (req, res) => {
  const { digipin } = req.body;
  try {
    const coords = getLatLngFromDigiPin(digipin);
    res.json(coords);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get("/encode", (req, res) => {
  const { latitude, longitude } = req.query;
  try {
    const code = getDigiPin(parseFloat(latitude), parseFloat(longitude));
    res.json({ digipin: code });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get("/decode", (req, res) => {
  const { digipin } = req.query;
  try {
    const coords = getLatLngFromDigiPin(digipin);
    res.json(coords);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});
router.get("/validate", (req, res) => {
  const { digipin } = req.query;
  if (!digipin) {
    return res
      .status(400)
      .json({ error: "digipin query parameter is required" });
  }
  try {
    const isValid = isValidDigiPin(digipin);
    res.json({ digipin, isValid });
  } catch (e) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
