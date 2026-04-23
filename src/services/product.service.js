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
    include: {images: true,
      auctions: true
    }
  });
  if (!result) throw createError(404, "Product not found.");
  return result;
}

export async function deleteProductById(id) {
  const result = await prisma.product.delete({
    where: { id }
  });
  return result;
}

export async function createProduct(data) {
    const result = prisma.product.create({
    data: data,
  });
  return result;
}

export async function updateProduct(id, data) {
   const result = prisma.product.update({
    where: {id: id},
    data: data,
  });
  return result;
}

export async function deleteUserProduct(id, userId) {
    await validateProductOwnerAndFetch(id, userId);
    const result = await deleteProductById(id);
  return result;
}

export async function createSellerProduct(userId, data) {
  const user = await getUserById(userId);

  validateSellerRole(user);

  await getValidCategory(data.categoryId);

  const productData = sanitizeData(data, PRODUCT_FIELDS);
  productData.sellerId = user.id;

  const result = await createProduct(productData);
  
  return result;
}

export async function updateUserProduct(id, userId, data) {
  const user = await getUserById(userId);

  validateSellerRole(user);

  await validateProductOwnerAndFetch(id, userId);
  
  const updateProductData = sanitizeData(data, PRODUCT_FIELDS);
  
  if (updateProductData.categoryId) await getValidCategory(updateProductData.categoryId);

  const result = await updateProduct(id, updateProductData)

  return result;
}

export async function validateProductOwnerAndFetch(productId, userId) {
  const product = await getProductById(productId);
  if (!product) throw createError(404, "Product not found.");
  if (product.sellerId !== userId) throw createError(403, "Access denied: Product owner permissions required.");
  return product;
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