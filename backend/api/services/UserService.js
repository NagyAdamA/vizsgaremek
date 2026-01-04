const { BadRequestError, NotFoundError } = require("../errors");

class UserService
{
    constructor(db)
    {
        this.userRepository = require("../repositories")(db).userRepository;
    }

    async getUsers()
    {
        return await this.userRepository.getUsers();
    }

    async getUser(userID, includePassword = false)
    {
        if(!userID) throw new BadRequestError("Missing user identification from payload");

        const user = await this.userRepository.getUser(userID, includePassword);

        if(!user) throw new NotFoundError("Can not found user with this user identification",
        {
            data: userID
        });

        return user;
    }

    async createUser(userData)
    {
        if(!userData) throw new BadRequestError("Missing user data from payload",
        {
            data: userData,
        });

        if(!userData.name) throw new BadRequestError("Missing username from payload",
        {
            data: userData,
        });

        if(!userData.password) throw new BadRequestError("Missing password from payload",
        {
            data: userData,
        });

        if(!userData.email) throw new BadRequestError("Missing email from payload",
        {
            data: userData,
        });

        return await this.userRepository.createUser(userData);
    }

    // Jelszó-visszaállítás
    async getUserByEmail(email)
    {
        if (!email) throw new BadRequestError("Missing email from payload");

        const user = await this.userRepository.getUserByEmail(email);

        if (!user) throw new NotFoundError("User not found with this email", { data: email });

        return user;
    }

    async setResetToken(userId, token, expires)
    {
        if (!userId || !token || !expires)
            throw new BadRequestError("Missing reset token data");

        return await this.userRepository.setResetToken(userId, token, expires);
    }

    async getUserByResetToken(token)
    {
        if (!token) throw new BadRequestError("Missing reset token");

        const user = await this.userRepository.getUserByResetToken(token);

        if (!user) throw new NotFoundError("Invalid or expired reset token", { data: token });

        return user;
    }

    async updatePassword(userId, hashedPassword)
    {
        if (!userId || !hashedPassword)
            throw new BadRequestError("Missing password update data");

        return await this.userRepository.updatePassword(userId, hashedPassword);
    }

    async clearResetToken(userId)
    {
        if (!userId) throw new BadRequestError("Missing user ID for clearing reset token");

        return await this.userRepository.clearResetToken(userId);
    }
}

module.exports = UserService;