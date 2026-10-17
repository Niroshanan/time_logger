import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useIsAdmin } from "../hooks/useIsAdmin";

// Nest this inside <ProtectedRoute /> so the user is already signed in.
export const AdminRoute: React.FC = () => {
  const { isAdmin, isLoading } = useIsAdmin();

  if (isLoading) return <div>Checking permissions...</div>;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
};
