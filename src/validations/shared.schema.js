import { z } from "zod"

export const addressSchema = z.object({
  label     : z.string().min(1),
  street    : z.string().min(1),
  city      : z.string().min(1),
  state     : z.string().min(1),
  postalCode: z.string().min(1),
  country   : z.string().min(1),
  isDefault : z.boolean().optional(),
});

export const personalSchema = z.object({
 firstname: z.string().min(1),
  lastname : z.string().min(1),
  email    : z.email(),
  username : z.string().min(1),
  password : z.string().min(6),
  phone    : z.string().min(8),
});

export const productSchema = z.object({
  name        : z.string().min(1),
  description : z.string().min(1),
  categoryId  : z.coerce.number().int().positive(),
})

