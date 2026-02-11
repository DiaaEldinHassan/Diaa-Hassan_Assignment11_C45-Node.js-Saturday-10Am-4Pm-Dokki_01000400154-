import { throwError, verifyToken, role } from "../index.js";

export function authorization(aud = [role.User]) {
  return async (req, res, next) => {
    try {
      const header = req.headers.authorization || req.headers.Authorization;
      if (!header?.startsWith("Bearer")) throwError("Unauthenticated");

      const token = header.split(" ")[1];

      const verifiedPayload = await verifyToken(token);

      if (!aud.includes(verifiedPayload.role)) {
        return res.status(403).json({ message: "Forbidden: Access Denied" });
      }

      req.user = verifiedPayload;
      next();
    } catch (error) {
      next(error);
    }
  };
}