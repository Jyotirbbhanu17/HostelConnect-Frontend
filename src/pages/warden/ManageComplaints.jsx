import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api";
// import "../../styles/manageComplaints.css";

function ManageComplaints() {
  const navigate = useNavigate();

  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");
  const [sortBy, setSortBy] = useState("Most Upvoted");

  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadComplaints = async () => {
    try {
      setIsLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (category !== "All") {
        params.append("category", category);
      }

      if (status !== "All") {
        params.append("status", status);
      }

      if (priority !== "All") {
        params.append("priority", priority);
      }

      if (sortBy === "Most Upvoted") {
        params.append("sortBy", "upvotes");
      } else if (sortBy === "Newest") {
        params.append("sortBy", "newest");
      } else if (sortBy === "Oldest") {
        params.append("sortBy", "oldest");
      }

      const queryString = params.toString();

      const data = await apiRequest(
        `/complaints${queryString ? `?${queryString}` : ""}`
      );

      setComplaints(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load complaints:", err);
      setError("Unable to load complaints. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, [category, status, priority, sortBy]);

  const getStatusLabel = (statusValue) => {
    if (statusValue === "IN_PROGRESS") return "In Progress";
    if (statusValue === "RESOLVED") return "Resolved";
    if (statusValue === "SUBMITTED") return "Submitted";

    return statusValue || "-";
  };

  const getStatusClass = (statusValue) => {
    if (statusValue === "RESOLVED") return "badge-resolved";
    if (statusValue === "IN_PROGRESS") return "badge-progress";

    return "badge-default";
  };

  const getPriorityClass = (priorityValue) => {
    if (!priorityValue) return "";

    return `priority-${priorityValue.toLowerCase()}`;
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "-";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString("en-IN");
  };

  return (
    <div className="manage-complaints-page warden-page warden-stack">
      <div className="warden-card warden-card-padded">
        <h3 className="warden-section-title">Filter Complaints</h3>

        <div className="filters-row warden-controls">
          <select
            className="warden-control"
            aria-label="Filter complaints by category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Electrical">Electrical</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Mess">Mess</option>
            <option value="Cleanliness">Cleanliness</option>
            <option value="Water">Water</option>
            <option value="Internet">Internet</option>
            <option value="Other">Other</option>
          </select>

          <select
            className="warden-control"
            aria-label="Filter complaints by status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>

          <select
            className="warden-control"
            aria-label="Filter complaints by priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="All">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>

          <select
            className="warden-control"
            aria-label="Sort complaints"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="Most Upvoted">Most Upvoted</option>
            <option value="Newest">Newest</option>
            <option value="Oldest">Oldest</option>
          </select>
        </div>
      </div>

      <div className="warden-card">
        <div className="warden-table-wrap">
          <table className="warden-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Upvotes</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="7">Loading complaints...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7">{error}</td>
                </tr>
              ) : complaints.length === 0 ? (
                <tr>
                  <td colSpan="7">No complaints found.</td>
                </tr>
              ) : (
                complaints.map((complaint) => (
                  <tr key={complaint.id}>
                    <td className="warden-title-cell">
                      {complaint.title}
                    </td>

                    <td>{complaint.category}</td>

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
                      <span
                        className={`priority-badge ${getPriorityClass(
                          complaint.priority
                        )}`}
                      >
                        {complaint.priority}
                      </span>
                    </td>

                    <td>
                      <span className="upvote-badge">
                        <span aria-hidden="true">{"\u2191"}</span>
                        {complaint.upvotes}
                      </span>
                    </td>

                    <td>{formatDate(complaint.createdAt)}</td>

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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManageComplaints;