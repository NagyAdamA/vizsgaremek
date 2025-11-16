const express = require("express");

const router = express.Router();

const scoreController = require("../controllers/scoreController");

const authMiddleware = require("../middlewares/authMiddleware");

router.get("/session/:sessionID", [ authMiddleware.userIsLoggedIn ], scoreController.getScores);

router.post("/", [ authMiddleware.userIsLoggedIn ], scoreController.createScore);

router.post("/bulk", [ authMiddleware.userIsLoggedIn ], scoreController.createScores);

router.param("scoreID", (req, res, next, scoreID) => 
{
    req.params.scoreID = scoreID;

    next();
});

router.get("/:scoreID", [ authMiddleware.userIsLoggedIn ], scoreController.getScore);

router.put("/:scoreID", [ authMiddleware.userIsLoggedIn ], scoreController.updateScore);

router.delete("/:scoreID", [ authMiddleware.userIsLoggedIn ], scoreController.deleteScore);

module.exports = router;

