const request = require('supertest');
const app = require('../app');
const db = require('../api/db');

describe('Statistics API', () => {
    let authCookie = '';
    let createdSessionId;

    beforeAll(async () => {
        const user = await db.User.create({
            name: 'stat_user',
            email: 'stat@example.com',
            password: 'Password1!',
            isVerified: true
        });

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ userID: 'stat@example.com', password: 'Password1!' });
        authCookie = loginRes.headers['set-cookie'].find(c => c.startsWith('user_token='));

        const sessionRes = await request(app)
            .post('/api/sessions')
            .set('Cookie', authCookie)
            .send({
                name: 'Stat Session',
                distance: 18,
                targetSize: 40,
                arrowsPerEnd: 3
            });
        createdSessionId = sessionRes.body.ID;

        await request(app)
            .post('/api/scores')
            .set('Cookie', authCookie)
            .send({
                sessionID: createdSessionId,
                endNumber: 1,
                arrowNumber: 1,
                score: 10,
                isX: true
            });
    });

    it('should get overall statistics for the user', async () => {
        const response = await request(app)
            .get('/api/statistics')
            .set('Cookie', authCookie);

        expect(response.status).toBe(200);
        expect(typeof response.body).toBe('object');
    });

    it('should get statistics for a specific session', async () => {
        const response = await request(app)
            .get(`/api/statistics/session/${createdSessionId}`)
            .set('Cookie', authCookie);

        expect(response.status).toBe(200);
        expect(typeof response.body).toBe('object');
    });

    it('should return 401 for unauthorized access', async () => {
        const response = await request(app)
            .get('/api/statistics');
        expect(response.status).toBe(401);
    });
});
