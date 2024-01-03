import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import UserController from "../controllers/userController.js";
// import checkRole from "../middleware/checkRole.js";

const router = express.Router();

/**
 * @swagger
 * /api/user/{role}/me:
 *   get:
 *     summary: Get user's profile information.
 *     tags:
 *       - User
 *     parameters:
 *       - name: role
 *         in: path
 *         description: User's role.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User's profile information.
 *       400:
 *         description: Error - You can't perform this operation. Error message provided in the response.
 */
// router.get("/:role/me", verifyToken, /*checkRole,*/ UserController.getMe);
router.get("/me", verifyToken, /*checkRole,*/ UserController.getMe);


export default router;