import { Outlet, useLocation, useNavigate } from "react-router-dom";
import WardenSidebar from "../components/common/WardenSidebar";
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

  return (
    <div className="hc-app">
      <WardenSidebar />

      <div className="hc-main">
        <header className="hc-topbar">
          <h1 className="hc-title">
            {location.pathname.includes("/warden/complaints/")
              ? "Complaint Details"
              : PAGE_TITLES[location.pathname] || "Hostel Warden"}
          </h1>

          <div className="hc-top-actions">
            <button className="icon-btn" type="button">
              {"\uD83D\uDD14"}
            </button>

            <button
              className="admin-btn"
              type="button"
              onClick={() => navigate("/warden/profile")}
            >
              Hostel Warden
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

export default WardenLayout;
