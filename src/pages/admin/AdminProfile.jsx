import { useEffect, useState } from "react";
import "../../styles/adminProfile.css";

function AdminProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("hostelConnectUser");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to load admin profile:", error);
    }
  }, []);

  const adminName = user?.fullName || user?.name || "System Administrator";
  const email = user?.email || "Not available";
  const role = user?.role || "ADMIN";

  return (
    <div className="admin-profile-page">
      

      <div className="admin-profile-layout">
        <div className="admin-profile-card">
          <div className="admin-profile-top">
            <div className="admin-profile-avatar">
              {adminName.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2>{adminName}</h2>
              <p>{email}</p>
              <span className="admin-role-badge">System Administrator</span>
            </div>
          </div>

          <div className="admin-profile-divider" />

          <div className="admin-profile-details">
            <div className="admin-profile-field">
              <span className="admin-profile-label">Full Name</span>
              <span className="admin-profile-value">
                {adminName}
              </span>
            </div>

            <div className="admin-profile-field">
              <span className="admin-profile-label">Email Address</span>
              <span className="admin-profile-value">
                {email}
              </span>
            </div>

            <div className="admin-profile-field">
              <span className="admin-profile-label">Account Role</span>
              <span className="admin-profile-value">
                {role}
              </span>
            </div>

            <div className="admin-profile-field">
              <span className="admin-profile-label">Account Status</span>
              <span className="admin-active-status">
                <span />
                Active
              </span>
            </div>
          </div>
        </div>

        <div className="admin-profile-info">
          <div className="admin-profile-info-icon">i</div>

          <div>
            <h3>Administrator Account</h3>
            <p>
              This account has administrative access to manage
              students, complaints and HostelConnect data.
            </p>

            <div className="admin-profile-permissions">
              <div>
                <span>✓</span>
                <p>Manage student accounts</p>
              </div>

              <div>
                <span>✓</span>
                <p>Import students in bulk</p>
              </div>

              <div>
                <span>✓</span>
                <p>View system-wide complaints</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;