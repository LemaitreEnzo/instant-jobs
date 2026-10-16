import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../types/enum.type";

/**
 * Public route guard.
 * Prevents authenticated users from accessing public-only pages (e.g. login),
 * redirecting them automatically to their organization's dashboard.
 */
export const PublicRoute: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const { isAuthenticated, loading, organization, user } = useAuth();

  const getLocation = (role: UserRole) => {
    switch (role) {
      case UserRole.STUDENT:
        return `/${organization?.slug}/dashboard`;
      case UserRole.STAFF:
        return `/${organization?.slug}/campus`;
      default:
        return `/${organization?.slug}/school`;
    }
  };

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to={getLocation(user?.role as UserRole)} replace />;
  }

  return children;
};

export default PublicRoute;
