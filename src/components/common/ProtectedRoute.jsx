import { Navigate, Outlet } from "react-router-dom";
import { getAuthUser } from "../../services/authService";

function ProtectedRoute({ allowedRole }) {
  const user = getAuthUser();

  // No logged-in user
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged-in user has the wrong role
  if (allowedRole && user.role !== allowedRole) {
    if (user.role === "STUDENT") {
    return <Navigate to="/dashboard" replace />;
}

if (user.role === "WARDEN") {
    return <Navigate to="/warden/dashboard" replace />;
}

if (user.role === "ADMIN") {
    return <Navigate to="/admin/dashboard" replace />;
}
    // Unknown/unsupported role
    return <Navigate to="/login" replace />;
  }

  // User is authenticated and has the correct role.
  return <Outlet />;
}

export default ProtectedRoute;