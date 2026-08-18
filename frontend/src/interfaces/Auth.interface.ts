import type { Role } from "../types/global.type";

export interface AuthContextType {
  isLoggedIn: boolean;
  role: Role;
  loading: boolean;
}

export interface ProtectedRouteProps {
  children: React.ReactElement;
}
