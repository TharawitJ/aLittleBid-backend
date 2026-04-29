import express from "express";
import authCheck from "../middlewares/auth.middleware.js";
import { createCheckoutController, confirmCheckoutController, getMyPaymentsController } from "../controllers/payment.controller.js";

const paymentRoutes = express.Router();

paymentRoutes.post('/auction/:auctionId/bid/:bidId', authCheck, createCheckoutController);
paymentRoutes.get('/session/:sessionId', authCheck, confirmCheckoutController);
paymentRoutes.get('/me', authCheck, getMyPaymentsController);

export default paymentRoutes;