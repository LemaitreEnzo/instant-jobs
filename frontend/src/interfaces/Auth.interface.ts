import type { Role } from "../types/global.type";
import type { Student, User } from "./user.interface";

export interface AuthContextType {
  user: User | Student;
  role: Role;
  loading: boolean;
}

export interface ProtectedRouteProps {
  children: React.ReactElement;
}
