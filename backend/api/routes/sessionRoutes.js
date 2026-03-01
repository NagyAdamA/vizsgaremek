const express = require("express");

const router = express.Router();

const sessionController = require("../controllers/sessionController");

const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @openapi
 * /api/sessions:
 *   get:
 *     tags: [Sessions]
 *     summary: Get all sessions for the logged-in user
 *     responses:
 *       200:
 *         description: List of sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Session'
 *       401:
 *         description: Not authenticated
 *   post:
 *     tags: [Sessions]
 *     summary: Create a new training session
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, distance, targetSize, arrowsPerEnd]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Reggeli edzés
 *               distance:
 *                 type: integer
 *                 example: 18
 *                 description: Distance in metres
 *               targetSize:
 *                 type: integer
 *                 example: 40
 *                 description: Target face size in cm
 *               arrowsPerEnd:
 *                 type: integer
 *                 example: 6
 *                 default: 6
 *               notes:
 *                 type: string
 *                 nullable: true
 *                 example: Szeles idő
 *     responses:
 *       201:
 *         description: Session created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Session'
 *       401:
 *         description: Not authenticated
 */
router.get("/", [authMiddleware.userIsLoggedIn], sessionController.getSessions);

router.post("/", [authMiddleware.userIsLoggedIn], sessionController.createSession);

router.param("sessionID", (req, res, next, sessionID) => {
    req.params.sessionID = sessionID;

    next();
});

/**
 * @openapi
 * /api/sessions/{sessionID}:
 *   get:
 *     tags: [Sessions]
 *     summary: Get a single session by ID
 *     parameters:
 *       - name: sessionID
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Session found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Session'
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Session not found
 *   put:
 *     tags: [Sessions]
 *     summary: Update a session
 *     parameters:
 *       - name: sessionID
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
 *               name:
 *                 type: string
 *               distance:
 *                 type: integer
 *               targetSize:
 *                 type: integer
 *               arrowsPerEnd:
 *                 type: integer
 *               notes:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Session updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Session'
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Session not found
 *   delete:
 *     tags: [Sessions]
 *     summary: Delete a session
 *     parameters:
 *       - name: sessionID
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       204:
 *         description: Session deleted
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Session not found
 */
router.get("/:sessionID", [authMiddleware.userIsLoggedIn], sessionController.getSession);

router.put("/:sessionID", [authMiddleware.userIsLoggedIn], sessionController.updateSession);

router.delete("/:sessionID", [authMiddleware.userIsLoggedIn], sessionController.deleteSession);

module.exports = router;
