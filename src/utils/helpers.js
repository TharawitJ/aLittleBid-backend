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

export async function validateAndFetchUser(userId) {
    const user = await getUserById(userId);
    if (!user) throw createError(404, "Invalid user");
    return user;
}

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