import express from "express";
// import { login, register } from "../controllers/auth.controllers.js";
import * as authController from "../controllers/auth.controllers.js";
import authCheck from "../middlewares/auth.middleware.js";

const authRoute = express.Router();

authRoute.post("/login", authController.login);
authRoute.post("/register", authController.register);
authRoute.get("/me", authCheck, authController.getMe);

// ส่วนของ OTP Forgot Password
authRoute.post("/request-otp", authController.requestOTP);
authRoute.post("/verify-otp", authController.verifyOTP);
authRoute.post("/reset-password", authController.resetPassword);

// ส่วนของ Google Login
authRoute.post("/google", authController.googleLogin);

export default authRoute;
