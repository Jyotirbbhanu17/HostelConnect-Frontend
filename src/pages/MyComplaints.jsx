import { useEffect, useState, Fragment } from "react";
import { apiRequest } from "../services/api";
import "../styles/myComplaints.css";

const API_BASE_URL = "http://localhost:8081";

function MyComplaints() {
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [expandedComplaint, setExpandedComplaint] = useState(null);

  const [editingComplaint, setEditingComplaint] = useState(null);
  const [editDescription, setEditDescription] = useState("");

  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function loadComplaints() {
      try {
        setIsLoading(true);
        setError("");

        const data = await apiRequest("/complaints/my");

        setComplaints(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load complaints:", err);
        setError("Unable to load your complaints. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    loadComplaints();
  }, []);

  const filteredComplaints = complaints.filter((complaint) => {
    const categoryMatch =
      category === "" || complaint.category === category;

    const statusMatch =
      status === "" || complaint.status === status;

    return categoryMatch && statusMatch;
  });

  const getStatusLabel = (statusValue) => {
    if (statusValue === "IN_PROGRESS") return "In Progress";
    if (statusValue === "RESOLVED") return "Resolved";
    if (statusValue === "SUBMITTED") return "Submitted";

    return statusValue;
  };

  const getStatusClass = (statusValue) => {
    if (statusValue === "RESOLVED") return "badge-resolved";
    if (statusValue === "IN_PROGRESS") return "badge-progress";

    return "badge-default";
  };

  const getPriorityClass = (priorityValue) =>
    `priority-${priorityValue?.toLowerCase() || "low"}`;

  const getCategoryLabel = (categoryValue) => {
    if (!categoryValue) return "";

    return categoryValue
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "-";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString("en-IN");
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;

    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    return `${API_BASE_URL}${imagePath}`;
  };

  const toggleDetails = (id) => {
    setExpandedComplaint(
      expandedComplaint === id ? null : id
    );
  };

  const handleUpvote = () => {
    alert("You cannot upvote your own complaint.");
  };

  const handleDelete = async (complaint) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${complaint.title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);

      await apiRequest(`/complaints/${complaint.id}`, {
        method: "DELETE",
      });

      setComplaints((currentComplaints) =>
        currentComplaints.filter(
          (item) => item.id !== complaint.id
        )
      );

      if (expandedComplaint === complaint.id) {
        setExpandedComplaint(null);
      }

      alert("Complaint deleted successfully.");
    } catch (err) {
      console.error("Failed to delete complaint:", err);

      alert(
        err.message || "Unable to delete complaint."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const openEditModal = (complaint) => {
    setEditingComplaint(complaint);
    setEditDescription(complaint.description || "");
  };

  const handleSave = async () => {
    if (!editingComplaint) {
      return;
    }

    if (!editDescription.trim()) {
      alert("Description cannot be empty.");
      return;
    }

    try {
      setActionLoading(true);

      const updatedComplaint = await apiRequest(
        `/complaints/${editingComplaint.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            description: editDescription.trim(),
            imagePath: editingComplaint.imagePath || null,
          }),
        }
      );

      setComplaints((currentComplaints) =>
        currentComplaints.map((complaint) =>
          complaint.id === updatedComplaint.id
            ? updatedComplaint
            : complaint
        )
      );

      setEditingComplaint(null);
      setEditDescription("");

      alert("Complaint updated successfully.");
    } catch (err) {
      console.error("Failed to update complaint:", err);

      alert(
        err.message || "Unable to update complaint."
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section className="hc-recent my-complaints-card">
        <p>Loading your complaints...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="hc-recent my-complaints-card">
        <p>{error}</p>
      </section>
    );
  }

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
          <option value="ELECTRICAL">Electrical</option>
          <option value="INTERNET">Internet</option>
          <option value="WATER">Water</option>
          <option value="CLEANLINESS">Cleanliness</option>
          <option value="PLUMBING">Plumbing</option>
          <option value="MESS">Mess</option>
          <option value="OTHER">Other</option>
        </select>

        <select
          id="status"
          aria-label="Filter by status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Status</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </div>

      {filteredComplaints.length === 0 ? (
        <div className="empty-state">
          <p>No complaints found.</p>
        </div>
      ) : (
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

                    <td>
                      {getCategoryLabel(complaint.category)}
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
                        disabled
                        title="You cannot upvote your own complaint."
                        onClick={handleUpvote}
                      >
                        ↑ {complaint.upvotes}
                      </button>
                    </td>

                    <td>
                      {formatDate(complaint.createdAt)}
                    </td>

                    <td>
                      <button
                        className="details-btn"
                        type="button"
                        onClick={() =>
                          toggleDetails(complaint.id)
                        }
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

                            {complaint.imagePath ? (
                              <img
                                src={getImageUrl(
                                  complaint.imagePath
                                )}
                                alt={complaint.title}
                                className="complaint-image"
                              />
                            ) : (
                              <p>No image attached.</p>
                            )}
                          </div>

                          {complaint.status === "RESOLVED" && (
                            <div className="details-section">
                              <h4>Resolution Note</h4>

                              <p>
                                {complaint.resolutionNote ||
                                  "No resolution note available."}
                              </p>
                            </div>
                          )}

                          <div className="complaint-actions">
                            {complaint.status === "SUBMITTED" ? (
                              <>
                                <button
                                  className="edit-btn"
                                  type="button"
                                  disabled={actionLoading}
                                  onClick={() =>
                                    openEditModal(complaint)
                                  }
                                >
                                  Edit
                                </button>

                                <button
                                  className="delete-btn"
                                  type="button"
                                  disabled={actionLoading}
                                  onClick={() =>
                                    handleDelete(complaint)
                                  }
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
      )}

      {editingComplaint && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <h2>Edit Complaint</h2>

            <div className="modal-field">
              <label>Title</label>

              <input
                type="text"
                value={editingComplaint.title}
                readOnly
              />
            </div>

            <div className="modal-field">
              <label>Description</label>

              <textarea
                rows="5"
                value={editDescription}
                onChange={(e) =>
                  setEditDescription(e.target.value)
                }
              />
            </div>

            <div className="modal-field">
              <label>Image</label>

              {editingComplaint.imagePath ? (
                <p>Existing complaint image will be kept.</p>
              ) : (
                <p>No image attached.</p>
              )}
            </div>

            <div className="modal-buttons">
              <button
                className="cancel-btn"
                type="button"
                disabled={actionLoading}
                onClick={() => {
                  setEditingComplaint(null);
                  setEditDescription("");
                }}
              >
                Cancel
              </button>

              <button
                className="save-btn"
                type="button"
                disabled={actionLoading}
                onClick={handleSave}
              >
                {actionLoading
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default MyComplaints;