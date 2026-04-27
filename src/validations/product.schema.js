import { imageSchema, productSchema } from "./shared.schema.js"

export const createProductSchema = productSchema;

export const updateProductSchema = productSchema.partial();

export const createImageSchema = imageSchema;

