// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

export const requireAuth = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = await User.findById(decoded._id).select("-password");
    next();
  } catch (err) {
    res.status(401).json({ message: "Token invalid or expired" });
  }
});

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Insufficient role" });
    }
    next();
  };
};
