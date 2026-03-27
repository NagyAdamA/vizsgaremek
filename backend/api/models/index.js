module.exports = (sequelize) =>
{
    const User = require("./User")(sequelize);

    const Order = require("./Order")(sequelize);

    const Session = require("./Session")(sequelize);

    const Score = require("./Score")(sequelize);

    User.hasMany(Order, 
    {
        foreignKey: "userID",

        as: "orders",

        constraints: false,
    });

    Order.belongsTo(User, 
    {
        foreignKey: "userID",

        as: "user",

        constraints: false,
    });

    User.hasMany(Session, 
    {
        foreignKey: "userID",

        as: "sessions",

        constraints: false,
    });

    Session.belongsTo(User, 
    {
        foreignKey: "userID",

        as: "user",

        constraints: false,
    });

    Session.hasMany(Score, 
    {
        foreignKey: "sessionID",

        as: "scores",

        constraints: false,
    });

    Score.belongsTo(Session, 
    {
        foreignKey: "sessionID",

        as: "session",

        constraints: false,
    });

    return { User, Order, Session, Score };
}