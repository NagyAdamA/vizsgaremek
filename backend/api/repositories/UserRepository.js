const { DbError } = require("../errors");
const { Op } = require("sequelize");

class UserRepository {
    constructor(db) {
        this.User = db.User;
        this.sequelize = db.sequelize;
    }

    async getUsers() {
        try {
            return await this.User.scope(["public"]).findAll();
        } catch (error) {
            throw new DbError("Failed to fetch users", {
                details: error.message,
            });
        }
    }

    async getUser(userID, includePassword = false) {
        try {
            const query = {
                where: {
                    [Op.or]: [{ ID: userID }, { name: userID }, { email: userID }],
                },
            };

            if (includePassword) {
                return await this.User.findOne(query);
            } else {
                return await this.User.scope(["public"]).findOne(query);
            }
        } catch (error) {
            throw new DbError("Failed to fetch user", {
                details: error.message,
                data: userID,
            });
        }
    }

    async createUser(userData) {
        try {
            return await this.User.create(userData);
        } catch (error) {
            throw new DbError("Failed to create user object", {
                details: error.message,
                data: userData,
            });
        }
    }

    async deleteUser(userID) {
        try {
            return await this.User.destroy({
                where: {
                    [Op.or]: [{ ID: userID }, { name: userID }, { email: userID }],
                },
            });
        } catch (error) {
            throw new DbError("Failed to delete user from database", {
                details: error.sqlMessage,
                data: { userID },
            });
        }
    }

    async updateUser(userData, userID = userData.ID) {
        try {
            return await this.User.update(
                { ...userData },
                {
                    where: {
                        ID: userID,
                    },
                }
            );
        } catch (error) {
            throw new DbError("Failed to update user", {
                details: error.message,
                data: { userData },
            });
        }
    }

    // ----------------------------------------------------
    // 🔐 Jelszó-visszaállítási funkciók
    // ----------------------------------------------------

    async getUserByEmail(email) {
        try {
            return await this.User.findOne({
                where: { email },
            });
        } catch (error) {
            throw new DbError("Failed to fetch user by email", {
                details: error.message,
                data: email,
            });
        }
    }

    async setResetToken(userId, token, expires) {
        try {
            return await this.User.update(
                {
                    resetToken: token,
                    resetTokenExpires: expires,
                },
                {
                    where: { ID: userId },
                }
            );
        } catch (error) {
            throw new DbError("Failed to set reset token", {
                details: error.message,
                data: { userId, token },
            });
        }
    }

    async getUserByResetToken(token) {
        try {
            return await this.User.findOne({
                where: {
                    resetToken: token,
                    resetTokenExpires: { [Op.gt]: Date.now() }, // még érvényes
                },
            });
        } catch (error) {
            throw new DbError("Failed to fetch user by reset token", {
                details: error.message,
                data: token,
            });
        }
    }

    async updatePassword(userId, hashedPassword) {
        try {
            return await this.User.update(
                { password: hashedPassword },
                { where: { ID: userId } }
            );
        } catch (error) {
            throw new DbError("Failed to update password", {
                details: error.message,
                data: { userId },
            });
        }
    }

    async clearResetToken(userId) {
        try {
            return await this.User.update(
                {
                    resetToken: null,
                    resetTokenExpires: null,
                },
                {
                    where: { ID: userId },
                }
            );
        } catch (error) {
            throw new DbError("Failed to clear reset token", {
                details: error.message,
                data: { userId },
            });
        }
    }
}

module.exports = UserRepository;