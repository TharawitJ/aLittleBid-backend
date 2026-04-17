import prisma from "../lib/prismaClient.js";
import createError from "http-errors";

import {
  sanitizeData,
  validateAndFetchUser,
  validateProductOwnerAndFetch,
  validateSellerRole,
} from "../utils/helpers.js";

const AUCTION_FIELDS = [
  "productId",
  "startTime",
  "endTime",
  "startingPrice",
  "reservePrice",
  "minIncrement",
  "status",
];

export async function createAuction(data) {
  const result = await prisma.auction.create({
    data: data,
  });
  return result;
}

export async function getAllAuctions() {
  const result = await prisma.auction.findMany();
  return result;
}

export async function getAuctionById(id) {
  const result = await prisma.auction.findUnique({
    where: { id },
  });

  return result;
}

export async function updateAuctionById(id, data) {
  const result = await prisma.auction.delete({
    where: { id },
    data: data,
  });
  return result;
}

export async function deleteAuctionById(id) {
  const result = await prisma.auction.delete({
    where: { id },
  });
  return result;
}

/// SPECIFIC SERVICE
export async function createUserAction(userId, productId, data) {
  const user = await validateAndFetchUser(userId);
  validateSellerRole(user);
  await validateProductOwnerAndFetch(productId, userId);

  const auctionData = sanitizeData(data, AUCTION_FIELDS);
  const result = await createAuction(auctionData);

  return result;
}
