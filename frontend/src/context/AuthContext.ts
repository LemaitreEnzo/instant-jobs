import { createContext, useContext } from "react";
import type { AuthContextType } from "../interfaces/Auth.interface";

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
