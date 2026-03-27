const { BadRequestError } = require("../errors");

const { Op } = require("sequelize");

class StatisticsService
{
    constructor(db)
    {
        this.sessionRepository = require("../repositories")(db).sessionRepository;
        this.scoreRepository = require("../repositories")(db).scoreRepository;
        this.Session = db.Session;
        this.Score = db.Score;
    }

    async getUserStatistics(userID)
    {
        if(!userID) throw new BadRequestError("Missing user identification");

        try
        {
            const sessions = await this.Session.findAll(
            {
                where:
                {
                    userID: userID,
                },
                include:
                [
                    {
                        association: "scores",
                        required: false,
                    }
                ]
            });

            const totalSessions = sessions.length;

            let totalArrows = 0;
            let totalScore = 0;
            let totalXCount = 0;
            let totalEnds = 0;

            const sessionStats = [];

            for(const session of sessions)
            {
                const scores = session.scores || [];
                const sessionArrows = scores.length;
                const sessionScore = scores.reduce((sum, s) => sum + s.score, 0);
                const sessionXCount = scores.filter(s => s.isX).length;
                const sessionEnds = scores.length > 0 ? Math.max(...scores.map(s => s.endNumber)) : 0;

                totalArrows += sessionArrows;
                totalScore += sessionScore;
                totalXCount += sessionXCount;
                totalEnds += sessionEnds;

                const avgScore = sessionArrows > 0 ? (sessionScore / sessionArrows).toFixed(2) : 0;

                sessionStats.push(
                {
                    sessionID: session.ID,
                    sessionName: session.name,
                    date: session.createdAt,
                    arrows: sessionArrows,
                    totalScore: sessionScore,
                    averageScore: parseFloat(avgScore),
                    xCount: sessionXCount,
                    ends: sessionEnds,
                });
            }

            const overallAverage = totalArrows > 0 ? (totalScore / totalArrows).toFixed(2) : 0;
            const xPercentage = totalArrows > 0 ? ((totalXCount / totalArrows) * 100).toFixed(2) : 0;

            return {
                totalSessions,
                totalArrows,
                totalScore,
                totalXCount,
                totalEnds,
                overallAverage: parseFloat(overallAverage),
                xPercentage: parseFloat(xPercentage),
                sessionStats: sessionStats.sort((a, b) => new Date(b.date) - new Date(a.date)),
            };
        }
        catch(error)
        {
            throw new BadRequestError("Failed to calculate statistics", 
            {
                details: error.message,
            });
        }
    }

    async getSessionStatistics(sessionID, userID)
    {
        if(!sessionID) throw new BadRequestError("Missing session ID from payload");

        if(!userID) throw new BadRequestError("Missing user identification");

        const session = await this.sessionRepository.getSession(sessionID, userID);

        if(!session) throw new BadRequestError("Session not found");

        const scores = session.scores || [];

        const totalArrows = scores.length;
        const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
        const totalXCount = scores.filter(s => s.isX).length;
        const totalEnds = scores.length > 0 ? Math.max(...scores.map(s => s.endNumber)) : 0;

        const avgScore = totalArrows > 0 ? (totalScore / totalArrows).toFixed(2) : 0;
        const xPercentage = totalArrows > 0 ? ((totalXCount / totalArrows) * 100).toFixed(2) : 0;

        const endStats = [];
        const ends = {};

        scores.forEach(score =>
        {
            if(!ends[score.endNumber])
            {
                ends[score.endNumber] = [];
            }
            ends[score.endNumber].push(score);
        });

        Object.keys(ends).sort((a, b) => parseInt(a) - parseInt(b)).forEach(endNumber =>
        {
            const endScores = ends[endNumber];
            const endTotal = endScores.reduce((sum, s) => sum + s.score, 0);
            const endXCount = endScores.filter(s => s.isX).length;
            const endAverage = (endTotal / endScores.length).toFixed(2);

            endStats.push(
            {
                endNumber: parseInt(endNumber),
                arrows: endScores.length,
                totalScore: endTotal,
                averageScore: parseFloat(endAverage),
                xCount: endXCount,
            });
        });

        return {
            sessionID: session.ID,
            sessionName: session.name,
            distance: session.distance,
            targetSize: session.targetSize,
            arrowsPerEnd: session.arrowsPerEnd,
            date: session.createdAt,
            totalArrows,
            totalScore,
            totalXCount,
            totalEnds,
            averageScore: parseFloat(avgScore),
            xPercentage: parseFloat(xPercentage),
            endStats,
        };
    }
}

module.exports = StatisticsService;

