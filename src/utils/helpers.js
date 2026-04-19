import { getProductById } from "../services/product.service.js";
import { getUserById } from "../services/user.service.js";
import createError from "http-errors";

export function randBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const sanitizeData = (data, allowedFields) => {
  return Object.fromEntries( // make into object
    Object.entries(data).filter( // .entries make into entries [ [name: Ting] , etc. ]
      ([key, value]) => allowedFields.includes(key) && value !== undefined
    )
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
  if (product.sellerId !== userId) throw createError(403, "Access denied: Product owner permissions required.");
  return product;
}

export function isBiddableDuration(auction) {
  const now = new Date();

  if (auction.status !== "ACTIVE") {
    throw createError(400, `This auction is currently ${auction.status.toLowerCase()}.`);
  }

  if (now < auction.startTime) {
    throw createError(400, "This auction hasn't started yet.");
  }

  if (now > auction.endTime) {
    throw createError(400, "This auction has already ended.");
  }
}