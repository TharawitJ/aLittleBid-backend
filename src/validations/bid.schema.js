import { z } from "zod"
import { bidSchema } from "./shared.schema.js"

export const createBidSchema = bidSchema;

export const updateBidSchema = z.object({
  isWinning: z.boolean(),
});

export const bidIdSchema = z.object({
  id: z.cuid(),  
})
