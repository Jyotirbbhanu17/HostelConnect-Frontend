import { NavLink } from "react-router-dom";
import hostelConnectLogo from "../../assets/hostelconnect-logo.png";

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function StudentsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M16 4.5a3.5 3.5 0 0 1 0 7" />
      <path d="M18 14a6.5 6.5 0 0 1 3.5 6" />
    </svg>
  );
}

function ImportIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 15V3" />
      <path d="M7 8l5-5 5 5" />
      <path d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

function AdminSidebar({
  collapsed,
  mobileOpen,
  onClose,
  onMenuClick,
}) {
  const getNavClass = ({ isActive }) =>
    `hc-nav-item ${isActive ? "active" : ""}`;

  return (
    <aside
      className={`hc-sidebar ${
        collapsed ? "collapsed" : ""
      } ${mobileOpen ? "mobile-open" : ""}`}
    >
      <div className="hc-sidebar-header">
        <div className="hc-brand">
          <img
            src={hostelConnectLogo}
            alt="HostelConnect"
            className="hc-logo"
          />

          <span className="hc-brand-text">
            HostelConnect
          </span>
        </div>

        <button
          className="hc-sidebar-close"
          type="button"
          onClick={onClose}
          aria-label="Close menu"
        >
          ×
        </button>
      </div>

      <nav className="hc-nav">
        <NavLink
          to="/admin/dashboard"
          className={getNavClass}
          onClick={onMenuClick}
        >
          <span className="hc-nav-icon">
            <DashboardIcon />
          </span>
          <span className="hc-nav-text">Dashboard</span>
        </NavLink>

        <NavLink
          to="/admin/students"
          className={getNavClass}
          onClick={onMenuClick}
        >
          <span className="hc-nav-icon">
            <StudentsIcon />
          </span>
          <span className="hc-nav-text">Students</span>
        </NavLink>

        <NavLink
          to="/admin/students/import"
          className={getNavClass}
          onClick={onMenuClick}
        >
          <span className="hc-nav-icon">
            <ImportIcon />
          </span>
          <span className="hc-nav-text">
            Import Students
          </span>
        </NavLink>

        <NavLink
          to="/admin/profile"
          className={getNavClass}
          onClick={onMenuClick}
        >
          <span className="hc-nav-icon">
            <ProfileIcon />
          </span>
          <span className="hc-nav-text">Profile</span>
        </NavLink>
      </nav>
    </aside>
  );
}

export default AdminSidebar;
