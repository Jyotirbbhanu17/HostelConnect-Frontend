import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import Sidebar from "../components/common/SideBar";
import { clearAuthSession } from "../services/authService";
import { apiRequest } from "../services/api";

const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/submit-complaint": "Submit Complaint",
  "/my-complaints": "My Complaints",
  "/notices": "Notices",
  "/notifications": "Notifications",
  "/profile": "Profile",
};

function StudentLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [studentName, setStudentName] = useState("Student");

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("hostelConnectUser");

      if (storedUser) {
        const user = JSON.parse(storedUser);

        setStudentName(
          user?.fullName ||
            user?.name ||
            "Student"
        );
      }
    } catch (error) {
      console.error("Failed to load student information:", error);
    }
  }, []);

  const loadUnreadCount = useCallback(async () => {
    try {
      const data = await apiRequest("/notifications/unread-count");

      if (typeof data === "number") {
        setUnreadCount(data);
      } else if (typeof data?.count === "number") {
        setUnreadCount(data.count);
      } else if (typeof data?.unreadCount === "number") {
        setUnreadCount(data.unreadCount);
      }
    } catch (err) {
      console.error("Failed to load unread notification count:", err);
    }
  }, []);

  useEffect(() => {
    loadUnreadCount();

    const intervalId = setInterval(() => {
      loadUnreadCount();
    }, 10000);

    const handleNotificationsUpdated = () => {
      loadUnreadCount();
    };

    window.addEventListener(
      "notifications-updated",
      handleNotificationsUpdated
    );

    return () => {
      clearInterval(intervalId);

      window.removeEventListener(
        "notifications-updated",
        handleNotificationsUpdated
      );
    };
  }, [loadUnreadCount]);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    clearAuthSession();
    navigate("/login");
  };

  const handleMenuClick = () => {
    setMobileSidebarOpen(false);
  };

  const toggleSidebar = () => {
    if (window.innerWidth <= 768) {
      setMobileSidebarOpen((prev) => !prev);
    } else {
      setSidebarCollapsed((prev) => !prev);
    }
  };

  return (
    <div
      className={`hc-app ${
        sidebarCollapsed ? "sidebar-collapsed" : ""
      }`}
    >
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        onMenuClick={handleMenuClick}
      />

      {mobileSidebarOpen && (
        <div
          className="hc-sidebar-overlay"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <div className="hc-main">
        <header className="hc-topbar">
          <div className="hc-topbar-left">
            <button
              className="hc-menu-btn"
              type="button"
              onClick={toggleSidebar}
              aria-label="Toggle navigation menu"
            >
              ☰
            </button>

            <h1 className="hc-title">
              {PAGE_TITLES[location.pathname]}
            </h1>
          </div>

          <div className="hc-top-actions">
            <button
              className="notification-bell-btn"
              type="button"
              onClick={() => navigate("/notifications")}
              aria-label={`Notifications${
                unreadCount > 0
                  ? `, ${unreadCount} unread`
                  : ""
              }`}
            >
              🔔

              {unreadCount > 0 && (
                <span className="notification-count-badge">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            <button
              className="admin-btn"
              type="button"
              onClick={() => navigate("/profile")}
            >
              {studentName}
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

export default StudentLayout;