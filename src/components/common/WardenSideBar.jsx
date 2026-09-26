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

function ComplaintsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 3.5h6" />
      <path d="M8 9h8" />
      <path d="M8 13h8" />
      <path d="M8 17h5" />
    </svg>
  );
}

function NoticeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 10v4" />
      <path d="M7 9l10-4v14L7 15z" />
      <path d="M17 9.5a3 3 0 0 1 0 5" />
      <path d="M9 15l1.5 5H8l-1.5-5" />
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

function WardenSidebar({
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
          to="/warden/dashboard"
          className={getNavClass}
          onClick={onMenuClick}
        >
          <span className="hc-nav-icon">
            <DashboardIcon />
          </span>
          <span className="hc-nav-text">Dashboard</span>
        </NavLink>

        <NavLink
          to="/warden/complaints"
          className={getNavClass}
          onClick={onMenuClick}
        >
          <span className="hc-nav-icon">
            <ComplaintsIcon />
          </span>
          <span className="hc-nav-text">
            Manage Complaints
          </span>
        </NavLink>

        <NavLink
          to="/warden/notices"
          className={getNavClass}
          onClick={onMenuClick}
        >
          <span className="hc-nav-icon">
            <NoticeIcon />
          </span>
          <span className="hc-nav-text">Notices</span>
        </NavLink>

        <NavLink
          to="/warden/profile"
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

export default WardenSidebar;
