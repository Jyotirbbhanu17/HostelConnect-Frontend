import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api";
import "../../styles/wardenDashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadComplaints() {
      try {
        setIsLoading(true);
        setError("");

        const data = await apiRequest("/complaints?sortBy=upvotes");

        setComplaints(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load complaints:", err);
        setError("Unable to load complaints. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    loadComplaints();
  }, []);

  const totalComplaints = complaints.length;

  const submitted = complaints.filter(
    (complaint) => complaint.status === "SUBMITTED"
  ).length;

  const inProgress = complaints.filter(
    (complaint) => complaint.status === "IN_PROGRESS"
  ).length;

  const resolved = complaints.filter(
    (complaint) => complaint.status === "RESOLVED"
  ).length;

  const topComplaints = complaints.slice(0, 5);

  const getStatusClass = (status) => {
    if (status === "RESOLVED") return "badge-resolved";
    if (status === "IN_PROGRESS") return "badge-progress";
    return "badge-default";
  };

  const getStatusLabel = (status) => {
    if (status === "IN_PROGRESS") return "In Progress";
    if (status === "RESOLVED") return "Resolved";
    if (status === "SUBMITTED") return "Submitted";

    return status || "-";
  };

  if (isLoading) {
    return (
      <div className="warden-dashboard warden-page warden-stack">
        <div className="warden-card">
          <div className="warden-card-header">
            <h2 className="warden-section-title">
              Dashboard
            </h2>
          </div>

          <div className="warden-loading">
            Loading complaints...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="warden-dashboard warden-page warden-stack">
        <div className="warden-card">
          <div className="warden-error">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="warden-dashboard warden-page warden-stack">
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total Complaints</h4>
          <h2>{totalComplaints}</h2>
        </div>

        <div className="stat-card">
          <h4>Submitted</h4>
          <h2>{submitted}</h2>
        </div>

        <div className="stat-card">
          <h4>In Progress</h4>
          <h2>{inProgress}</h2>
        </div>

        <div className="stat-card">
          <h4>Resolved</h4>
          <h2>{resolved}</h2>
        </div>
      </div>

      <div className="warden-card">
        <div className="warden-card-header">
          <h2 className="warden-section-title">
            Top Priority Complaints
          </h2>
        </div>

        {topComplaints.length === 0 ? (
          <div className="warden-loading">
            No complaints found.
          </div>
        ) : (
          <div className="warden-table-wrap">
            <table className="warden-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Upvotes</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {topComplaints.map((complaint) => (
                  <tr key={complaint.id}>
                    <td className="warden-title-cell">
                      {complaint.title}
                    </td>

                    <td>
                      {complaint.category}
                    </td>

                    <td>
                      <span
                        className={`status-badge ${getStatusClass(
                          complaint.status
                        )}`}
                      >
                        {getStatusLabel(complaint.status)}
                      </span>
                    </td>

                    <td>
                      <span className="upvote-badge">
                        <span aria-hidden="true">
                          {"\u2191"}
                        </span>
                        {complaint.upvotes ?? 0}
                      </span>
                    </td>

                    <td>
                      <button
                        className="view-btn"
                        type="button"
                        onClick={() =>
                          navigate(
                            `/warden/complaints/${complaint.id}`
                          )
                        }
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;