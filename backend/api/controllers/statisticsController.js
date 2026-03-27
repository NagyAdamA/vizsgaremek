const db = require("../db");

const { statisticsService } = require("../services")(db);

exports.getUserStatistics = async (req, res, next) =>
{
    const userID = req.user.userID;

    try
    {
        res.status(200).json(await statisticsService.getUserStatistics(userID));
    }
    catch(error)
    {
        next(error);
    }
}

exports.getSessionStatistics = async (req, res, next) =>
{
    const sessionID = req.params.sessionID;
    const userID = req.user.userID;

    try
    {
        res.status(200).json(await statisticsService.getSessionStatistics(sessionID, userID));
    }
    catch(error)
    {
        next(error);
    }
}

