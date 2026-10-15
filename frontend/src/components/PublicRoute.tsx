import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Public route guard.
 * Prevents authenticated users from accessing public-only pages (e.g. login),
 * redirecting them automatically to their organization's dashboard.
 */
export const PublicRoute: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const { isAuthenticated, loading, organization } = useAuth();

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (isAuthenticated) {
    const orgSlug = organization?.slug || "dashboard";
    return <Navigate to={`/${orgSlug}/dashboard`} replace />;
  }

  return children;
};

export default PublicRoute;
