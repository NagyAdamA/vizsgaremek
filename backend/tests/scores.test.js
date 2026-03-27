const request = require('supertest');
const app = require('../app');
const db = require('../api/db');

describe('Scores API', () => {
    let authCookie = '';
    let user;
    let createdSessionId;
    let createdScoreId;

    beforeAll(async () => {
        user = await db.User.create({
            name: 'score_user',
            email: 'score@example.com',
            password: 'Password1!',
            isVerified: true
        });

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ userID: 'score@example.com', password: 'Password1!' });
        authCookie = loginRes.headers['set-cookie'].find(c => c.startsWith('user_token='));

        const sessionRes = await request(app)
            .post('/api/sessions')
            .set('Cookie', authCookie)
            .send({
                name: 'Score Session',
                distance: 18,
                targetSize: 40,
                arrowsPerEnd: 3
            });
        createdSessionId = sessionRes.body.ID;
    });

    it('should create a single score', async () => {
        const response = await request(app)
            .post('/api/scores')
            .set('Cookie', authCookie)
            .send({
                sessionID: createdSessionId,
                endNumber: 1,
                arrowNumber: 1,
                score: 10,
                isX: true
            });

        expect(response.status).toBe(201);
        expect(response.body.score).toBe(10);
        createdScoreId = response.body.ID;
    });

    it('should create multiple scores in bulk', async () => {
        const response = await request(app)
            .post('/api/scores/bulk')
            .set('Cookie', authCookie)
            .send({
                scores: [
                    {
                        sessionID: createdSessionId,
                        endNumber: 1,
                        arrowNumber: 2,
                        score: 9,
                        isX: false
                    },
                    {
                        sessionID: createdSessionId,
                        endNumber: 1,
                        arrowNumber: 3,
                        score: 8,
                        isX: false
                    }
                ]
            });

        expect(response.status).toBe(201);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(2);
    });

    it('should fetch all scores for a session', async () => {
        const response = await request(app)
            .get(`/api/scores/session/${createdSessionId}`)
            .set('Cookie', authCookie);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(3); // 1 single + 2 bulk
    });

    it('should fetch a single score by ID', async () => {
        const response = await request(app)
            .get(`/api/scores/${createdScoreId}`)
            .set('Cookie', authCookie);

        expect(response.status).toBe(200);
        expect(response.body.score).toBe(10);
    });

    it('should update a score', async () => {
        const response = await request(app)
            .put(`/api/scores/${createdScoreId}`)
            .set('Cookie', authCookie)
            .send({
                score: 9,
                isX: false
            });

        expect(response.status).toBe(200);

        const checkRes = await request(app)
            .get(`/api/scores/${createdScoreId}`)
            .set('Cookie', authCookie);
        expect(checkRes.body.score).toBe(9);
        expect(checkRes.body.isX).toBe(false);
    });

    it('should delete a score', async () => {
        const response = await request(app)
            .delete(`/api/scores/${createdScoreId}`)
            .set('Cookie', authCookie);

        expect(response.status).toBe(204);

        const checkRes = await request(app)
            .get(`/api/scores/${createdScoreId}`)
            .set('Cookie', authCookie);
        expect(checkRes.status).toBe(404);
    });
});
