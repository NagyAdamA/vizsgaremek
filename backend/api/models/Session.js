const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) =>
{
    class Session extends Model {};

    Session.init
    (
        {
            ID:
            {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },

            userID:
            {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            name:
            {
                type: DataTypes.STRING,
                allowNull: false,
            },

            distance:
            {
                type: DataTypes.INTEGER,
                allowNull: false,

                validate:
                {
                    isNumeric: true,
                    min: 1,
                }
            },

            targetSize:
            {
                type: DataTypes.INTEGER,
                allowNull: false,

                validate:
                {
                    isNumeric: true,
                    min: 1,
                }
            },

            arrowsPerEnd:
            {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 6,

                validate:
                {
                    isNumeric: true,
                    min: 1,
                }
            },

            notes:
            {
                type: DataTypes.TEXT,
                allowNull: true,
            }
        },

        {
            sequelize,
            modelName: "Session",
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        },
    );

    return Session;
}

