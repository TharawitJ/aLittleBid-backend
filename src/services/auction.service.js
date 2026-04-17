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

const UPDATE_AUCTION_FIELDS = [
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
  if (!result) throw createError(404, "Invalid auction");
  return result;
}

export async function updateAuctionById(id, data) {
  const result = await prisma.auction.update({
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
export async function createUserAuction(userId, productId, data) {
  const user = await validateAndFetchUser(userId);
  validateSellerRole(user);
  await validateProductOwnerAndFetch(productId, userId);

  const auctionData = sanitizeData(data, AUCTION_FIELDS);
  const result = await createAuction(auctionData);

  return result;
}

export async function updateUserAuction(auctionId, userId, data) {
  const user = await validateAndFetchUser(userId);
  validateSellerRole(user);

  const auction = await getAuctionById(auctionId);
  await validateProductOwnerAndFetch(auction.productId, userId);
  if (auction.status !== "WAITING") throw createError(403, "Cannot edit when auction status is pass waiting."); 

  const auctionData = sanitizeData(data, UPDATE_AUCTION_FIELDS);
  const result = await updateAuctionById(auctionId, auctionData);

  return result;
}

export async function updateAuctionStatus(auctionId, data) {
}
