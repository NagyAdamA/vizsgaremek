const UserRepository = require("./UserRepository");

const SessionRepository = require("./SessionRepository");

const ScoreRepository = require("./ScoreRepository");

module.exports = (db) =>
{
    const userRepository = new UserRepository(db);

    const sessionRepository = new SessionRepository(db);

    const scoreRepository = new ScoreRepository(db);

    return { userRepository, sessionRepository, scoreRepository };
}