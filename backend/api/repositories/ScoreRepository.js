const { DbError } = require("../errors");

const { Op } = require("sequelize");

class ScoreRepository
{
    constructor(db)
    {
        this.Score = db.Score;

        this.Session = db.Session;

        this.sequelize = db.sequelize;
    }

    async getScores(sessionID, userID)
    {
        try
        {
            return await this.Score.findAll(
            {
                include:
                [
                    {
                        association: "session",
                        where:
                        {
                            ID: sessionID,
                            userID: userID,
                        },
                        required: true,
                    }
                ],
                order: [["endNumber", "ASC"], ["arrowNumber", "ASC"]],
            });
        }
        catch(error)
        {
            throw new DbError("Failed to fetch scores", 
            {
                details: error.message,
            });
        }
    }

    async getScore(scoreID, userID)
    {
        try
        {
            return await this.Score.findOne(
            {
                where:
                {
                    ID: scoreID,
                },
                include:
                [
                    {
                        association: "session",
                        where:
                        {
                            userID: userID,
                        },
                        required: true,
                    }
                ]
            });
        }
        catch(error)
        {
            throw new DbError("Failed to fetch score", 
            {
                details: error.message,
                data: scoreID,
            });
        }
    }

    async createScore(scoreData)
    {
        try
        {
            return await this.Score.create(scoreData);
        }
        catch(error)
        {
            throw new DbError("Failed to create score", 
            {
               details: error.message,
               data: scoreData, 
            });
        }
    }

    async createScores(scoresData)
    {
        try
        {
            return await this.Score.bulkCreate(scoresData);
        }
        catch(error)
        {
            throw new DbError("Failed to create scores", 
            {
               details: error.message,
               data: scoresData, 
            });
        }
    }

    async updateScore(scoreID, userID, scoreData)
    {
        try
        {
            const score = await this.getScore(scoreID, userID);
            
            if(!score) throw new DbError("Score not found");

            return await this.Score.update(scoreData, 
            {
                where:
                {
                    ID: scoreID,
                }
            });
        }
        catch(error)
        {
            throw new DbError("Failed to update score", 
            { 
                details: error.message, 
                data: { scoreID, scoreData } 
            });
        }
    }

    async deleteScore(scoreID, userID)
    {
        try
        {
            const score = await this.getScore(scoreID, userID);
            
            if(!score) throw new DbError("Score not found");

            return await this.Score.destroy(
            {
                where:
                {
                    ID: scoreID,
                }
            });
        }
        catch(error)
        {
            throw new DbError("Failed to delete score", 
            { 
                details: error.message, 
                data: { scoreID } 
            });
        }
    }

    async deleteScoresBySession(sessionID, userID)
    {
        try
        {
            return await this.Score.destroy(
            {
                include:
                [
                    {
                        association: "session",
                        where:
                        {
                            ID: sessionID,
                            userID: userID,
                        },
                        required: true,
                    }
                ]
            });
        }
        catch(error)
        {
            throw new DbError("Failed to delete scores", 
            { 
                details: error.message, 
                data: { sessionID } 
            });
        }
    }
}

module.exports = ScoreRepository;

