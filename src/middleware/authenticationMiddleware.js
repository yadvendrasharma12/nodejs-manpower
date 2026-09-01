import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const authenticationMiddleware = (req, res, next) => {
  try {
    const token = req.headers["x-token"];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Required authentication token",
      });
    }

    const decoded = jwt.verify(token, env.Access_token);

    req.user = decoded;

    next();
    
  } catch (error) {
    console.error("Authentication error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    return res.status(404).json({
      success: false,
      message: "Invalid authentication token",
    });
  }
};