import createError from "http-errors";
import { verifyToken } from "../utils/jwt.js";
import jwt from "jsonwebtoken";
import { findUserById } from "../services/auth.service.js";

export async function authCheck(req, res, next) {
  // console.log("Headers received:", req.headers.authorization);
  try {
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith("Bearer ")) {
      throw createError(401, "Unauthorized: No token provided");
    }

    const token = authorization.split(" ")[1];
    console.log("Token extracted:", token);

    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
    const user = await findUserById(payload.id);
    if (!user) {
      throw createError(401, "Unauthorized: User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}
export default authCheck;
