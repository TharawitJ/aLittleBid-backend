import prisma from "../lib/prismaClient.js";
import createError from "http-errors";

export async function getAllProducts() {
  const result = await prisma.product.findMany({
    include: {images: true}
  });

  return result;
}