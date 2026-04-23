import prisma from "../lib/prismaClient.js";
import createError from "http-errors";

import {
  sanitizeData,
  validateProductOwnerAndFetch,
  validateSellerRole,
} from "../utils/helpers.js";
import { getUserById } from "./user.service.js";

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

export async function getAuctionById(id, tx) {
  const db = tx || prisma;
  const result = await db.auction.findUnique({
    where: { id },
    include: { bids: {
      orderBy: {
        amount: 'desc',
      }
    }}
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

export async function updateManyAuctions(whereObject, updateData) {
  const result = await prisma.auction.updateMany({
    where: whereObject,
    data: updateData
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
export async function getAuctionByProductId(id) {
  const result = await prisma.auction.findFirst({
    where: { productId: id },
  });
  if (!result) throw createError(404, "No auction available this product");
  return result;
}

export async function getAuctionsByProductId(id) {
  const result = await prisma.auction.findMany({
    where: { productId: id },
  });
  if (!result) throw createError(404, "No auction available this product");
  return result;
}

export async function createUserAuction(userId, productId, data) {
  const user = await getUserById(userId);
  validateSellerRole(user);
  await validateProductOwnerAndFetch(productId, userId);

  const auctionExist = await getAuctionByProductId(productId);
  if (auctionExist) throw createError(403, "Auction already exist for this product");
  // check that status !CLOSED_SOLD

  const auctionData = sanitizeData(data, AUCTION_FIELDS);
  const result = await createAuction(auctionData);

  return result;
}

export async function updateUserAuction(auctionId, userId, data) {
  const user = await getUserById(userId);
  validateSellerRole(user);

  const auction = await getAuctionById(auctionId);
  await validateProductOwnerAndFetch(auction.productId, userId);
  if (auction.status !== "WAITING") throw createError(403, "Cannot edit when auction status is pass waiting."); 

  const auctionData = sanitizeData(data, UPDATE_AUCTION_FIELDS);
  const result = await updateAuctionById(auctionId, auctionData);

  return result;
}

export async function deleteUserAuction(auctionId, userId) {
  const user = await getUserById(userId);
  validateSellerRole(user);

  const auction = await getAuctionById(auctionId);
  await validateProductOwnerAndFetch(auction.productId, userId);

  const result = await deleteAuctionById(auctionId);
  return result;
}

// CRON JOBS
export async function startAuctions() {
  const now = new Date();

  const whereObject = { 
    status: "WAITING", 
    startTime: { lte: now }
  };

  const updateData = { status: "ACTIVE"}

  const result = await updateManyAuctions(whereObject, updateData);
  // console.log(result);

  if (result.count > 0) {
    console.log(`Started ${result.count} auctions.`);
  }
}

export async function endAuctions() {
  const now = new Date();

  const whereObject = { 
    status: "ACTIVE", 
    endTime: { lte: now }
  };

  const updateData = { status: "CLOSED_UNSOLD"}

  const result = await updateManyAuctions(whereObject, updateData);

  if (result.count > 0) {
    console.log(`Ended ${result.count} auctions.`);
  }
}
