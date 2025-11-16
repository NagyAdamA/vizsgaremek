const db = require("../db");

const { sessionService } = require("../services")(db);

exports.getSessions = async (req, res, next) =>
{
    const userID = req.user.userID;

    try
    {
        res.status(200).json(await sessionService.getSessions(userID));
    }
    catch(error)
    {
        next(error);
    }
}

exports.getSession = async (req, res, next) =>
{
    const sessionID = req.params.sessionID;
    const userID = req.user.userID;

    try
    {
        res.status(200).json(await sessionService.getSession(sessionID, userID));
    }
    catch(error)
    {
        next(error);
    }
}

exports.createSession = async (req, res, next) =>
{
    const userID = req.user.userID;
    const { name, distance, targetSize, arrowsPerEnd, notes } = req.body || {};

    try
    {
        res.status(201).json(await sessionService.createSession({ 
            userID, 
            name, 
            distance, 
            targetSize, 
            arrowsPerEnd, 
            notes 
        }));
    }
    catch(error)
    {
        next(error);
    }
}

exports.updateSession = async (req, res, next) =>
{
    const sessionID = req.params.sessionID;
    const userID = req.user.userID;
    const { name, distance, targetSize, arrowsPerEnd, notes } = req.body || {};

    try
    {
        res.status(200).json(await sessionService.updateSession(sessionID, userID, { 
            name, 
            distance, 
            targetSize, 
            arrowsPerEnd, 
            notes 
        }));
    }
    catch(error)
    {
        next(error);
    }
}

exports.deleteSession = async (req, res, next) =>
{
    const sessionID = req.params.sessionID;
    const userID = req.user.userID;

    try
    {
        await sessionService.deleteSession(sessionID, userID);
        res.sendStatus(204);
    }
    catch(error)
    {
        next(error);
    }
}

