/**
 * Authentication context definition and consumer hook.
 */
import { createContext, useContext } from "react";
import type { AuthContextType } from "../interfaces/Auth.interface";

export const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Accesses the current authentication context.
 *
 * @returns The active AuthContextType object containing session state and actions.
 * @throws Error if called outside of an AuthProvider tree.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
