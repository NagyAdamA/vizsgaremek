const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Vizsgaremek API",
            version: "1.0.0",
        },
        servers: [{ url: "http://localhost:8000", description: "Local dev server" }],
        components: {
            schemas: {
                User: {
                    type: "object",
                    properties: {
                        ID: { type: "integer", example: 1 },
                        name: { type: "string", example: "kovacs_janos" },
                        email: { type: "string", format: "email", example: "janos@example.com" },
                        isAdmin: { type: "boolean", example: false },
                        isVerified: { type: "boolean", example: true },
                        registeredAt: { type: "string", format: "date-time" },
                    },
                },
                Session: {
                    type: "object",
                    properties: {
                        ID: { type: "integer", example: 1 },
                        userID: { type: "integer", example: 1 },
                        name: { type: "string", example: "Reggeli edzés" },
                        distance: { type: "integer", example: 18, description: "Distance in metres" },
                        targetSize: { type: "integer", example: 40, description: "Target face size in cm" },
                        arrowsPerEnd: { type: "integer", example: 6, default: 6 },
                        notes: { type: "string", nullable: true, example: "Szeles idő" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                Score: {
                    type: "object",
                    properties: {
                        ID: { type: "integer", example: 1 },
                        sessionID: { type: "integer", example: 1 },
                        endNumber: { type: "integer", example: 1, description: "End (volley) number, min 1" },
                        arrowNumber: { type: "integer", example: 1, description: "Arrow position within end, 1–12" },
                        score: { type: "integer", example: 9, description: "Arrow score 0–10" },
                        isX: { type: "boolean", example: false, description: "True if the arrow scored X (inner 10)" },
                        createdAt: { type: "string", format: "date-time" },
                    },
                },
                Error: {
                    type: "object",
                    properties: {
                        message: { type: "string", example: "Something went wrong" },
                    },
                },
            },
            securitySchemes: {
                cookieAuth: {
                    type: "apiKey",
                    in: "cookie",
                    name: "user_token",
                },
            },
        },
        security: [{ cookieAuth: [] }],
        tags: [
            { name: "Auth", description: "Bejelentkezés, kijelentkezés, email megerősítés, jelszó visszaállítás" },
            { name: "Users", description: "Felhasználó regisztráció és lekérdezés" },
            { name: "Sessions", description: "Íjász edzések" },
            { name: "Scores", description: "Lövések pontszámai egy edzésen belül" },
            { name: "Statistics", description: "Összesített statisztikák" },
        ],
    },
    apis: [
        "./api/routes/authRoutes.js",
        "./api/routes/userRoutes.js",
        "./api/routes/sessionRoutes.js",
        "./api/routes/scoreRoutes.js",
        "./api/routes/statisticsRoutes.js",
    ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
