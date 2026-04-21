import express from "express";
import { login, register } from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validate.middleware.js";
import { loginSchema, registerSchema } from "../validations/index.js";

// import { login, register } from "../controllers/auth.controlllers.js";
// import * as authController from "../controllers/auth.controlllers.js";

const authRoute = express.Router();

authRoute.post("/login", validate(loginSchema, "body"), login);
authRoute.post("/register", validate(registerSchema, "body"), register);

// ส่วนของ OTP / Forgot Password
// authRoute.post("/request-otp", authController.requestOTP);
// authRoute.post("/verify-otp", authController.verifyOTP);
// authRoute.post("/reset-password", authController.resetPassword);

export default authRoute;