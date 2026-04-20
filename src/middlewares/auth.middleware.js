import createError from "http-errors";
import jwt from "jsonwebtoken";
import { findUserById } from "../services/auth.service.js";

export async function authCheck(req, res, next) {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      throw createError(401, "Unauthorized");
    }

    const token = authorization.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
}
export default authCheck;