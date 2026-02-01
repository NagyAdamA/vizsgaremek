const UserService = require("./UserService");

const SessionService = require("./SessionService");

const ScoreService = require("./ScoreService");

const StatisticsService = require("./StatisticsService");

const MailService = require("./MailService");

module.exports = (db) => {
    const userService = new UserService(db);

    const sessionService = new SessionService(db);

    const scoreService = new ScoreService(db);

    const statisticsService = new StatisticsService(db);

    const mailService = new MailService();

    // Inject mailService into userService
    userService.setMailService(mailService);

    return { userService, sessionService, scoreService, statisticsService, mailService };
}