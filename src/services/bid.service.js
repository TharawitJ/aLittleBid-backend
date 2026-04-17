import prisma from "../lib/prismaClient.js";
import createError from "http-errors";

const BID_FIELDS = [
  "name", "description", "categoryId"
];

export async function createBid(data) {
  const result = await prisma.bid.create({
    data: data
  });
  return result;
}

export async function getAllBid() {
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