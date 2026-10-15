import type React from "react";
import type { UserRole } from "../types/enum.type";
import type { Organization } from "./models.interface";
import type { Staff, Student, User } from "./user.interface";

export interface AuthContextType {
  user: User | Staff | Student | null;
  setUser: React.Dispatch<React.SetStateAction<User | Staff | Student | null>>;
  role: UserRole | null;
  organization: Organization | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (
    credentials: { email: string; password: string } | Partial<User>,
  ) => Promise<User | Staff | Student>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User | Staff | Student | null>;
}

export interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles?: UserRole[];
}
