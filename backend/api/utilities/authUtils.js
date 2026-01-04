const { sendEmail } = require("./emailService");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const salt = 14;

exports.generateUserToken = (user) => {
    return jwt.sign(
        { userID: user.ID, username: user.name, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
    );
};

exports.setCookie = (res, cookieName, value) => {
    res.cookie(cookieName, value, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60, // 1 óra
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
};

exports.verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
};

exports.hashPassword = (password) => {
    return bcrypt.hashSync(password, salt);
};

// Jelszó-visszaállító email küldése
exports.sendResetEmail = async (email, token) => {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await sendEmail({
        to: email,
        subject: "Jelszó visszaállítás",
        text: `Kattints a linkre a jelszó visszaállításához: ${resetLink}`,
        html: `
            <h2>Jelszó visszaállítása</h2>
            <p>Kattints az alábbi linkre a jelszó módosításához:</p>
            <a href="${resetLink}">${resetLink}</a>
        `,
    });

    console.log("Jelszó-visszaállító email elküldve:", email);
};