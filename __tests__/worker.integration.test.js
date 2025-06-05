const DigiPin = require('../src/digipin');

describe('Worker Integration', () => {
    test('encodes valid coordinates', async () => {
        const result = await DigiPin({
            type: 'encode',
            latitude: 13.0827,
            longitude: 80.2707
        });
        expect(result).toMatch(/[A-Z0-9]{3}-[A-Z0-9]{3}-[A-Z0-9]{4}/);
    });

    test('decodes valid DIGIPIN', async () => {
        const encoded = await DigiPin({
            type: 'encode',
            latitude: 12.971601,
            longitude: 77.594584
        });

        const decoded = await DigiPin({
            type: 'decode',
            digiPin: encoded
        });

        expect(decoded).toHaveProperty('latitude');
        expect(decoded).toHaveProperty('longitude');
    });

    test('handles invalid input', async () => {
        await expect(
            DigiPin({ type: 'encode', latitude: 1000, longitude: 999 })
        ).rejects.toThrow(/Latitude out of range/);
    });
});
