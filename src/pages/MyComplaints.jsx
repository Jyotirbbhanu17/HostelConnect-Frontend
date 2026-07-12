import { useState } from "react";
import "../styles/myComplaints.css";

function MyComplaints() {
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  const complaints = [
    {
      id: 1,
      title: "Fan Not Working",
      category: "Electrical",
      status: "In Progress",
      priority: "High",
      Upvotes: "40",
      date: "03/06/2026",
    },
    {
      id: 2,
      title: "WiFi Issue",
      category: "Internet",
      status: "Submitted",
      priority: "Medium",
      Upvotes: "25",
      date: "02/06/2026",
    },
    {
      id: 3,
      title: "Mess Food Quality",
      category: "Mess",
      status: "Resolved",
      priority: "Low",
      Upvotes: "15",
      date: "30/05/2026",
    },
  ];

  const filteredComplaints = complaints.filter((complaint) => {
    const categoryMatch = category === "" || complaint.category === category;
    const statusMatch = status === "" || complaint.status === status;

    return categoryMatch && statusMatch;
  });

  const getStatusClass = (statusValue) => {
    if (statusValue === "Resolved") return "badge-resolved";
    if (statusValue === "In Progress") return "badge-progress";
    return "badge-default";
  };

  const getPriorityClass = (priorityValue) =>
    `priority-${priorityValue.toLowerCase()}`;

  return (
    <section className="hc-recent my-complaints-card">
      <div className="filter-bar">
        <select
          aria-label="Filter complaints by category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Electrical">Electrical</option>
          <option value="Internet">Internet</option>
          <option value="Mess">Mess</option>
        </select>

        <select
          aria-label="Filter complaints by status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Submitted">Submitted</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      <div className="table-wrap">
        <table className="hc-table my-complaints-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Upvotes</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {filteredComplaints.map((complaint) => (
              <tr key={complaint.id}>
                <td className="complaint-title-cell">{complaint.title}</td>
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
                  <button
                    className="upvote-btn"
                    type="button"
                    aria-label={`Upvote ${complaint.title}`}
                  >
                    <span aria-hidden="true">{"\u2191"}</span>
                    {complaint.Upvotes}
                  </button>
                </td>

                <td>{complaint.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default MyComplaints;
