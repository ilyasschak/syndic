import express from "express";
import AuthController from "../controllers/authController.js";
import upload from "../helpers/storeImage.js";
import verifyToken from "../middleware/verifyToken.js";
import multer from "multer";

const router = express.Router();

// router.post("/register", upload.single('image'), AuthController.register);

/**
 * @swagger
 * 
 * /api/auth/register:
 *   post:
 *     summary: Register a new user.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       description: User registration data.
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               address:
 *                 type: string
 *               role:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: User registered successfully.
 *       400:
 *         description: Registration error. Error message provided in the response.
 */
router.post('/register', (req, res) => {
    upload.single('image')(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
      } else if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
      } else if (err) {
        return res.status(500).json({ error: 'Internal server error' });
      }
      AuthController.register(req, res);
    });
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in as a registered user.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       description: User login data.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully.
 *       400:
 *         description: Login error. Error message provided in the response.
 */
router.post("/login", AuthController.login);

/**
 * @swagger
 * /api/auth/verify:
 *   get:
 *     summary: Verify a user's account.
 *     tags:
 *       - Authentication
 *     parameters:
 *       - name: token
 *         in: query
 *         description: Verification token received via email.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User's account has been successfully verified.
 *       500:
 *         description: Verification error. Error message provided in the response.
 */
router.get("/verify",verifyToken, AuthController.verifyAccount);

/**
 * @swagger
 * /api/auth/forgetpassword:
 *   post:
 *     summary: Request a password reset email.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       description: User's email for password reset.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset email sent successfully. Check your inbox.
 *       400:
 *         description: Password reset request error. Error message provided in the response.
 */
router.post("/forgetpassword", AuthController.forgetPassword);

/**
 * @swagger
 * /api/auth/resetpassword/{token}:
 *   post:
 *     summary: Reset the user's password.
 *     tags:
 *       - Authentication
 *     parameters:
 *       - name: token
 *         in: path
 *         description: Reset password token received via email.
 *         required: true
 *         schema:
 *           type: string
 *       - name: password
 *         in: body
 *         description: New password for the user.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             password:
 *               type: string
 *       - name: confirmedPassword
 *         in: body
 *         description: Confirm the new password.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             confirmedPassword:
 *               type: string
 *     responses:
 *       200:
 *         description: Password reset successful.
 *       400:
 *         description: Password reset error. Error message provided in the response.
 */
router.post("/resetpassword/:token", verifyToken, AuthController.resetPassword);

/**
 * @swagger
 * /api/auth/logout:
 *   get:
 *     summary: Logout the user.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: User logged out successfully.
 *       400:
 *         description: Logout error. Error message provided in the response.
 */
router.get("/logout", verifyToken, AuthController.logout)


export default router;