const db = require("../db");

const { scoreService } = require("../services")(db);

exports.getScores = async (req, res, next) =>
{
    const sessionID = req.params.sessionID;
    const userID = req.user.userID;

    try
    {
        res.status(200).json(await scoreService.getScores(sessionID, userID));
    }
    catch(error)
    {
        next(error);
    }
}

exports.getScore = async (req, res, next) =>
{
    const scoreID = req.params.scoreID;
    const userID = req.user.userID;

    try
    {
        res.status(200).json(await scoreService.getScore(scoreID, userID));
    }
    catch(error)
    {
        next(error);
    }
}

exports.createScore = async (req, res, next) =>
{
    const userID = req.user.userID;
    const { sessionID, endNumber, arrowNumber, score, isX } = req.body || {};

    try
    {
        res.status(201).json(await scoreService.createScore({ 
            userID,
            sessionID, 
            endNumber, 
            arrowNumber, 
            score, 
            isX: isX || false
        }));
    }
    catch(error)
    {
        next(error);
    }
}

exports.createScores = async (req, res, next) =>
{
    const userID = req.user.userID;
    const scores = req.body.scores || [];

    try
    {
        const scoresData = scores.map(score => ({
            userID,
            sessionID: score.sessionID,
            endNumber: score.endNumber,
            arrowNumber: score.arrowNumber,
            score: score.score,
            isX: score.isX || false,
        }));

        res.status(201).json(await scoreService.createScores(scoresData));
    }
    catch(error)
    {
        next(error);
    }
}

exports.updateScore = async (req, res, next) =>
{
    const scoreID = req.params.scoreID;
    const userID = req.user.userID;
    const { score, isX } = req.body || {};

    try
    {
        res.status(200).json(await scoreService.updateScore(scoreID, userID, { 
            score, 
            isX 
        }));
    }
    catch(error)
    {
        next(error);
    }
}

exports.deleteScore = async (req, res, next) =>
{
    const scoreID = req.params.scoreID;
    const userID = req.user.userID;

    try
    {
        await scoreService.deleteScore(scoreID, userID);
        res.sendStatus(204);
    }
    catch(error)
    {
        next(error);
    }
}

