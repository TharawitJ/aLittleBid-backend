import { createStripeCheckoutSession, confirmStripeCheckoutSession, getOrdersForUser } from "../services/stripe.service.js";

export async function createCheckoutController(req, res, next) {
    const { auctionId } = req.params;
    try {
        const session = await createStripeCheckoutSession(auctionId, req.body);
        res.status(201).json({
            message: "Checkout session created successfully",
            clientSecret: session.client_secret,
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