import {
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import WardenSidebar from "../components/common/WardenSidebar";

import {
  clearAuthSession,
  getAuthUser,
} from "../services/authService";

import "../styles/warden.css";

const PAGE_TITLES = {
  "/warden/dashboard": "Dashboard",
  "/warden/complaints": "Manage Complaints",
  "/warden/notices": "Notices",
  "/warden/profile": "Profile",
};

function WardenLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const user = getAuthUser();

  const handleLogout = () => {
    clearAuthSession();
    navigate("/login", { replace: true });
  };

  const pageTitle = location.pathname.includes(
    "/warden/complaints/"
  )
    ? "Complaint Details"
    : PAGE_TITLES[location.pathname] ||
      "Hostel Warden";

  return (
    <div className="hc-app">

      {/* Warden Sidebar */}
      <WardenSidebar />

      <div className="hc-main">

        {/* Top Bar */}
        <header className="hc-topbar">

          <h1 className="hc-title">
            {pageTitle}
          </h1>

          <div className="hc-top-actions">

            {/* Notification Button */}
            <button
              className="icon-btn"
              type="button"
              aria-label="Notifications"
            >
              🔔
            </button>

            {/* Warden Profile */}
            <button
              className="admin-btn"
              type="button"
              onClick={() =>
                navigate("/warden/profile")
              }
            >
              {user?.fullName || "Hostel Warden"}
            </button>

            {/* Logout */}
            <button
              className="logout-btn"
              type="button"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>

        </header>

        {/* Page Content */}
        <main className="hc-content">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default WardenLayout;