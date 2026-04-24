import { ZodError } from "zod"

// target = "body", "query", "params"
export const validate = (schema, target = "body") =>
  (req, res, next) => {
    const result = schema.safeParse(req[target])
    if (!result.success) {
      console.log("--- Validation Failed at zod---");
      return next(result.error);
    }
    req[target] = result.data  
    next()
  }