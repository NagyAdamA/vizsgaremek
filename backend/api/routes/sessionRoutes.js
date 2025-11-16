const express = require("express");

const router = express.Router();

const sessionController = require("../controllers/sessionController");

const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", [ authMiddleware.userIsLoggedIn ], sessionController.getSessions);

router.post("/", [ authMiddleware.userIsLoggedIn ], sessionController.createSession);

router.param("sessionID", (req, res, next, sessionID) => 
{
    req.params.sessionID = sessionID;

    next();
});

router.get("/:sessionID", [ authMiddleware.userIsLoggedIn ], sessionController.getSession);

router.put("/:sessionID", [ authMiddleware.userIsLoggedIn ], sessionController.updateSession);

router.delete("/:sessionID", [ authMiddleware.userIsLoggedIn ], sessionController.deleteSession);

module.exports = router;

