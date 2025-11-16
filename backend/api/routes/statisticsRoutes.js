const express = require("express");

const router = express.Router();

const statisticsController = require("../controllers/statisticsController");

const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", [ authMiddleware.userIsLoggedIn ], statisticsController.getUserStatistics);

router.param("sessionID", (req, res, next, sessionID) => 
{
    req.params.sessionID = sessionID;

    next();
});

router.get("/session/:sessionID", [ authMiddleware.userIsLoggedIn ], statisticsController.getSessionStatistics);

module.exports = router;

