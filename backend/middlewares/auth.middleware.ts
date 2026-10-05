import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { Model, ModelStatic } from "sequelize";
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

interface OwnableModelInstance extends Model {
  id: number;
  userId?: number | null;
}

export const checkUser = <M extends OwnableModelInstance>(
  allowedRoles: UserRole[] = Object.values(UserRole),
  model?: ModelStatic<M> | null,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!allowedRoles.includes(user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied: unauthorized role" });
    }

    if (req.method === "POST" && user.role === UserRole.STUDENT && model) {
      if (req.body?.userId && Number(req.body.userId) !== user.id) {
        return res.status(403).json({
          message:
            "Access denied: you cannot create resources for another user.",
        });
      }
      if (req.body) {
        req.body.userId = user.id;
      }
      return next();
    }

    if (req.params.id) {
      const targetId = Number(req.params.id);
      if (Number.isNaN(targetId) || targetId <= 0) {
        return res.status(400).json({ message: "Invalid resource identifier" });
      }

      if (model) {
        try {
          const resource = await model.findByPk(targetId);
          if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
          }

          if (user.role === UserRole.STUDENT && resource.userId !== user.id) {
            return res.status(403).json({
              message: "Access denied: you can only access your own resources.",
            });
          }
        } catch (error) {
          console.error("[checkUser] Database error:", error);
          return res
            .status(500)
            .json({ message: "Database verification failed" });
        }
      } else if (user.role === UserRole.STUDENT && user.id !== targetId) {
        return res.status(403).json({
          message:
            "Access denied: a student can only modify their own account.",
        });
      }
    }

    return next();
  };
};
