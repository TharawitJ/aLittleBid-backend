import { ZodError } from "zod";

export default function errorHandler(err, re, res, next) {
 console.log("--- ERROR DETECTED ---");
  console.dir(err); 

  let status = err.status || 500;
  let message = err.message || "Internal server error";
  let errors = {};

  if (err instanceof ZodError) {
    status = 400;
    message = "Validation Error";
    errors = err.format();
    console.log(errors);
  }

  res.status(status).json({
    success: false,
    message: message,
    errors: errors
  });
}
