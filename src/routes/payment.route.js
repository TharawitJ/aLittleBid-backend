import express from "express";
import authCheck from "../middlewares/auth.middleware.js";
import { createCheckoutController } from "../controllers/payment.controller.js";

const paymentRoutes = express.Router();

paymentRoutes.post('/auction/:auctionId/bid/:bidId', authCheck, createCheckoutController);

export default paymentRoutes;
