const { UnauthorizedError, ValidationError } = require("../errors");

const authUtils = require("../utilities/authUtils");

exports.userIsLoggedIn = (req, res, next) =>
{
    const { user_token } = req.cookies || {};

    if(!user_token) return next(new UnauthorizedError());

    try
    {
        req.user = authUtils.verifyToken(user_token);
    }
    catch(error)
    {
        return next(new ValidationError("Sikertelen token érvényesítés"));
    }

    next();
}

exports.isAdmin = (req, res, next) =>
{
    if(!req.user.isAdmin) return next(new UnauthorizedError("Nincs jogosultsága ehhez a funkcióhoz"));

    next();
}