import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ProtectedRouteProps } from "../interfaces/Auth.interface";
import type { Role } from "../types/global.type";

const VALID_ROLES: Role[] = ["student", "admin", "staff"];

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If the user's role is not recognized by the system (e.g. "staffie")
  if (!role || !VALID_ROLES.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If specific roles are restricted for this route
  if (
    allowedRoles &&
    allowedRoles.length > 0 &&
    !allowedRoles.includes(role)
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
