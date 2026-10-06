import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { UserRole } from "../types/enum.type";

interface RoleBasedRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactElement;
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  allowedRoles,
  children,
}) => {
  const { role, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!role) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(role)) return <Navigate to="/login" replace />;

  return children;
};

export default RoleBasedRoute;
