import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function createStripeCheckoutSession(auctionId, data) {
    const session = await stripe.checkout.sessions.create({
        ui_mode: "elements",
        payment_method_types: ['card'],
        line_items: [
            {
          price_data: {
            auctionId: auctionId,
            productId: data.productId,
            price: data.price, 
            currency: 'THB',
          },
          quantity: 1,
        },
        ],
        mode: 'payment',
        return_url: `${process.env.CLIENT_URL}/complete?session_id={CHECKOUT_SESSION_ID}`
    });
    return session;
}

// SPECIFIC SERVICE
export async function createUserCheckoutSession(userid, auctionId, data) {
      //  check that the userId is theBidderId pls

}
