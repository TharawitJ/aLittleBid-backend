import { createCheckoutSession } from "../services/stripe.service";

export async function createCheckoutController(req, res, next) {
  const auctionId = req.params.auctionId;
  const userId = req.user.id;
  // do i need to check that the userId is theBidderId i guess so

  try {
    const responses = await createCheckoutSession(auctionId, req.body);
    res.status(201).json({
      message: "Checkout session created successfully",
      clientSecret: responses.client_secret ,
    });
  } catch (error) {
    next(error);
  }
}