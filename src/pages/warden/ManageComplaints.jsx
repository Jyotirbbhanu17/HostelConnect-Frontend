import { useState } from "react";
import { useNavigate } from "react-router-dom";
import complaints from "../../data/complaints";
// import "../../styles/manageComplaints.css";

function ManageComplaints() {
  const navigate = useNavigate();

  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");
  const [sortBy, setSortBy] = useState("Most Upvoted");

  let filteredComplaints = [...complaints];

  if (category !== "All") {
    filteredComplaints = filteredComplaints.filter(
      (c) => c.category === category
    );
  }

  if (status !== "All") {
    filteredComplaints = filteredComplaints.filter((c) => c.status === status);
  }

  if (priority !== "All") {
    filteredComplaints = filteredComplaints.filter(
      (c) => c.priority === priority
    );
  }

  if (sortBy === "Most Upvoted") {
    filteredComplaints.sort((a, b) => b.upvotes - a.upvotes);
  }

  if (sortBy === "Newest") {
    filteredComplaints.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  if (sortBy === "Oldest") {
    filteredComplaints.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  const getStatusClass = (statusValue) => {
    if (statusValue === "Resolved") return "badge-resolved";
    if (statusValue === "In Progress") return "badge-progress";
    return "badge-default";
  };

  const getPriorityClass = (priorityValue) =>
    `priority-${priorityValue.toLowerCase()}`;

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
            <option value="Internet">Internet</option>
          </select>

          <select
            className="warden-control"
            aria-label="Filter complaints by status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Submitted">Submitted</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          <select
            className="warden-control"
            aria-label="Filter complaints by priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
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
              {filteredComplaints.map((complaint) => (
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

                  <td>{complaint.date}</td>

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

export default ManageComplaints;
