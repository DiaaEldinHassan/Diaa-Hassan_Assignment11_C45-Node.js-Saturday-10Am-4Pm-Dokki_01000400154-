import jwt from "jsonwebtoken";
import { role } from "../index.js";
import { sys_sk, user_sk } from "../../../Config/config.service.js";

export function generateToken(
  payload,
  options = {
    accessOptions: { expiresIn: "15m" },
    refreshOptions: { expiresIn: "7d" },
  },
) {
  const tokenData = {
    id: payload.user._id,
    username: payload.user.userName,
    role: payload.user.role,
    email: payload.user.email,
    gender: payload.user.gender,
    privateKey:payload.user.encryptedPrivateKey,
  };

  const isUser = payload.user.role === role.User;
  const secretKey = isUser ? user_sk : sys_sk;
  const audience = isUser ? role.User : role.Admin;

  const accessSignOptions = { ...options.accessOptions, audience };
  const refreshSignOptions = { ...options.refreshOptions, audience };

  return {
    accessToken: jwt.sign(tokenData, secretKey, accessSignOptions),
    refreshToken: jwt.sign(tokenData, secretKey, refreshSignOptions),
  };
}
export function verifyToken(token) {
  const payload = jwt.decode(token);

  if (!payload || !payload.role) {
    throw new Error("Invalid token payload");
  }

  const isUser = payload.role === role.User;
  const secretKey = isUser ? user_sk : sys_sk;
  const expectedAudience = isUser ? role.User : role.Admin;

  return jwt.verify(token, secretKey, { audience: expectedAudience });
}
