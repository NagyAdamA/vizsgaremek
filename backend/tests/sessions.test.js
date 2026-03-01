const request = require('supertest');
const app = require('../app');
const db = require('../api/db');

describe('Sessions API', () => {
    let authCookie = '';
    let user;
    let createdSessionId;

    beforeAll(async () => {
        user = await db.User.create({
            name: 'session_user',
            email: 'session@example.com',
            password: 'Password1!',
            isVerified: true
        });

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ userID: 'session@example.com', password: 'Password1!' });
        authCookie = loginRes.headers['set-cookie'].find(c => c.startsWith('user_token='));
    });

    it('should create a new training session', async () => {
        const response = await request(app)
            .post('/api/sessions')
            .set('Cookie', authCookie)
            .send({
                name: 'Morning Training',
                distance: 18,
                targetSize: 40,
                arrowsPerEnd: 3,
                notes: 'Good session'
            });

        expect(response.status).toBe(201);
        expect(response.body.name).toBe('Morning Training');
        createdSessionId = response.body.ID;
    });

    it('should fetch all sessions for the logged in user', async () => {
        const response = await request(app)
            .get('/api/sessions')
            .set('Cookie', authCookie);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThanOrEqual(1);
    });

    it('should fetch a single session by ID', async () => {
        const response = await request(app)
            .get(`/api/sessions/${createdSessionId}`)
            .set('Cookie', authCookie);

        expect(response.status).toBe(200);
        expect(response.body.name).toBe('Morning Training');
    });

    it('should update a session', async () => {
        const response = await request(app)
            .put(`/api/sessions/${createdSessionId}`)
            .set('Cookie', authCookie)
            .send({
                name: 'Updated Training',
                distance: 30
            });

        expect(response.status).toBe(200);

        const checkRes = await request(app)
            .get(`/api/sessions/${createdSessionId}`)
            .set('Cookie', authCookie);

        expect(checkRes.body.name).toBe('Updated Training');
        expect(checkRes.body.distance).toBe(30);
    });

    it('should return 401 for unauthorized access', async () => {
        const response = await request(app)
            .get('/api/sessions');
        expect(response.status).toBe(401);
    });

    it('should delete a session', async () => {
        const response = await request(app)
            .delete(`/api/sessions/${createdSessionId}`)
            .set('Cookie', authCookie);

        expect(response.status).toBe(204);

        const checkRes = await request(app)
            .get(`/api/sessions/${createdSessionId}`)
            .set('Cookie', authCookie);
        expect(checkRes.status).toBe(404);
    });
});
