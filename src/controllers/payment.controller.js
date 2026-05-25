import { createStripeCheckoutSession, confirmStripeCheckoutSession, getOrdersForUser, createTopUpCheckoutSession } from "../services/stripe.service.js";

export async function createCheckoutController(req, res, next) {
    const { auctionId } = req.params;
    try {
        const session = await createStripeCheckoutSession(auctionId, { 
            ...req.body, 
            email: req.user.email 
        });
        res.status(201).json({
            message: "Checkout session created successfully",
            clientSecret: session.client_secret,
        });
    } catch (error) {
        next(error);
    }
}

export async function createTopUpController(req, res, next) {
    try {
        const userId = req.user.id;
        const { amount } = req.body;
        if (!amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: "Invalid amount" });
        }
        const session = await createTopUpCheckoutSession(userId, amount, req.user.email);
        res.status(201).json({
            message: "Top-up session created successfully",
            url: session.url,
        });
    } catch (error) {
        next(error);
    }
}

export async function confirmCheckoutController(req, res, next) {
    try {
        const { sessionId } = req.params;
        const result = await confirmStripeCheckoutSession(sessionId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export async function getMyPaymentsController(req, res, next) {
    try {
        const userId = req.user.id;
        const orders = await getOrdersForUser(userId);
        res.status(200).json({ message: "OK", responses: orders });
    } catch (error) {
        next(error);
    }
}