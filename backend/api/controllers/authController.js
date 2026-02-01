const bcrypt = require("bcrypt");

const db = require("../db");

const { userService } = require("../services")(db);

const authUtils = require("../utilities/authUtils");

exports.login = async (req, res, next) => {
    const { userID, password } = req.body;

    let user;

    try {
        user = await userService.getUser(userID, true);
    }
    catch (error) {
        return next(error);
    }

    // Check if user is verified? Or allow login anyway?
    // Often we block login if not verified.
    // But requirement was "email verification", usually implies blocking or at least warning.
    // For now, I won't block existing users, but new users might be blocked.
    // Users are created with isVerified: false.
    // If I block, I should check `user.isVerified`.
    // Let's add that check if the user wants strictly verification.
    // "help me implement nodemailer for an email verification ... feature"
    // Usually means you verify before you can use the account.

    if (user.isVerified === false) {
        // Allow for now or block? safely, maybe just warn?
        // Let's block to demonstrate the feature working.
        // return res.status(401).json({ message: "Kérjük, erősítse meg email címét a bejelentkezéshez!" });
    }

    if (bcrypt.compareSync(password, user.password)) {
        // Only check verification if password is correct to avoid enumerating verified status easily?
        // Actually, better to check password first.

        if (user.isVerified === false) {
            return res.status(403).json({ message: "Kérjük, erősítse meg email címét a bejelentkezéshez!" });
        }

        const token = authUtils.generateUserToken(user);

        authUtils.setCookie(res, "user_token", token);

        res.status(200).json(token);
    }
    else {
        res.status(401).json({ message: "Wrong password" });
    }
}

exports.status = (req, res, next) => {
    res.status(200).json(req.user);
}

exports.logout = (req, res, next) => {
    res.clearCookie("user_token",
        {
            httpOnly: true,
            secure: process.env.NODE_ENV == "production",
            sameSite: "strict",
            path: "/",
        });

    res.status(200).json({ message: "Logged out successfully" });
}

exports.verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.body;
        const result = await userService.verifyEmail(token);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
}

exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const result = await userService.requestPasswordReset(email);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
}

exports.resetPassword = async (req, res, next) => {
    try {
        const { token, password } = req.body;
        const result = await userService.resetPassword(token, password);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
}