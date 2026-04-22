import { z } from "zod"
import { UserRole } from "../generated/prisma/client.js"; 
import { addressSchema, personalSchema } from "./shared.schema.js";

// AUTH MANAGEMENT
export const loginSchema = z.object({
  email   : z.email(),
  password: z.string().min(1),
})

export const registerSchema = z.object({
  role     : z.string().transform(val => val.toUpperCase()).pipe(z.enum(UserRole)),

  // personal
  ...personalSchema.shape,

  // address
  ...addressSchema.shape,
});

// USER MANAGEMENT MANAGEMENT
export const idSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const updateUserSchema = personalSchema.partial();

export const addressParamsSchema = z.object({
  id       : z.coerce.number().int().positive(),
  addressId: z.coerce.number().int().positive(),
});

export const updateAddressSchema = addressSchema.partial();