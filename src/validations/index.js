import { z } from "zod";

export * from "./shared.schema.js"
export * from "./auth.schema.js"
export * from "./product.schema.js"
// export * from "./bid.schema.js"
// export * from "./auction.schema.js"

// BELOW IS BLUEPRINT
const baseXSchema = z.object({

});

export const createXSchema = baseXSchema;
export const updateXSchema = baseXSchema.partial();
export const xIdSchema     = z.object({ id: z.string() });
export const xQuerySchema  = z.object({ 
    /* pagination, filters */ });