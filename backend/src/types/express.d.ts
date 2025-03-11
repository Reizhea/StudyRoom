import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      authUser?: {
        id: string;
        email: string;
      };
    }
  }
}
