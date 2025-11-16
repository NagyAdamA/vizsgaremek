const UserService = require("./UserService");

const SessionService = require("./SessionService");

const ScoreService = require("./ScoreService");

const StatisticsService = require("./StatisticsService");

module.exports = (db) =>
{
    const userService = new UserService(db);

    const sessionService = new SessionService(db);

    const scoreService = new ScoreService(db);

    const statisticsService = new StatisticsService(db);

    return { userService, sessionService, scoreService, statisticsService };
}