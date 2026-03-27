const express = require("express");

const router = express.Router();

const scoreController = require("../controllers/scoreController");

const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @openapi
 * /api/scores/session/{sessionID}:
 *   get:
 *     tags: [Scores]
 *     summary: Get all scores for a session
 *     parameters:
 *       - name: sessionID
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: List of scores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Score'
 *       401:
 *         description: Not authenticated
 */
router.get("/session/:sessionID", [authMiddleware.userIsLoggedIn], scoreController.getScores);

/**
 * @openapi
 * /api/scores:
 *   post:
 *     tags: [Scores]
 *     summary: Create a single score
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [sessionID, endNumber, arrowNumber, score]
 *             properties:
 *               sessionID:
 *                 type: integer
 *                 example: 1
 *               endNumber:
 *                 type: integer
 *                 example: 1
 *               arrowNumber:
 *                 type: integer
 *                 example: 1
 *               score:
 *                 type: integer
 *                 example: 9
 *                 description: Arrow score 0–10
 *               isX:
 *                 type: boolean
 *                 example: false
 *                 description: True if the arrow scored X (inner 10)
 *     responses:
 *       201:
 *         description: Score created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Score'
 *       401:
 *         description: Not authenticated
 */
router.post("/", [authMiddleware.userIsLoggedIn], scoreController.createScore);

/**
 * @openapi
 * /api/scores/bulk:
 *   post:
 *     tags: [Scores]
 *     summary: Create multiple scores at once
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [scores]
 *             properties:
 *               scores:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [sessionID, endNumber, arrowNumber, score]
 *                   properties:
 *                     sessionID:
 *                       type: integer
 *                       example: 1
 *                     endNumber:
 *                       type: integer
 *                       example: 1
 *                     arrowNumber:
 *                       type: integer
 *                       example: 1
 *                     score:
 *                       type: integer
 *                       example: 9
 *                     isX:
 *                       type: boolean
 *                       example: false
 *     responses:
 *       201:
 *         description: Scores created
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Score'
 *       401:
 *         description: Not authenticated
 */
router.post("/bulk", [authMiddleware.userIsLoggedIn], scoreController.createScores);

router.param("scoreID", (req, res, next, scoreID) => {
    req.params.scoreID = scoreID;

    next();
});

/**
 * @openapi
 * /api/scores/{scoreID}:
 *   get:
 *     tags: [Scores]
 *     summary: Get a single score by ID
 *     parameters:
 *       - name: scoreID
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Score found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Score'
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Score not found
 *   put:
 *     tags: [Scores]
 *     summary: Update a score
 *     parameters:
 *       - name: scoreID
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               score:
 *                 type: integer
 *                 example: 10
 *               isX:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Score updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Score'
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Score not found
 *   delete:
 *     tags: [Scores]
 *     summary: Delete a score
 *     parameters:
 *       - name: scoreID
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       204:
 *         description: Score deleted
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Score not found
 */
router.get("/:scoreID", [authMiddleware.userIsLoggedIn], scoreController.getScore);

router.put("/:scoreID", [authMiddleware.userIsLoggedIn], scoreController.updateScore);

router.delete("/:scoreID", [authMiddleware.userIsLoggedIn], scoreController.deleteScore);

module.exports = router;
