import { getBidById } from "../services/bid.service.js";
import { getProductById } from "../services/product.service.js";
import { getUserById } from "../services/user.service.js";
import createError from "http-errors";

export function randBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const sanitizeData = (data, allowedFields) => {
  return Object.fromEntries(
    // make into object
    Object.entries(data).filter(
      // .entries make into entries [ [name: Ting] , etc. ]
      ([key, value]) => allowedFields.includes(key) && value !== undefined,
    ),
  );
};

export function validateSellerRole(user) {
  if (user.role !== "SELLER") {
    throw createError(403, "Access denied: Seller permissions required.");
  }
}

export async function validateProductOwnerAndFetch(productId, userId) {
  const product = await getProductById(productId);
  if (!product) throw createError(404, "Product not found.");
  if (product.sellerId !== userId)
    throw createError(
      403,
      "Access denied: Product owner permissions required.",
    );
  return product;
}

export async function validateBidOwnerAndFetch(bidId, userId) {
  const bid = await getBidById(bidId);

  if (bid.bidderId !== userId)
    throw createError(
      403,
      "Access denied: Bid owner permissions required.",
    );
  return bid;
}

export function isBiddableDuration(auction) {
  const now = new Date();

  if (auction.status !== "ACTIVE") {
    throw createError(400, `Cannot bid now. This auction is currently ${auction.status.toLowerCase()}.`);
  }

  if (now < auction.startTime) {
    throw createError(400, "This auction hasn't started yet.");
  }

  if (now > auction.endTime) {
    throw createError(400, "This auction has already ended.");
  }
}

export function isBiddableAmount(auction, bidAmount) {
  
      const highestBid = Number(auction.bids[0]?.amount) || 0;
      const startingPrice = Number(auction.startingPrice) || 0;
      const minIncrement = Number(auction.minIncrement);
  
      const currentHighestPrice = highestBid || startingPrice;
       const minimumBid = currentHighestPrice + minIncrement;
      

      if (bidAmount < minimumBid) {
        throw  createError(400, `Bid must be higher than current price and must increase by ${minIncrement} THB.`);
      }

      return true;
}

export function isAuctionableTime(startTime, endTime) {
  const now = new Date();

  if (startTime < now) {
    throw createError(400, `Start time cannot be in the past.`);
  }

  if (endTime < now) {
    throw createError(400, "End time cannot be in the past.");
  }

  if (endTime <= startTime) {
    throw createError(400, "End time cannot be less than start time.");
  }
}
