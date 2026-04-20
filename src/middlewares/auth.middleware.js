import createError from "http-errors";
import { verifyToken } from "../utils/jwt.js";

export async function authCheck(req, res, next) {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      throw createError(401, "Unauthorized");
    }

    const token = authorization.split(" ")[1];
    const payload = verifyToken(token);

    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
}

export default authCheck;