import Stripe from "stripe";
import prisma from "../lib/prismaClient.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function createStripeCheckoutSession(auctionId, data) {
    const session = await stripe.checkout.sessions.create({
        ui_mode: "embedded_page",
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'thb',
                    product_data: { name: data.productName ?? 'Auction Lot' },
                    unit_amount: Math.round(Number(data.price) * 100),
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        return_url: `${process.env.CLIENT_URL}/complete?session_id={CHECKOUT_SESSION_ID}`,
    });

    // Task B1: Insert a Payment row at session creation
    await prisma.payment.create({
        data: {
            auctionId: Number(auctionId),
            amount: Number(data.price),
            currency: "THB",
            method: "CREDIT_CARD",
            status: "PENDING",
            gatewayReference: session.id,
        },
    });

    return session;
}

export async function confirmStripeCheckoutSession(sessionId) {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Stripe says paid? Update our row.
    if (session.payment_status === "paid") {
        const updated = await prisma.payment.update({
            where: { gatewayReference: sessionId },
            data: {
                status: "SUCCESS",
                paidAt: new Date(),
                gatewayResponse: session,
            },
        });

        // Update auction status to SOLD
        await prisma.auction.update({
            where: { id: updated.auctionId },
            data: { status: "SOLD" }
        });

        return { status: "SUCCESS", payment: updated };
    }

    // Otherwise leave it as PENDING / FAILED based on Stripe's verdict
    return { status: "PENDING", reason: session.payment_status };
}

export async function getOrdersForUser(userId) {
    // Query Auctions where the user has the winning bid
    return prisma.auction.findMany({
        where: {
            status: { in: ["SOLD", "CLOSED"] },
            bids: {
                some: {
                    bidderId: userId,
                    isWinning: true
                }
            }
        },
        include: {
            product: {
                include: { images: true }
            },
            bids: {
                where: {
                    isWinning: true
                }
            },
            payments: {
                orderBy: {
                    createdAt: 'desc'
                },
                take: 1
            }
        },
        orderBy: { updatedAt: "desc" },
    });
}

// SPECIFIC SERVICE
export async function createUserCheckoutSession(userid, auctionId, data) {
      //  check that bid exist
      // check that bid is highest
      // call stripe checkout 

}