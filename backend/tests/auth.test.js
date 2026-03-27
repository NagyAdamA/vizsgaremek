const request = require('supertest');
const app = require('../app');
const db = require('../api/db');

describe('Auth & Registration Flows', () => {
    let verificationToken = '';
    let passwordResetToken = '';
    let authCookie = '';

    const testUser = {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'Password123!',
    };

    it('should register a new user successfully', async () => {
        const response = await request(app)
            .post('/api/users')
            .send(testUser);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('ID');
        expect(response.body.name).toBe(testUser.username);
        expect(response.body.email).toBe(testUser.email);

        const user = await db.User.findOne({ where: { email: testUser.email } });
        expect(user).not.toBeNull();
        expect(user.verificationToken).toBeTruthy();
        verificationToken = user.verificationToken;
    });

    it('should prevent login before email verification', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                userID: testUser.email,
                password: testUser.password,
            });

        expect(response.status).toBe(403);
    });

    it('should verify email successfully', async () => {
        const response = await request(app)
            .post('/api/auth/verify-email')
            .send({ token: verificationToken });

        expect(response.status).toBe(200);

        const user = await db.User.findOne({ where: { email: testUser.email } });
        expect(user.isVerified).toBe(true);
        expect(user.verificationToken).toBeNull();
    });

    it('should fail with invalid login credentials', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                userID: testUser.username,
                password: 'WrongPassword123!',
            });

        expect(response.status).toBe(401);
    });

    it('should login successfully and return a cookie after verification', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                userID: testUser.username,
                password: testUser.password,
            });

        expect(response.status).toBe(200);

        const cookies = response.headers['set-cookie'];
        expect(cookies).toBeDefined();

        authCookie = cookies.find(c => c.startsWith('user_token='));
        expect(authCookie).toBeDefined();
    });

    it('should get authenticated user status', async () => {
        const response = await request(app)
            .get('/api/auth/status')
            .set('Cookie', authCookie);

        expect(response.status).toBe(200);
        expect(response.body.username).toBe(testUser.username);
    });

    it('should request a password reset email', async () => {
        const response = await request(app)
            .post('/api/auth/forgot-password')
            .send({ email: testUser.email });

        expect(response.status).toBe(200);

        const user = await db.User.findOne({ where: { email: testUser.email } });
        expect(user.resetPasswordToken).toBeTruthy();
        passwordResetToken = user.resetPasswordToken;
    });

    it('should reset the password with valid token', async () => {
        const newPassword = 'NewPassword123!';
        const response = await request(app)
            .post('/api/auth/reset-password')
            .send({
                token: passwordResetToken,
                password: newPassword,
            });

        expect(response.status).toBe(200);

        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({
                userID: testUser.email,
                password: newPassword,
            });

        expect(loginResponse.status).toBe(200);
    });

    it('should logout successfully', async () => {
        const response = await request(app)
            .delete('/api/auth/logout')
            .set('Cookie', authCookie);

        expect(response.status).toBe(200);

        const cookies = response.headers['set-cookie'];
        if (cookies) {
            const logoutCookie = cookies.find(c => c.startsWith('user_token='));
            if (logoutCookie) {
                expect(logoutCookie).toMatch(/user_token=;/);
            }
        }
    });

    it('should return 401 on status after logout', async () => {
        const response = await request(app)
            .get('/api/auth/status')
            .set('Cookie', 'user_token=;');

        expect(response.status).toBe(401);
    });
});
