const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) =>
{
    class Score extends Model {};

    Score.init
    (
        {
            ID:
            {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },

            sessionID:
            {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            endNumber:
            {
                type: DataTypes.INTEGER,
                allowNull: false,

                validate:
                {
                    isNumeric: true,
                    min: 1,
                }
            },

            arrowNumber:
            {
                type: DataTypes.INTEGER,
                allowNull: false,

                validate:
                {
                    isNumeric: true,
                    min: 1,
                    max: 12,
                }
            },

            score:
            {
                type: DataTypes.INTEGER,
                allowNull: false,

                validate:
                {
                    isNumeric: true,
                    min: 0,
                    max: 10,
                }
            },

            isX:
            {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            }
        },

        {
            sequelize,
            modelName: "Score",
            createdAt: "createdAt",
            updatedAt: false,
        },
    );

    return Score;
}

