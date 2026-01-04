const { Model, DataTypes } = require("sequelize");

const authUtils = require("../utilities/authUtils");

module.exports = (sequelize) =>
{
    class User extends Model {};

   User.init(
{
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: "username"
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: "email",
        validate: {
            isEmail: {
                args: true,
                msg: "Invalid email format",
            }
        }
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
            this.setDataValue("password", authUtils.hashPassword(value));
        }
    },

    isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },

    // 🔥 ÚJ MEZŐK A JELSZÓ-VISSZAÁLLÍTÁSHOZ
    resetToken: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    resetTokenExpires: {
        type: DataTypes.DATE,
        allowNull: true,
    }
},
{
    sequelize,
    modelName: "User",
    createdAt: "registeredAt",
    updatedAt: false,

    scopes: {
        public: {
            attributes: ["name", "email", "registeredAt", "isAdmin"],
            include: {
                association: "orders",
                attributes: ["product_name", "price", "orderedAt"],
            }
        },

        admin: {
            where: { isAdmin: true },
        }
    }
});

    return User;
}