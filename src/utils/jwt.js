import jwt from "jsonwebtoken";

export function verifyToken(token) {
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
          algorithms: ["HS256"],
        });
    return payload;
}