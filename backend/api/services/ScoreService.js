const { BadRequestError, NotFoundError } = require("../errors");

class ScoreService
{
    constructor(db)
    {
        this.scoreRepository = require("../repositories")(db).scoreRepository;
        this.sessionRepository = require("../repositories")(db).sessionRepository;
    }

    async getScores(sessionID, userID)
    {
        if(!sessionID) throw new BadRequestError("Missing session ID from payload");

        if(!userID) throw new BadRequestError("Missing user identification");

        const session = await this.sessionRepository.getSession(sessionID, userID);

        if(!session) throw new NotFoundError("Can not found session with this ID", 
        {
            data: sessionID
        });

        return await this.scoreRepository.getScores(sessionID, userID);
    }

    async getScore(scoreID, userID)
    {
        if(!scoreID) throw new BadRequestError("Missing score ID from payload");

        if(!userID) throw new BadRequestError("Missing user identification");

        const score = await this.scoreRepository.getScore(scoreID, userID);

        if(!score) throw new NotFoundError("Can not found score with this ID", 
        {
            data: scoreID
        });

        return score;
    }

    async createScore(scoreData)
    {
        if(!scoreData) throw new BadRequestError("Missing score data from payload", 
        {
            data: scoreData,
        });

        if(!scoreData.sessionID) throw new BadRequestError("Missing session ID from payload",
        {
            data: scoreData,
        });

        if(scoreData.score === undefined || scoreData.score === null) throw new BadRequestError("Missing score value from payload",
        {
            data: scoreData,
        });

        if(scoreData.score < 0 || scoreData.score > 10) throw new BadRequestError("Score must be between 0 and 10",
        {
            data: scoreData,
        });

        const session = await this.sessionRepository.getSession(scoreData.sessionID, scoreData.userID);

        if(!session) throw new NotFoundError("Can not found session with this ID", 
        {
            data: scoreData.sessionID
        });

        return await this.scoreRepository.createScore(scoreData);
    }

    async createScores(scoresData)
    {
        if(!scoresData || !Array.isArray(scoresData)) throw new BadRequestError("Missing scores data from payload", 
        {
            data: scoresData,
        });

        if(scoresData.length === 0) throw new BadRequestError("Scores array is empty");

        const sessionID = scoresData[0]?.sessionID;
        const userID = scoresData[0]?.userID;

        if(!sessionID || !userID) throw new BadRequestError("Missing session ID or user ID from payload");

        const session = await this.sessionRepository.getSession(sessionID, userID);

        if(!session) throw new NotFoundError("Can not found session with this ID", 
        {
            data: sessionID
        });

        return await this.scoreRepository.createScores(scoresData);
    }

    async updateScore(scoreID, userID, scoreData)
    {
        if(!scoreID) throw new BadRequestError("Missing score ID from payload");

        if(!userID) throw new BadRequestError("Missing user identification");

        const score = await this.scoreRepository.getScore(scoreID, userID);

        if(!score) throw new NotFoundError("Can not found score with this ID", 
        {
            data: scoreID
        });

        if(scoreData.score !== undefined && (scoreData.score < 0 || scoreData.score > 10)) 
        {
            throw new BadRequestError("Score must be between 0 and 10",
            {
                data: scoreData,
            });
        }

        return await this.scoreRepository.updateScore(scoreID, userID, scoreData);
    }

    async deleteScore(scoreID, userID)
    {
        if(!scoreID) throw new BadRequestError("Missing score ID from payload");

        if(!userID) throw new BadRequestError("Missing user identification");

        const score = await this.scoreRepository.getScore(scoreID, userID);

        if(!score) throw new NotFoundError("Can not found score with this ID", 
        {
            data: scoreID
        });

        return await this.scoreRepository.deleteScore(scoreID, userID);
    }
}

module.exports = ScoreService;

