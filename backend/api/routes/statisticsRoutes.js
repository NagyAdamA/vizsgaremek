const express = require("express");

const router = express.Router();

const statisticsController = require("../controllers/statisticsController");

const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @openapi
 * /api/statistics:
 *   get:
 *     tags: [Statistics]
 *     summary: Get overall statistics for the logged-in user
 *     responses:
 *       200:
 *         description: Aggregated statistics across all sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *         description: Not authenticated
 */
router.get("/", [authMiddleware.userIsLoggedIn], statisticsController.getUserStatistics);

router.param("sessionID", (req, res, next, sessionID) => {
    req.params.sessionID = sessionID;

    next();
});

/**
 * @openapi
 * /api/statistics/session/{sessionID}:
 *   get:
 *     tags: [Statistics]
 *     summary: Get statistics for a specific session
 *     parameters:
 *       - name: sessionID
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Aggregated statistics for the session
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Session not found
 */
router.get("/session/:sessionID", [authMiddleware.userIsLoggedIn], statisticsController.getSessionStatistics);

module.exports = router;
