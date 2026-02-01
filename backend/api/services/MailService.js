const nodemailer = require("nodemailer");

class MailService {
    constructor() {
        this.transporter = null;
        // Default frontend URL unless specified
        this.frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        this.init();
    }

    async init() {
        // If credentials are provided in env, use them
        if (process.env.SMTP_HOST && process.env.SMTP_USER) {
            this.transporter = nodemailer.createTransport(
                {
                    host: process.env.SMTP_HOST,
                    port: process.env.SMTP_PORT || 587,
                    secure: false,
                    auth:
                    {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS,
                    },
                });
        }
        else {
            // Otherwise generate test account
            try {
                const testAccount = await nodemailer.createTestAccount();

                this.transporter = nodemailer.createTransport(
                    {
                        host: "smtp.ethereal.email",
                        port: 587,
                        secure: false,
                        auth:
                        {
                            user: testAccount.user,
                            pass: testAccount.pass,
                        },
                    });

                console.log("Mock mail server initialized using Ethereal.");
                console.log("Credentials:", testAccount.user, testAccount.pass);
            }
            catch (err) {
                console.error("Failed to create test account for mail:", err);
            }
        }
    }

    async sendEmail(to, subject, html) {
        if (!this.transporter) await this.init();

        const info = await this.transporter.sendMail(
            {
                from: '"Vizsgaremek" <noreply@vizsgaremek.hu>',
                to,
                subject,
                html,
            });

        console.log("Message sent: %s", info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        return info;
    }

    async sendVerificationEmail(to, token) {
        const link = `${this.frontendUrl}:3000/verify-email?token=${token}`;

        const html = `
            <h1>Üdvözöljük!</h1>
            <p>Köszönjük a regisztrációt! Kérjük, erősítse meg email címét az alábbi linkre kattintva:</p>
            <a href="${link}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Email cím megerősítése</a>
            <p>Ha a gomb nem működik, másolja be az alábbi linket a böngészőjébe:</p>
            <p>${link}</p>
        `;

        return this.sendEmail(to, "Email megerősítés", html);
    }

    async sendPasswordResetEmail(to, token) {
        const link = `${this.frontendUrl}:3000/reset-password?token=${token}`;

        const html = `
            <h1>Elfelejtett jelszó</h1>
            <p>Jelszó beállításához kattintson az alábbi linkre:</p>
            <a href="${link}" style="padding: 10px 20px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 5px;">Új jelszó beállítása</a>
            <p>Ha nem Ön kérte, hagyja figyelmen kívül ezt az emailt.</p>
            <p>A link 1 óráig érvényes.</p>
        `;

        return this.sendEmail(to, "Jelszó visszaállítás", html);
    }
}

module.exports = MailService;
