import jwt, { SignOptions } from "jsonwebtoken";

export const generateToken = (userId: number): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN ??
      "15m") as SignOptions["expiresIn"],
  };

  return jwt.sign({ userId }, secret, options);
};
