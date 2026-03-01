const { Resend } = require("resend");

class MailService {
    constructor() {
        this.resend = new Resend(process.env.RESEND_API_KEY);
        this.frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        this.fromAddress = process.env.MAIL_FROM || "Vizsgaremek <noreply@vizsgaremek.hu>";
    }

    async sendEmail(to, subject, html) {
        const { data, error } = await this.resend.emails.send({
            from: this.fromAddress,
            to,
            subject,
            html,
        });

        if (error) {
            console.error("Failed to send email:", error);
            throw new Error(error.message);
        }

        console.log("Message sent:", data.id);
        return data;
    }

    async sendVerificationEmail(to, token) {
        const link = `${this.frontendUrl}/verify-email?token=${token}`;

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
        const link = `${this.frontendUrl}/reset-password?token=${token}`;

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
