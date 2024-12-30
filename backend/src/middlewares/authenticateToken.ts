import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

interface AuthenticatedRequest extends Request {
  authUser?: {
    id: string;
    email: string;
  };
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.error("No Token Provided");
    res.status(401).json({ error: "No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };

    req.authUser = { id: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired token" });
  }
};
