import { ZodError } from "zod"

// target = "body", "query", "params"
export const validate = (schema, target = "body") =>
  (req, res, next) => {
    const result = schema.safeParse(req[target])
    if (!result.success) {
      return res.status(400).json({ errors: result.error.flatten().fieldErrors })
    }
    req[target] = result.data  
    next()
  }