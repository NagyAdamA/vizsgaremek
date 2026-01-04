const bcrypt = require("bcrypt");
const crypto = require("crypto");

const db = require("../db");
const { userService } = require("../services")(db);
const authUtils = require("../utilities/authUtils");

// LOGIN
exports.login = async (req, res, next) => {
    const { userID, password } = req.body;

    let user;

    try {
        user = await userService.getUser(userID, true);
    } catch (error) {
        return next(error);
    }

    if (bcrypt.compareSync(password, user.password)) {
        const token = authUtils.generateUserToken(user);

        authUtils.setCookie(res, "user_token", token);

        res.status(200).json(token);
    } else {
        res.status(401).json({ message: "Wrong password" });
    }
};

// STATUS
exports.status = (req, res, next) => {
    res.status(200).json(req.user);
};

// LOGOUT
exports.logout = (req, res, next) => {
    res.clearCookie("user_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV == "production",
        sameSite: "strict",
        path: "/",
    });

    res.status(200).json({ message: "Logged out successfully" });
};

// FORGOT PASSWORD
exports.forgotPassword = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await userService.getUserByEmail(email);

        if (!user) {
            return res.status(404).json({ message: "Felhasználó nem található" });
        }

        const token = crypto.randomBytes(32).toString("hex");
        const expires = Date.now() + 1000 * 60 * 30; // 30 perc

        await userService.setResetToken(user.id, token, expires);

        await authUtils.sendResetEmail(email, token);

        res.status(200).json({ message: "Jelszó-visszaállító email elküldve" });
    } catch (error) {
        next(error);
    }
};

// RESET PASSWORD
exports.resetPassword = async (req, res, next) => {
    const { token, password } = req.body;

    try {
        const user = await userService.getUserByResetToken(token);

        if (!user || user.resetTokenExpires < Date.now()) {
            return res.status(400).json({ message: "Érvénytelen vagy lejárt token" });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        await userService.updatePassword(user.id, hashedPassword);
        await userService.clearResetToken(user.id);

        res.status(200).json({ message: "Jelszó sikeresen frissítve" });
    } catch (error) {
        next(error);
    }
};