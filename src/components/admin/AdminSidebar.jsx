import { NavLink } from "react-router-dom";

function AdminSidebar() {
  return (
    <aside className="hc-sidebar">
      <div className="hc-brand">HostelConnect</div>

      <nav className="hc-nav">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            isActive ? "hc-nav-item active" : "hc-nav-item"
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/students"
          className={({ isActive }) =>
            isActive ? "hc-nav-item active" : "hc-nav-item"
          }
        >
          Students
        </NavLink>

        <NavLink
          to="/admin/students/import"
          className={({ isActive }) =>
            isActive ? "hc-nav-item active" : "hc-nav-item"
          }
        >
          Import Students
        </NavLink>

        <NavLink
          to="/admin/profile"
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

export default AdminSidebar;