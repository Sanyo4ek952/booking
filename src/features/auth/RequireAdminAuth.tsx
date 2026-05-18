import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "./AuthProvider";

export function RequireAdminAuth() {
  const location = useLocation();
  const { isAuthenticated, isReady } = useAuth();

  if (!isReady) {
    return null;
  }

  if (!isAuthenticated) {
    const redirectTo = `${location.pathname}${location.search}${location.hash}`;

    return <Navigate to="/admin/login" replace state={{ redirectTo }} />;
  }

  return <Outlet />;
}
