import type { NextFunction, Request, Response } from "express";
import { UserRole } from "src/models/enums/user.enum";

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
 * Role-Based Access Control (RBAC) middleware factory.
 * Verifies that the authenticated user (`req.user`) possesses one of the allowed roles.
 *
 * @param allowedRoles - List of permitted UserRole values.
 */
export const checkRole = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) return res.status(401).json({ message: "Not authenticated" });

    const userRole = user.role;

    if (allowedRoles.includes(userRole)) {
      next();
    } else {
      return res
        .status(403)
        .json({ message: "Access denied: Insufficient privileges" });
    }
  };
};
