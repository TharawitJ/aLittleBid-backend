import { z } from "zod"
import { productSchema } from "./shared.schema.js"

export const createProductSchema = productSchema;

export const updateProductSchema = productSchema.partial();
