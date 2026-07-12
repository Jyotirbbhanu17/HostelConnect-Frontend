import { NavLink } from "react-router-dom";

function WardenSidebar() {
  return (
    <aside className="hc-sidebar">
      <div className="hc-brand">HostelConnect</div>

      <nav className="hc-nav">
        <NavLink
          to="/warden/dashboard"
          className={({ isActive }) =>
            isActive ? "hc-nav-item active" : "hc-nav-item"
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/warden/complaints"
          className={({ isActive }) =>
            isActive ? "hc-nav-item active" : "hc-nav-item"
          }
        >
          Manage Complaints
        </NavLink>

        <NavLink
          to="/warden/notices"
          className={({ isActive }) =>
            isActive ? "hc-nav-item active" : "hc-nav-item"
          }
        >
          Notices
        </NavLink>

        <NavLink
          to="/warden/profile"
          className={({ isActive }) =>
            isActive ? "hc-nav-item active" : "hc-nav-item"
          }
        >
          Profile
        </NavLink>
      </nav>
    </aside>
  );
}

export default WardenSidebar;
