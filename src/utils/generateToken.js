import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    env.Access_token,
    {
      expiresIn: env.Access_token_expire,
    }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
    },
    env.Refresh_token,
    {
      expiresIn: env.Refresh_token_expire,
    }
  );
};