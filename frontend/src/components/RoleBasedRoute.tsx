import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface RoleBasedRouteProps {
  allowedRoles: string[];
  children: React.ReactElement;
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  allowedRoles,
  children,
}) => {
  const { isLoggedIn, role, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(role))
    return <Navigate to="/unauthorized" replace />;

  return children;
};

export default RoleBasedRoute;
