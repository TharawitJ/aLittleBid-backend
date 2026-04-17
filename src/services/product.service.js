import prisma from "../lib/prismaClient.js";
import createError from "http-errors";

const PRODUCT_FIELDS = [
  "name", "description", "categoryId", "sellerId"
];

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
  const user = await getUserById(userId);
  if (!user) throw createError(404, "Invalid user");

  if (user.role !== "SELLER") throw createError(404, "Invalid permission to add product.");

  const productData = {}
  productData.userId = user.id;
  
  sanitizeData(data, PRODUCT_FIELDS);
  console.log(newAddressData);


  const result = prisma.product.create({
    data: newAddressData,
  });

  return result;
}

export async function updateProduct(userId, data) {
   // check if user exist
  const user = await getUserById(userId);
  if (!user) throw createError(404, "Invalid user");

  // check if the user role is SELLER
  const newAddressData = sanitizeData(data, PRODUCT_FIELDS);
  console.log(newAddressData);
  newAddressData.userId = userId;

  // check if the user owns the product

  const result = prisma.product.create({
    data: newAddressData,
  });

  return result;
}

////////////////////////////////////////////////////////
// CATEGORY SERVICE

export async function getAllCategories() {
  const result = await prisma.category.findMany();
  return result;
}