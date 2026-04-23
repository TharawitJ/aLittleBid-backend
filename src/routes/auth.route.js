import express from "express";
<<<<<<< HEAD
// import { login, register } from "../controllers/auth.controllers.js";
import * as authController from "../controllers/auth.controllers.js";
import authCheck from "../middlewares/auth.middleware.js";

const authRoute = express.Router();

authRoute.post("/login", authController.login);
authRoute.post("/register", authController.register);
authRoute.get("/me", authCheck, authController.getMe);
=======
import { login, register } from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validate.middleware.js";
import { loginSchema, registerSchema } from "../validations/index.js";

// import { login, register } from "../controllers/auth.controlllers.js";
// import * as authController from "../controllers/auth.controlllers.js";

const authRoute = express.Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login to a little bid
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Log in successfully
 *       404:
 *         description: Fail to add log in
 */
authRoute.post("/login", validate(loginSchema, "body"), login);

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register to a little bid
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/Register'
 *     responses:
 *       200:
 *         description: Registered successfully
 *       404:
 *         description: Fail to add Register
 */
authRoute.post("/register", validate(registerSchema, "body"), register);
>>>>>>> dev

// ส่วนของ OTP Forgot Password
authRoute.post("/request-otp", authController.requestOTP);
authRoute.post("/verify-otp", authController.verifyOTP);
authRoute.post("/reset-password", authController.resetPassword);

// ส่วนของ Google Login
authRoute.post("/google", authController.googleLogin);

export default authRoute;
