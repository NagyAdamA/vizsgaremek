const db = require('../api/db');


process.env.JWT_SECRET = 'test-jwt-secret';
process.env.JWT_EXPIRES_IN = '1d';
process.env.APP_URL = 'http://localhost:3000';

jest.mock('../api/services/MailService', () => {
    return jest.fn().mockImplementation(() => {
        return {
            sendEmail: jest.fn().mockResolvedValue({ id: 'mock-id' }),
            sendVerificationEmail: jest.fn().mockResolvedValue({ id: 'mock-id' }),
            sendPasswordResetEmail: jest.fn().mockResolvedValue({ id: 'mock-id' }),
        };
    });
});

beforeAll(async () => {
    await db.sequelize.sync({ force: true });
});

afterAll(async () => {
    await db.sequelize.close();
});
