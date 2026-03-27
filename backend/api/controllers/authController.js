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

    if (bcrypt.compareSync(password, user.password)) {

        if (user.isVerified === false) {
            return res.status(403).json({ message: "Kérjük, erősítse meg email címét a bejelentkezéshez!" });
        }

        const token = authUtils.generateUserToken(user);

        authUtils.setCookie(res, "user_token", token);

        res.status(200).json(token);
    }
    else {
        res.status(401).json({ message: "Hibás jelszó" });
    }
}

exports.status = (req, res, next) => {
    res.status(200).json(req.user);
}

exports.logout = (req, res, next) => {
    res.clearCookie("user_token",
        {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            path: "/",
        });

    res.status(200).json({ message: "Sikeres kijelentkezés" });
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
