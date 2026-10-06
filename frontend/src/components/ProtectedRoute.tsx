import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ProtectedRouteProps } from "../interfaces/Auth.interface";

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading, organization } = useAuth();
  const location = useLocation();
  const q: string = location.pathname.split("/")[1];

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (q != organization?.slug)
    return <Navigate to="/login" replace state={{ from: location }} />;

  return children;
};

export default ProtectedRoute;
