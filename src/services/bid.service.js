import prisma from "../lib/prismaClient.js";
import createError from "http-errors";
import { getUserById } from "./user.service.js";
import { getAuctionById } from "./auction.service.js";
import { isBiddableDuration, sanitizeData } from "../utils/helpers.js";

const BID_FIELDS = [
  "bidderId",
  "auctionId", 
  "amount"
];

const UPDATE_BID_FIELDS = [
  "isWinning"
];

export async function createBid(data) {
  const result = await prisma.bid.create({
    data: data
  });
  return result;
}

export async function getAllBids() {
  const result = await prisma.bid.findMany();
  return result;
}

export async function getBidById(id) {
  const result = await prisma.bid.findUnique({
    where: { id }
  });

  return result;
}

export async function updateBidById(id, data) {
  const result = await prisma.bid.delete({
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
  // check user exist
   const user = await getUserById(userId);
  // check auction exist
  const auction = await getAuctionById(auctionId);

  // guard on time
  isBiddableDuration(auction);
  
  const bidData = sanitizeData(data, BID_FIELDS);
  bidData.bidderId = userId;
  
  const result = await createBid(bidData);
  return result;
}

export async function updateBidStatus(bidId, data) {
  // update to isWinning
}