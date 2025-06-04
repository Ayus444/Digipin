/**
 * DIGIPIN Encoder and Decoder Library
 * Developed by India Post, Department of Posts
 * Released under an open-source license for public use
 *
 * This module contains two main functions:
 *  - getDigiPin(lat, lon): Encodes latitude & longitude into a 10-digit alphanumeric DIGIPIN
 *  - getLatLngFromDigiPin(digiPin): Decodes a DIGIPIN back into its central latitude & longitude
 */

const DIGIPIN_GRID = [
  ['F', 'C', '9', '8'],
  ['J', '3', '2', '7'],
  ['K', '4', '5', '6'],
  ['L', 'M', 'P', 'T']
];

const GRID_SIZE = 4;

const BOUNDS = {
  minLat: 2.5,
  maxLat: 38.5,
  minLon: 63.5,
  maxLon: 99.5
};

// Precomputed character-to-grid index mapping
const CHAR_TO_INDEX = DIGIPIN_GRID.flatMap((row, rowIndex) =>
  row.map((char, colIndex) => [char, [rowIndex, colIndex]])
).reduce((acc, [char, coords]) => {
  acc[char] = coords;
  return acc;
}, {});

function getDigiPin(lat, lon) {
  if (lat < BOUNDS.minLat || lat > BOUNDS.maxLat)
    throw new Error(`Latitude ${lat} out of bounds (${BOUNDS.minLat}–${BOUNDS.maxLat})`);
  if (lon < BOUNDS.minLon || lon > BOUNDS.maxLon)
    throw new Error(`Longitude ${lon} out of bounds (${BOUNDS.minLon}–${BOUNDS.maxLon})`);

  let minLat = BOUNDS.minLat;
  let maxLat = BOUNDS.maxLat;
  let minLon = BOUNDS.minLon;
  let maxLon = BOUNDS.maxLon;

  let digiPin = '';

  for (let level = 1; level <= 10; level++) {
    const latDiv = (maxLat - minLat) / GRID_SIZE;
    const lonDiv = (maxLon - minLon) / GRID_SIZE;

    let rowIndex = GRID_SIZE - 1 - Math.floor((lat - minLat) / latDiv);
    let colIndex = Math.floor((lon - minLon) / lonDiv);

    rowIndex = Math.max(0, Math.min(rowIndex, GRID_SIZE - 1));
    colIndex = Math.max(0, Math.min(colIndex, GRID_SIZE - 1));

    digiPin += DIGIPIN_GRID[rowIndex][colIndex];

    if (level === 3 || level === 6) digiPin += '-';

    // Update bounds
    const newLatMin = minLat + latDiv * (GRID_SIZE - 1 - rowIndex);
    const newLatMax = newLatMin + latDiv;
    const newLonMin = minLon + lonDiv * colIndex;
    const newLonMax = newLonMin + lonDiv;

    minLat = newLatMin;
    maxLat = newLatMax;
    minLon = newLonMin;
    maxLon = newLonMax;
  }

  return digiPin;
}

function getLatLngFromDigiPin(digiPin, precision = 6) {
  const pin = digiPin.replace(/-/g, '');
  if (pin.length !== 10) throw new Error('Invalid DIGIPIN length');

  let minLat = BOUNDS.minLat;
  let maxLat = BOUNDS.maxLat;
  let minLon = BOUNDS.minLon;
  let maxLon = BOUNDS.maxLon;

  for (let i = 0; i < 10; i++) {
    const char = pin[i];
    const coords = CHAR_TO_INDEX[char];

    if (!coords) throw new Error(`Invalid character '${char}' in DIGIPIN`);

    const [rowIndex, colIndex] = coords;

    const latDiv = (maxLat - minLat) / GRID_SIZE;
    const lonDiv = (maxLon - minLon) / GRID_SIZE;

    const newLatMin = maxLat - latDiv * (rowIndex + 1);
    const newLatMax = newLatMin + latDiv;
    const newLonMin = minLon + lonDiv * colIndex;
    const newLonMax = newLonMin + lonDiv;

    minLat = newLatMin;
    maxLat = newLatMax;
    minLon = newLonMin;
    maxLon = newLonMax;
  }

  const centerLat = (minLat + maxLat) / 2;
  const centerLon = (minLon + maxLon) / 2;

  return {
    latitude: centerLat.toFixed(precision),
    longitude: centerLon.toFixed(precision)
  };
}

if (typeof module !== 'undefined') module.exports = { getDigiPin, getLatLngFromDigiPin };
