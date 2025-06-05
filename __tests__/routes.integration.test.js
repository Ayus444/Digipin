const request = require('supertest');
const app = require('../src/app');

describe('DIGIPIN Routes', () => {
    describe('POST /api/digipin', () => {
        it('POST /encode - success', async () => {
            const res = await request(app)
                .post('/api/digipin/encode')
                .send({ latitude: 12.971601, longitude: 77.594584 });
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('digipin');
            expect(res.body.digipin).toBe('4P3-JK8-52C9');
        });

        it('POST /encode - bad request', async () => {
            const res = await request(app).post('/api/digipin/encode').send({});
            expect(res.statusCode).toBe(400);
        });

        it('POST /decode - success', async () => {
            const encodeRes = await request(app)
                .post('/api/digipin/encode')
                .send({ latitude: 12.971601, longitude: 77.594584 });

            expect(encodeRes.body).toHaveProperty('digipin');

            const decodeRes = await request(app)
                .post('/api/digipin/decode')
                .send({ digipin: encodeRes.body.digipin });

            expect(decodeRes.statusCode).toBe(200);
            expect(decodeRes.body).toHaveProperty('latitude');
            expect(decodeRes.body).toHaveProperty('longitude');
        });

        it('POST /decode - bad request', async () => {
            const res = await request(app).post('/api/digipin/decode').send({});
            expect(res.statusCode).toBe(400);
        });

        it('GET /api/digipin/encode - success', async () => {
            const res = await request(app)
                .get('/api/digipin/encode')
                .query({ latitude: 12.971601, longitude: 77.594584 });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('digipin');
            expect(res.body.digipin).toBe('4P3-JK8-52C9');
        });

    })

    describe('GET /api/digipin', () => {
        it('GET /encode - bad request (missing params)', async () => {
            const res = await request(app).get('/api/digipin/encode');
            expect(res.statusCode).toBe(400);
        });

        it('GET /encode - bad request', async () => {
            const res = await request(app).post('/api/digipin/encode').send({});
            expect(res.statusCode).toBe(400);
        });

        it('GET /decode - success', async () => {
            const encodeRes = await request(app)
                .get('/api/digipin/encode')
                .query({ latitude: 12.971601, longitude: 77.594584 });

            expect(encodeRes.body).toHaveProperty('digipin');

            const decodeRes = await request(app)
                .get('/api/digipin/decode')
                .query({ digipin: encodeRes.body.digipin });

            expect(decodeRes.statusCode).toBe(200);
            expect(decodeRes.body).toHaveProperty('latitude');
            expect(decodeRes.body).toHaveProperty('longitude');
        });

        it('GET /decode - bad request (missing digipin)', async () => {
            const res = await request(app).get('/api/digipin/decode');
            expect(res.statusCode).toBe(400);
        });
    })


});
