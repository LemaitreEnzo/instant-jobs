import type React from "react";
import type { Role } from "../types/global.type";
import type { Student, User } from "./user.interface";

export interface AuthContextType {
  user: User | Student | null;
  role: Role | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (
    credentials: { email: string; password: string } | Partial<User>,
  ) => Promise<User | Student>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User | Student | null>;
}

export interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles?: Role[];
}
