const { getDigiPin, getLatLngFromDigiPin } = require('../digipin');

exports.encodePost = (req, res) => {
  const { latitude, longitude } = req.body;

  try {
    const code = getDigiPin(latitude, longitude);
    res.json({ digipin: code });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.decodePost = (req, res) => {
  const { digipin } = req.body;

  try {
    const coords = getLatLngFromDigiPin(digipin);
    res.json(coords);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.encodeGet = (req, res) => {
  const { latitude, longitude } = req.query;

  try {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const code = getDigiPin(lat, lng);
    res.json({ digipin: code });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.decodeGet = (req, res) => {
  const { digipin } = req.query;

  try {
    const coords = getLatLngFromDigiPin(digipin);
    res.json(coords);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
