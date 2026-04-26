import React from "react";
import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../utils/authUtils";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute Component
 *
 * Wraps routes that require authentication.
 * If user doesn't have JWT token, redirects to login.
 *
 * Usage:
 * <ProtectedRoute>
 *   <Dashboard />
 * </ProtectedRoute>
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Check if user has valid JWT token
  if (!isLoggedIn()) {
    console.warn("⚠️ Unauthorized access attempt - redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, allow access
  return <>{children}</>;
};

export default ProtectedRoute;
