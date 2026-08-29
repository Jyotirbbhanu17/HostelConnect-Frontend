import { useState, Fragment } from "react";
import "../styles/myComplaints.css";

function MyComplaints() {
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [expandedComplaint, setExpandedComplaint] = useState(null);
  const [editingComplaint, setEditingComplaint] = useState(null);

  const complaints = [
    {
      id: 1,
      title: "Fan Not Working",
      category: "Electrical",
      status: "In Progress",
      priority: "High",
      upvotes: 40,
      date: "03/06/2026",
      description:
        "The ceiling fan in Room 203 has stopped working since yesterday evening. It makes a buzzing sound but does not rotate.",
      image: null,
      resolutionNote: "",
    },
    {
      id: 2,
      title: "WiFi Issue",
      category: "Internet",
      status: "Submitted",
      priority: "Medium",
      upvotes: 25,
      date: "02/06/2026",
      description:
        "Hostel WiFi disconnects frequently and internet speed is extremely low during evening hours.",
      image: null,
      resolutionNote: "",
    },
    {
      id: 3,
      title: "Mess Food Quality",
      category: "Mess",
      status: "Resolved",
      priority: "Low",
      upvotes: 15,
      date: "30/05/2026",
      description:
        "Food quality has been inconsistent for the last week. Chapatis are often undercooked.",
      image: null,
      resolutionNote:
        "The mess contractor was informed and food quality has been improved after inspection.",
    },
  ];

  const filteredComplaints = complaints.filter((complaint) => {
    const categoryMatch =
      category === "" || complaint.category === category;

    const statusMatch =
      status === "" || complaint.status === status;

    return categoryMatch && statusMatch;
  });

  const getStatusClass = (statusValue) => {
    if (statusValue === "Resolved") return "badge-resolved";
    if (statusValue === "In Progress") return "badge-progress";
    return "badge-default";
  };

  const getPriorityClass = (priorityValue) =>
    `priority-${priorityValue.toLowerCase()}`;

  const toggleDetails = (id) => {
    setExpandedComplaint(expandedComplaint === id ? null : id);
  };

  const handleDelete = (title) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${title}"?`
      )
    ) {
      alert(
        "Complaint deleted successfully. Backend integration pending."
      );
    }
  };

  const handleSave = () => {
    alert(
      "Backend integration pending. Changes will be saved after API integration."
    );
    setEditingComplaint(null);
  };

  return (
    <section className="hc-recent my-complaints-card">
      <div className="filter-bar">
        <select
          id="category"
          aria-label="Filter by category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Categories</option>
          <option value="Electrical">Electrical</option>
          <option value="Internet">Internet</option>
          <option value="Water">Water</option>
          <option value="Cleanliness">Cleanliness</option>
          <option value="Plumbing">Plumbing</option>
          <option value="Mess">Mess</option>
          <option value="Other">Other</option>
        </select>

        <select
          id="status"
          aria-label="Filter by status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Status</option>
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
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredComplaints.map((complaint) => (
              <Fragment key={complaint.id}>
                <tr>
                  <td className="complaint-title-cell">
                    {complaint.title}
                  </td>
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
                    <button className="upvote-btn" type="button">
                      ↑ {complaint.upvotes}
                    </button>
                  </td>
                  <td>{complaint.date}</td>
                  <td>
                    <button
                      className="details-btn"
                      type="button"
                      onClick={() => toggleDetails(complaint.id)}
                    >
                      {expandedComplaint === complaint.id
                        ? "Hide Details ▲"
                        : "View Details ▼"}
                    </button>
                  </td>
                </tr>

                {expandedComplaint === complaint.id && (
                  <tr className="expanded-row">
                    <td colSpan="7">
                      <div className="complaint-details">
                        <div className="details-section">
                          <h4>Description</h4>
                          <p>{complaint.description}</p>
                        </div>

                        <div className="details-section">
                          <h4>Attached Image</h4>
                          {complaint.image ? (
                            <img
                              src={complaint.image}
                              alt={complaint.title}
                              className="complaint-image"
                            />
                          ) : (
                            <p>No image attached.</p>
                          )}
                        </div>

                        {complaint.status === "Resolved" && (
                          <div className="details-section">
                            <h4>Resolution Note</h4>
                            <p>{complaint.resolutionNote}</p>
                          </div>
                        )}

                        <div className="complaint-actions">
                          {complaint.status === "Submitted" ? (
                            <>
                              <button
                                className="edit-btn"
                                type="button"
                                onClick={() => setEditingComplaint(complaint)}
                              >
                                Edit
                              </button>
                              <button
                                className="delete-btn"
                                type="button"
                                onClick={() => handleDelete(complaint.title)}
                              >
                                Delete
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                disabled
                                title="Complaints can only be edited or deleted while in Submitted status."
                                className="disabled-btn"
                                type="button"
                              >
                                Edit
                              </button>
                              <button
                                disabled
                                title="Complaints can only be edited or deleted while in Submitted status."
                                className="disabled-btn"
                                type="button"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {editingComplaint && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <h2>Edit Complaint</h2>
            <div className="modal-field">
              <label>Title</label>
              <input type="text" value={editingComplaint.title} readOnly />
            </div>

            <div className="modal-field">
              <label>Description</label>
              <textarea rows="5" defaultValue={editingComplaint.description} />
            </div>

            <div className="modal-field">
              <label>Update Image</label>
              <input type="file" />
            </div>

            <div className="modal-buttons">
              <button
                className="cancel-btn"
                type="button"
                onClick={() => setEditingComplaint(null)}
              >
                Cancel
              </button>
              <button className="save-btn" type="button" onClick={handleSave}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default MyComplaints;
