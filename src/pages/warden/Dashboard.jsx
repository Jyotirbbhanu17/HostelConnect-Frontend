import { useNavigate } from "react-router-dom";
import complaints from "../../data/complaints";
import "../../styles/wardenDashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const totalComplaints = complaints.length;

  const submitted = complaints.filter(
    (c) => c.status === "Submitted"
  ).length;

  const inProgress = complaints.filter(
    (c) => c.status === "In Progress"
  ).length;

  const resolved = complaints.filter(
    (c) => c.status === "Resolved"
  ).length;

  const topComplaints = [...complaints]
    .sort((a, b) => b.upvotes - a.upvotes)
    .slice(0, 5);

  const getStatusClass = (status) => {
    if (status === "Resolved") return "badge-resolved";
    if (status === "In Progress") return "badge-progress";
    return "badge-default";
  };

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
          <h2 className="warden-section-title">Top Priority Complaints</h2>
        </div>

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
                  <td className="warden-title-cell">{complaint.title}</td>
                  <td>{complaint.category}</td>

                  <td>
                    <span
                      className={`status-badge ${getStatusClass(
                        complaint.status
                      )}`}
                    >
                      {complaint.status}
                    </span>
                  </td>

                  <td>
                    <span className="upvote-badge">
                      <span aria-hidden="true">{"\u2191"}</span>
                      {complaint.upvotes}
                    </span>
                  </td>

                  <td>
                    <button
                      className="view-btn"
                      type="button"
                      onClick={() =>
                        navigate(`/warden/complaints/${complaint.id}`)
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
      </div>
    </div>
  );
}

export default Dashboard;
