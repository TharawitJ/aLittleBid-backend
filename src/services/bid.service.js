import prisma from "../lib/prismaClient.js";
import createError from "http-errors";
import { getUserById } from "./user.service.js";
import { getAuctionById } from "./auction.service.js";
import { isBiddableDuration, sanitizeData, validateBidOwnerAndFetch } from "../utils/helpers.js";

export const BID_FIELDS = [
  "bidderId",
  "auctionId", 
  "amount"
];

export const UPDATE_BID_FIELDS = [
  "isWinning"
];

export async function createBid(data, tx) {
  const db = tx || "prisma";
  const result = await db.bid.create({
    data: data
  });
  return result;
}

export async function getAllBids() {
  const result = await prisma.bid.findMany();
  return result;
}

export async function getBidsWhere(whereObject, includeObject) {
  const result = await prisma.bid.findMany({
    where: whereObject,
    include: includeObject || {}
  });
  return result;
}

export async function getBidById(id) {
  const result = await prisma.bid.findUnique({
    where: { id }
  });
  if (!result) throw createError(404, "Bid not found.");
  return result;
}

export async function updateBidById(id, data) {
  const result = await prisma.bid.update({
    where: { id },
    data: data
  });
  return result;
}

export async function deleteBidById(id) {
  const result = await prisma.bid.delete({
    where: { id }
  });
  return result;
}

// SPECIFIC BID SERVICE
export async function placeBid(userId, auctionId, data) {
  await getUserById(userId);
  console.log('data', data)
  console.log('amount', data.amount)
  const bidAmount = data.amount;

  return await prisma.$transaction(async (tx) => {
   
      const auction = await getAuctionById(auctionId, tx);

      // guard on time
      isBiddableDuration(auction);

      const currentPrice = Number(auction.bids[0]?.amount) || 0;

      if (bidAmount <= currentPrice) {
      throw new Error("Bid must be higher than current price");
      }

      const bidData = sanitizeData(data, BID_FIELDS);
      bidData.bidderId = userId;

      return await createBid(bidData, tx);

  });
}

export async function deleteUserBid(bidId, userId) {
   await getUserById(userId);

   const bid =  await validateBidOwnerAndFetch(bidId, userId);

   const result = await deleteBidById(bid.id);
   return result;
}

export async function updateBidStatus(bidId, data) {
  await getBidById(bidId);
  const updateBidStatus = sanitizeData(data, UPDATE_BID_FIELDS);

  const result = await updateBidById(bidId, updateBidStatus);
  return result;
}

export async function getBidsProductsByUserId(userId) {

  await getUserById(userId);
 
  const whereObject = {
    bidderId: userId
  };

const includeObject =  {
    auction: {
      include: {
        product: true, 
      },
    },
  }

  const result = await getBidsWhere(whereObject, includeObject);
  return result;
}

// get userAllBidsByUserId
// - userId, bids auction, include product, join 3 tables