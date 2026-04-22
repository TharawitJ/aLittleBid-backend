import { z } from "zod"
import { auctionSchema } from "./shared.schema.js"

export const createAuctionSchema = auctionSchema
.refine(data => data.endTime > data.startTime, {
  message: "endTime must be after startTime",
  path   : ["endTime"],
}).and(
  z.object({
    productId: z.coerce.number().int().positive(), 
  })
);

export const updateAuctionSchema = auctionSchema
  .partial()
  .refine(data => {
    if (data.startTime && data.endTime) {
      return data.endTime > data.startTime
    }
    return true 
  }, {
    message: "endTime must be after startTime",
    path   : ["endTime"],
  });
