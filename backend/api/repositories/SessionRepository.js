const { DbError } = require("../errors");

const { Op } = require("sequelize");

class SessionRepository
{
    constructor(db)
    {
        this.Session = db.Session;

        this.sequelize = db.sequelize;
    }

    async getSessions(userID)
    {
        try
        {
            return await this.Session.findAll(
            {
                where:
                {
                    userID: userID,
                },
                order: [["createdAt", "DESC"]],
                include:
                [
                    {
                        association: "scores",
                        required: false,
                    }
                ]
            });
        }
        catch(error)
        {
            throw new DbError("Failed to fetch sessions", 
            {
                details: error.message,
            });
        }
    }

    async getSession(sessionID, userID)
    {
        try
        {
            return await this.Session.findOne(
            {
                where:
                {
                    ID: sessionID,
                    userID: userID,
                },
                include:
                [
                    {
                        association: "scores",
                        required: false,
                        order: [["endNumber", "ASC"], ["arrowNumber", "ASC"]],
                    }
                ]
            });
        }
        catch(error)
        {
            throw new DbError("Failed to fetch session", 
            {
                details: error.message,
                data: sessionID,
            });
        }
    }

    async createSession(sessionData)
    {
        try
        {
            return await this.Session.create(sessionData);
        }
        catch(error)
        {
            throw new DbError("Failed to create session", 
            {
               details: error.message,
               data: sessionData, 
            });
        }
    }

    async updateSession(sessionID, userID, sessionData)
    {
        try
        {
            return await this.Session.update(sessionData, 
            {
                where:
                {
                    ID: sessionID,
                    userID: userID,
                }
            });
        }
        catch(error)
        {
            throw new DbError("Failed to update session", 
            { 
                details: error.message, 
                data: { sessionID, sessionData } 
            });
        }
    }

    async deleteSession(sessionID, userID)
    {
        try
        {
            return await this.Session.destroy(
            {
                where:
                {
                    ID: sessionID,
                    userID: userID,
                }
            });
        }
        catch(error)
        {
            throw new DbError("Failed to delete session", 
            { 
                details: error.message, 
                data: { sessionID } 
            });
        }
    }
}

module.exports = SessionRepository;

