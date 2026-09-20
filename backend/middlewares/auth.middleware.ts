import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import getEnv from "../utils/envHelper";

export const VALID_ROLES = ["student", "admin", "staff"] as const;
export type ValidRole = (typeof VALID_ROLES)[number];

declare global {
  namespace Express {
    interface Request {
      user?:
        | {
            id?: number;
            uuid: string;
            role: string;
            organizationId?: number;
          }
        | undefined;
    }
  }
}

/**
 * Authentication middleware for protected routes.
 * Returns 401 if token is missing, expired, or invalid.
 * Returns 403 if user role is not recognized in VALID_ROLES.
 */
export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const tokenName = getEnv("TOKEN");
    const secret = getEnv("SECRET");

    const token = req.cookies?.[tokenName];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Missing authentication token" });
    }

    try {
      const decoded = jwt.verify(token, secret) as {
        id?: number;
        uuid: string;
        role: string;
        organizationId?: number;
      };

      if (!VALID_ROLES.includes(decoded.role as ValidRole)) {
        return res
          .status(403)
          .json({ message: "Forbidden: Unrecognized or unauthorized role" });
      }

      req.user = decoded;
      return next();
    } catch (jwtError: unknown) {
      if (
        jwtError instanceof jwt.TokenExpiredError ||
        (jwtError &&
          typeof jwtError === "object" &&
          "name" in jwtError &&
          jwtError.name === "TokenExpiredError")
      ) {
        return res
          .status(401)
          .json({ message: "Unauthorized: Session expired, please log in again" });
      }

      return res
        .status(401)
        .json({ message: "Unauthorized: Invalid or malformed token" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default authenticateUser;
