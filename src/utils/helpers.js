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
    throw createError(403, "Access denied: Bid owner permissions required.");
  return bid;
}

export function isBiddableDuration(auction) {
  const now = new Date();

  if (auction.status !== "ACTIVE") {
    throw createError(
      400,
      `Cannot bid now. This auction is currently ${auction.status.toLowerCase()}.`,
    );
  }

  if (now < auction.startTime) {
    throw createError(400, "This auction hasn't started yet.");
  }

  if (now > auction.endTime) {
    throw createError(400, "This auction has already ended.");
  }
}

export function isBiddableAmount(auction, bidAmount) {
  if (auction.type === "ENGLISH") {
    const highestBid = Number(auction.bids[0]?.amount) || 0;
    const startingPrice = Number(auction.startingPrice) || 0;
    const minIncrement = Number(auction.minIncrement);

    const currentHighestPrice = highestBid || startingPrice;
    const minimumBid = currentHighestPrice + minIncrement;

    if (bidAmount < minimumBid) {
      throw createError(
        400,
        `Bid must be higher than current price and must increase by ${minIncrement} THB.`,
      );
    }
    return true;
  }

  // IZZY to do 
  // if (auction.type === "SEALED_ENGLISH") {
  //   // check against current user's highest bid
  //   // must be higher than current user's highest bid
  // }
  //  if (auction.type === "REVERSE") { // to do check bid must be lower than current lowest bid }
  //  if (auction.type === "SEALED REVERSE") { // to do check bid must be lower than current user's lowest bid }

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

export function convertDateTimeTo24HrTime(dateTime) {
  const dateObj = new Date(dateTime);

  const options = {
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  };

  const formattedTime = dateObj.toLocaleString(undefined, options);

  return formattedTime;
}

// query helper
export function getPrismaOptions(query, searchFields = ["name", "email"]) {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    search = "",
    ...filters // Captures everything else as filters
  } = query;

  // 1. Pagination & Sorting logic
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  // 2. Build Dynamic Filters (Exact matches)
  // Filters out reserved keys and builds the where object
  const where = Object.keys(filters).reduce((acc, key) => {
    if (filters[key]) acc[key] = filters[key];
    return acc;
  }, {});

  // 3. Add Global Search (Partial matches)
  if (search) {
    where.OR = searchFields.map((field) => ({
      [field]: { contains: search, mode: "insensitive" },
    }));
  }

  return {
    skip,
    take,
    orderBy: { [sortBy]: sortOrder },
    where,
  };
}

// export async function getAllUsers(queryParams) {
//   // Define which fields are searchable for this specific model
//   const options = getPrismaOptions(queryParams, ['name', 'email', 'username']);

//   const [data, total] = await prisma.$transaction([
//     prisma.user.findMany(options),
//     prisma.user.count({ where: options.where })
//   ]);

//   return { data, total };
// }
