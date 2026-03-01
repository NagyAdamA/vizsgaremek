const { BadRequestError, NotFoundError } = require("../errors");
const authUtils = require("../utilities/authUtils");
const crypto = require("crypto");

class UserService {
    constructor(db) {
        this.userRepository = require("../repositories")(db).userRepository;
        this.mailService = null;
    }

    setMailService(mailService) {
        this.mailService = mailService;
    }

    async getUsers() {
        return await this.userRepository.getUsers();
    }

    async getUser(userID, includePassword = false) {
        if (!userID) throw new BadRequestError("Missing user identification from payload");

        const user = await this.userRepository.getUser(userID, includePassword);

        if (!user) throw new NotFoundError("Can not found user with this user identification",
            {
                data: userID
            });

        return user;
    }

    async createUser(userData) {
        if (!userData) throw new BadRequestError("Missing user data from payload", { data: userData });
        if (!userData.name) throw new BadRequestError("Missing username from payload", { data: userData });
        if (!userData.password) throw new BadRequestError("Missing password from payload", { data: userData });
        if (!userData.email) throw new BadRequestError("Missing email from payload", { data: userData });

        const verificationToken = crypto.randomBytes(32).toString("hex");

        const newUser = {
            ...userData,
            verificationToken: verificationToken,
            isVerified: false
        };

        const user = await this.userRepository.createUser(newUser);

        if (this.mailService) {
            try {
                await this.mailService.sendVerificationEmail(user.email, verificationToken);
            } catch (error) {
                console.error("Error sending verification email:", error);
            }
        }

        return user;
    }

    async verifyEmail(token) {
        const user = await this.userRepository.getUserByVerificationToken(token);
        if (!user) throw new BadRequestError("Érvénytelen vagy lejárt megerősítő token");

        await this.userRepository.updateUser({ isVerified: true, verificationToken: null }, user.ID);
        return { message: "Email cím sikeresen megerősítve" };
    }

    async requestPasswordReset(email) {
        if (!email) throw new BadRequestError("Email cím kötelező");

        try {
            const user = await this.getUser(email);

            const resetToken = crypto.randomBytes(32).toString("hex");
            const resetExpires = new Date(Date.now() + 3600000); // 1 hour

            await this.userRepository.updateUser({
                resetPasswordToken: resetToken,
                resetPasswordExpires: resetExpires
            }, user.ID);

            if (this.mailService) {
                try {
                    await this.mailService.sendPasswordResetEmail(user.email, resetToken);
                } catch (error) {
                    console.error("Error sending password reset email:", error);
                }
            }

            return { message: "Jelszó emlékeztető email elküldve (ha létezik a fiók)" };
        } catch (error) {
            if (error instanceof NotFoundError) {
                return { message: "Jelszó emlékeztető email elküldve (ha létezik a fiók)" };
            }
            throw error;
        }
    }


    async resetPassword(token, newPassword) {
        const user = await this.userRepository.getUserByResetToken(token);
        if (!user) throw new BadRequestError("Érvénytelen vagy lejárt token");

        await this.userRepository.updateUser({
            password: newPassword,
            resetPasswordToken: null,
            resetPasswordExpires: null
        }, user.ID);

        return { message: "Jelszó sikeresen megváltoztatva" };
    }
}

module.exports = UserService;