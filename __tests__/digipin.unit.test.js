const { getDigiPin, getLatLngFromDigiPin } = require('../src/digipin/digipin');

describe('DIGIPIN logic', () => {
    test('should encode coordinates to DIGIPIN', () => {
        const code = getDigiPin(13.0827, 80.2707);
        expect(code).toMatch(/^[A-Z0-9]{3}-[A-Z0-9]{3}-[A-Z0-9]{4}$/);
    });

    test('should decode DIGIPIN to coordinates', () => {
        const code = getDigiPin(13.0827, 80.2707);
        const coords = getLatLngFromDigiPin(code);
        expect(coords).toHaveProperty('latitude');
        expect(coords).toHaveProperty('longitude');
        expect(parseFloat(coords.latitude)).toBeCloseTo(13.08, 1);
        expect(parseFloat(coords.longitude)).toBeCloseTo(80.27, 1);
    });

    test('should throw on invalid DIGIPIN', () => {
        expect(() => getLatLngFromDigiPin('INVALID')).toThrow();
    });
});
