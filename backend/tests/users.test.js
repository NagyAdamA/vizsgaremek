const request = require('supertest');
const app = require('../app');
const db = require('../api/db');

describe('Users API', () => {
    let regularUserCookie = '';
    let adminCookie = '';
    let regularUser;
    let adminUser;

    beforeAll(async () => {
        regularUser = await db.User.create({
            name: 'regular',
            email: 'regular@example.com',
            password: 'Password1!',
            isVerified: true
        });

        const loginRegular = await request(app)
            .post('/api/auth/login')
            .send({ userID: 'regular@example.com', password: 'Password1!' });
        regularUserCookie = loginRegular.headers['set-cookie'].find(c => c.startsWith('user_token='));

        adminUser = await db.User.create({
            name: 'admin',
            email: 'admin@example.com',
            password: 'Password1!',
            isVerified: true,
            isAdmin: true
        });

        const loginAdmin = await request(app)
            .post('/api/auth/login')
            .send({ userID: 'admin@example.com', password: 'Password1!' });
        adminCookie = loginAdmin.headers['set-cookie'].find(c => c.startsWith('user_token='));
    });

    it('should return 401 for non-admin requesting all users', async () => {
        const response = await request(app)
            .get('/api/users')
            .set('Cookie', regularUserCookie);
        expect(response.status).toBe(401);
    });

    it('should return 200 and list users for admin', async () => {
        const response = await request(app)
            .get('/api/users')
            .set('Cookie', adminCookie);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThanOrEqual(2);
    });

    it('should return specific user details', async () => {
        const response = await request(app)
            .get(`/api/users/${regularUser.ID}`);
        expect(response.status).toBe(200);
        expect(response.body.name).toBe('regular');
    });

    it('should return 404 for non-existent user', async () => {
        const response = await request(app)
            .get('/api/users/99999');
        expect(response.status).toBe(404);
    });
});
