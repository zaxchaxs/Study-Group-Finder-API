import jwt from "jsonwebtoken";
import type { StringValue } from "ms";
import { JWT_EXPIRED_TOkEN, JWT_SECRET_KEY } from "../data/envData";

export const generateToken = (payload: object, expiresIn?: number | StringValue, secretKey?: string) => {
  return jwt.sign(payload, secretKey ?? JWT_SECRET_KEY, {
    expiresIn: expiresIn ? expiresIn : JWT_EXPIRED_TOkEN as StringValue
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET_KEY);
};