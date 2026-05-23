import Stripe from "stripe";
import prisma from "../lib/prismaClient.js";
import { depositMoney } from "./wallet.service.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function createStripeCheckoutSession(auctionId, data) {
    const session = await stripe.checkout.sessions.create({
        ui_mode: "embedded_page",
        payment_method_types: ['card'],
        customer_email: data.email,
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
        metadata: {
            auctionId: auctionId.toString(),
            type: 'AUCTION'
        }
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

export async function createTopUpCheckoutSession(userId, amount, email) {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        customer_email: email,
        line_items: [
            {
                price_data: {
                    currency: 'thb',
                    product_data: { 
                        name: 'Wallet Top-up',
                        description: `Deposit for user ID: ${userId}`
                    },
                    unit_amount: Math.round(Number(amount) * 100),
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${process.env.CLIENT_URL}/user_profile?status=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL}/user_profile?status=cancel`,
        metadata: {
            userId: userId.toString(),
            type: 'TOPUP',
            amount: amount.toString()
        }
    });

    // Create a Payment record for the top-up
    await prisma.payment.create({
        data: {
            amount: Number(amount),
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
        const payment = await prisma.payment.findUnique({
            where: { gatewayReference: sessionId }
        });

        if (!payment || payment.status === "SUCCESS") {
            return { status: "SUCCESS", payment };
        }

        const updated = await prisma.payment.update({
            where: { gatewayReference: sessionId },
            data: {
                status: "SUCCESS",
                paidAt: new Date(),
                gatewayResponse: session,
            },
        });

        const type = session.metadata?.type;

        if (type === 'AUCTION') {
            // Update auction status to SOLD
            await prisma.auction.update({
                where: { id: updated.auctionId },
                data: { status: "SOLD" }
            });
        } else if (type === 'TOPUP') {
            const userId = parseInt(session.metadata.userId);
            const amount = parseInt(session.metadata.amount);
            await depositMoney(userId, amount);
        }

        return { status: "SUCCESS", payment: updated };
    }

    // Otherwise leave it as PENDING / FAILED based on Stripe's verdict
    return { status: "PENDING", reason: session.payment_status };
}

export async function getOrdersForUser(userId) {
    // Query Auctions where the user has the winning bid
    return prisma.auction.findMany({
        where: {
            status: { in: ["SOLD", "CLOSED_UNSOLD"] },
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