import React, { useCallback, useEffect, useState } from "react";
import type { Organization } from "../interfaces/models.interface";
import type { Student, User } from "../interfaces/user.interface";
import { api } from "../lib/api";
import type { UserRole } from "../types/enum.type";
import { AuthContext } from "./AuthContext";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | Student | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = useCallback(async (): Promise<User | Student | null> => {
    try {
      const currentUser = await api.user.getMe();
      if (currentUser) {
        const currentOrganization = await api.organization.fetchOne(
          currentUser.organizationId,
        );
        setUser(currentUser);
        setRole((currentUser.role as UserRole) || null);
        setOrganization(currentOrganization);
        return currentUser;
      } else {
        setUser(null);
        setRole(null);
        setOrganization(null);
        return null;
      }
    } catch {
      setUser(null);
      setRole(null);
      setOrganization(null);
      return null;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      setLoading(true);
      await refreshUser();
      if (isMounted) {
        setLoading(false);
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
        const currentOrganization = await api.organization.fetchOne(
          loggedUser.organizationId,
        );

        setUser(loggedUser);
        setRole((loggedUser.role as UserRole) || null);
        setOrganization(currentOrganization);
        return loggedUser;
      } catch (error) {
        setUser(null);
        setRole(null);
        setOrganization(null);
        throw error;
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
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
    } finally {
      setUser(null);
      setRole(null);
      setOrganization(null);
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        role,
        organization,
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
