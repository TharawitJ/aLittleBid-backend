import prisma from "../lib/prismaClient.js";
import createError from "http-errors";
import { sanitizeData, validateSellerRole } from "../utils/helpers.js";
import { getUserById } from "./user.service.js";

const PRODUCT_FIELDS = [
  "name", "description", "categoryId"
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

  validateSellerRole(user);

  await getValidCategory(data.categoryId);

  const productData = sanitizeData(data, PRODUCT_FIELDS);
  productData.sellerId = user.id;

  const result = prisma.product.create({
    data: productData,
  });

  return result;
}

export async function updateProduct(id, userId, data) {
  const user = await getUserById(userId);
  validateSellerRole(user);

  // check if the user owns the product
  const product = await getProductById(id)
  if (product.sellerId !== userId) throw createError(403, "Access denied: Product owner permissions required.");
  
  const updateProductData = sanitizeData(data, PRODUCT_FIELDS);

  const result = prisma.product.update({
    where: {id},
    data: updateProductData,
  });

  return result;
}

////////////////////////////////////////////////////////
// CATEGORY SERVICE

export async function getAllCategories() {
  const result = await prisma.category.findMany();
  return result;
}

export async function getValidCategory(id) {
    const category = await prisma.category.findUnique({where: {id}});
    if (!category) throw createError(404, "Category not found");
    return category;
}