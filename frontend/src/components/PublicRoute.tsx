import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const PublicRoute: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const { isAuthenticated, loading, organization } = useAuth();

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (isAuthenticated) {
    const orgSlug = organization?.slug || "dashboard";
    return <Navigate to={`/${orgSlug}`} replace />;
  }

  return children;
};

export default PublicRoute;
