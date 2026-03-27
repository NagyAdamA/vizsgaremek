const { BadRequestError, NotFoundError } = require("../errors");

class SessionService
{
    constructor(db)
    {
        this.sessionRepository = require("../repositories")(db).sessionRepository;
    }

    async getSessions(userID)
    {
        if(!userID) throw new BadRequestError("Missing user identification");

        return await this.sessionRepository.getSessions(userID);
    }

    async getSession(sessionID, userID)
    {
        if(!sessionID) throw new BadRequestError("Missing session ID from payload");

        if(!userID) throw new BadRequestError("Missing user identification");

        const session = await this.sessionRepository.getSession(sessionID, userID);

        if(!session) throw new NotFoundError("Can not found session with this ID", 
        {
            data: sessionID
        });

        return session;
    }

    async createSession(sessionData)
    {
        if(!sessionData) throw new BadRequestError("Missing session data from payload", 
        {
            data: sessionData,
        });

        if(!sessionData.userID) throw new BadRequestError("Missing user ID from payload",
        {
            data: sessionData,
        });

        if(!sessionData.name) throw new BadRequestError("Missing session name from payload",
        {
            data: sessionData,
        });

        if(!sessionData.distance) throw new BadRequestError("Missing distance from payload", 
        {
            data: sessionData,
        });

        if(!sessionData.targetSize) throw new BadRequestError("Missing target size from payload", 
        {
            data: sessionData,
        });

        return await this.sessionRepository.createSession(sessionData);
    }

    async updateSession(sessionID, userID, sessionData)
    {
        if(!sessionID) throw new BadRequestError("Missing session ID from payload");

        if(!userID) throw new BadRequestError("Missing user identification");

        const session = await this.sessionRepository.getSession(sessionID, userID);

        if(!session) throw new NotFoundError("Can not found session with this ID", 
        {
            data: sessionID
        });

        return await this.sessionRepository.updateSession(sessionID, userID, sessionData);
    }

    async deleteSession(sessionID, userID)
    {
        if(!sessionID) throw new BadRequestError("Missing session ID from payload");

        if(!userID) throw new BadRequestError("Missing user identification");

        const session = await this.sessionRepository.getSession(sessionID, userID);

        if(!session) throw new NotFoundError("Can not found session with this ID", 
        {
            data: sessionID
        });

        return await this.sessionRepository.deleteSession(sessionID, userID);
    }
}

module.exports = SessionService;

