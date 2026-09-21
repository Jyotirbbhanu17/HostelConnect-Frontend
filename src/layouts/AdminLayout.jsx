import { Outlet, useLocation, useNavigate } from "react-router-dom";

import AdminSidebar from "../components/admin/AdminSidebar";

import {
  clearAuthSession,
  getAuthUser,
} from "../services/authService";

const PAGE_TITLES = {
  "/admin/dashboard": "Dashboard",
  "/admin/students": "Students",
  "/admin/students/import": "Import Students",
  "/admin/profile": "Profile",
};

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const user = getAuthUser();

  const handleLogout = () => {
    clearAuthSession();
    navigate("/login", { replace: true });
  };

  const pageTitle =
    PAGE_TITLES[location.pathname] || "Hostel Admin";

  return (
    <div className="hc-app">
      <AdminSidebar />

      <div className="hc-main">
        <header className="hc-topbar">
          <h1 className="hc-title">
            {pageTitle}
          </h1>

          <div className="hc-top-actions">
            <button
              className="admin-btn"
              type="button"
              onClick={() => navigate("/admin/profile")}
            >
              {user?.fullName || "Administrator"}
            </button>

            <button
              className="logout-btn"
              type="button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </header>

        <main className="hc-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;