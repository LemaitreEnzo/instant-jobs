import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ProtectedRouteProps } from "../interfaces/Auth.interface";

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
