import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "src/models/enums/user.enum";
import getEnv from "../utils/envHelper";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id?: number;
        uuid: string;
        role: UserRole;
        organizationId?: number;
      };
    }
  }
}

/**
 * Authentication middleware for protected routes.
 * Returns 401 if token is missing, expired, or invalid.
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
        role: UserRole;
        organizationId?: number;
      };

      if (!Object.values(UserRole).includes(decoded.role)) {
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
        return res.status(401).json({
          message: "Unauthorized: Session expired, please log in again",
        });
      }

      return res
        .status(401)
        .json({ message: "Unauthorized: Invalid or malformed token" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const checkUser = (
  allowedRoles: UserRole[] = Object.values(UserRole),
  model: any = null,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const targetId = Number(req.params.id);

    if (!user) return res.status(401).json({ message: "Not authenticated" });

    if (!allowedRoles.includes(user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied: unauthorized role" });
    }

    if (user.role === UserRole.STUDENT) {
      if (model) {
        try {
          const modelData = await model.findByPk(targetId);

          if (!modelData) {
            return res.status(404).json({ message: "Resource not found" });
          }

          if (modelData.userId !== user.id) {
            return res.status(403).json({
              message: "Access denied: you can only access your own resources.",
            });
          }
        } catch (error) {
          return res
            .status(500)
            .json({ message: "Database verification failed" });
        }
      } else if (user.id !== targetId) {
        return res.status(403).json({
          message:
            "Access denied: a student can only modify their own account.",
        });
      }
    }

    next();
  };
};
