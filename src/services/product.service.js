import prisma from "../lib/prismaClient.js";
import createError from "http-errors";

export async function getAllProducts() {
  const result = await prisma.product.findMany({
    include: {images: true}
  });

  return result;
}

export async function getProductById(id) {
  const result = await prisma.product.findUnique({
    where: { id },
    include: {images: true}
  });

  return result;
}

export async function deleteProductById(id) {
  const result = await prisma.product.delete({
    where: { id }
  });

  return result;
}

export async function createProduct(userId, data) {
   // check if user exist
  const user = await getUserById(userId);
  if (!user) throw createError(404, "Invalid user");

  const newAddressData = sanitizeData(data, ADDRESS_FIELDS);
  console.log(newAddressData);
  newAddressData.userId = userId;

  const result = prisma.address.create({
    data: newAddressData,
  });

  return result;
}