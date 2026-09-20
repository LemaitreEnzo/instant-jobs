import React, { useCallback, useEffect, useState } from "react";
import type { Student, User } from "../interfaces/user.interface";
import { api } from "../lib/api";
import type { Role } from "../types/global.type";
import { AuthContext } from "./AuthContext";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | Student | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = useCallback(async (): Promise<User | Student | null> => {
    try {
      const currentUser = await api.user.getMe();
      if (currentUser) {
        setUser(currentUser);
        setRole((currentUser.role as Role) || null);
        return currentUser;
      } else {
        setUser(null);
        setRole(null);
        return null;
      }
    } catch {
      setUser(null);
      setRole(null);
      return null;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        const currentUser = await api.user.getMe();
        if (isMounted) {
          if (currentUser) {
            setUser(currentUser);
            setRole((currentUser.role as Role) || null);
          } else {
            setUser(null);
            setRole(null);
          }
        }
      } catch {
        if (isMounted) {
          setUser(null);
          setRole(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(
    async (
      credentials: { email: string; password: string } | Partial<User>,
    ): Promise<User | Student> => {
      setLoading(true);
      try {
        const loggedUser = await api.user.login(credentials);
        setUser(loggedUser);
        setRole((loggedUser.role as Role) || null);
        return loggedUser;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      await api.user.logout();
    } finally {
      setUser(null);
      setRole(null);
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        isAuthenticated: Boolean(user),
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
