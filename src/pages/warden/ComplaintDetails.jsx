import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../../services/api";
import "../../styles/complaintDetails.css";

function ComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);

  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [notes, setNotes] = useState("");

  const [originalStatus, setOriginalStatus] = useState("");
  const [originalPriority, setOriginalPriority] = useState("");
  const [originalNotes, setOriginalNotes] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    async function loadComplaint() {
      try {
        setIsLoading(true);
        setError("");

        const data = await apiRequest(`/complaints/${id}`);

        setComplaint(data);

        setStatus(data.status || "");
        setPriority(data.priority || "");
        setNotes(data.resolutionNote || "");

        setOriginalStatus(data.status || "");
        setOriginalPriority(data.priority || "");
        setOriginalNotes(data.resolutionNote || "");
      } catch (err) {
        console.error("Failed to load complaint:", err);

        if (err.status === 404) {
          setError("Complaint not found.");
        } else {
          setError(
            err.message ||
              "Unable to load complaint details. Please try again."
          );
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadComplaint();
  }, [id]);

  const getStatusLabel = (statusValue) => {
    if (statusValue === "SUBMITTED") return "Submitted";
    if (statusValue === "IN_PROGRESS") return "In Progress";
    if (statusValue === "RESOLVED") return "Resolved";

    return statusValue || "-";
  };

  const getPriorityLabel = (priorityValue) => {
    if (!priorityValue) return "-";

    return (
      priorityValue.charAt(0) +
      priorityValue.slice(1).toLowerCase()
    );
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "-";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString("en-IN");
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveMessage("");
      setError("");

      if (
        status === "RESOLVED" &&
        !notes.trim()
      ) {
        setError("Resolution note is required when resolving a complaint.");
        return;
      }

      let updatedComplaint = complaint;

      // Update priority only if it was changed.
      if (priority !== originalPriority) {
        updatedComplaint = await apiRequest(
          `/complaints/${id}/priority`,
          {
            method: "PUT",
            body: JSON.stringify({
              priority,
            }),
          }
        );
      }

      // Resolving a complaint uses the dedicated resolve endpoint.
      if (status === "RESOLVED") {
        updatedComplaint = await apiRequest(
          `/complaints/${id}/resolve`,
          {
            method: "PUT",
            body: JSON.stringify({
              resolutionNote: notes.trim(),
            }),
          }
        );
      } else if (status !== originalStatus) {
        // Other status changes use the normal status endpoint.
        updatedComplaint = await apiRequest(
          `/complaints/${id}/status`,
          {
            method: "PUT",
            body: JSON.stringify({
              status,
            }),
          }
        );
      }

      setComplaint(updatedComplaint);

      setStatus(updatedComplaint.status || "");
      setPriority(updatedComplaint.priority || "");
      setNotes(updatedComplaint.resolutionNote || "");

      setOriginalStatus(updatedComplaint.status || "");
      setOriginalPriority(updatedComplaint.priority || "");
      setOriginalNotes(updatedComplaint.resolutionNote || "");

      setSaveMessage("Complaint updated successfully.");
    } catch (err) {
      console.error("Failed to update complaint:", err);

      setError(
        err.message ||
          "Unable to update complaint. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="complaint-details-page">
        <h2>Loading Complaint...</h2>
      </div>
    );
  }

  if (error && !complaint) {
    return (
      <div className="complaint-details-page">
        <h2>{error}</h2>

        <button
          className="back-btn"
          type="button"
          onClick={() => navigate("/warden/complaints")}
        >
          ← Back to Complaints
        </button>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="complaint-details-page">
        <h2>Complaint Not Found</h2>
      </div>
    );
  }

  return (
    <div className="complaint-details-page">
      <div className="details-card">
        <button
          className="back-btn"
          type="button"
          onClick={() => navigate("/warden/complaints")}
        >
          ← Back to Complaints
        </button>

        <h2>{complaint.title}</h2>

        <div className="details-grid">
          <div className="info-section">
            <div className="info-item">
              <strong>Description:</strong>
              <p>{complaint.description}</p>
            </div>

            <div className="info-item">
              <strong>Category:</strong>{" "}
              {complaint.category}
            </div>

            <div className="info-item">
              <strong>Status:</strong>{" "}
              {getStatusLabel(complaint.status)}
            </div>

            <div className="info-item">
              <strong>Priority:</strong>{" "}
              {getPriorityLabel(complaint.priority)}
            </div>

            <div className="info-item">
              <strong>Upvotes:</strong>{" "}
              {complaint.upvotes}
            </div>

            <div className="info-item">
              <strong>Date:</strong>{" "}
              {formatDate(complaint.createdAt)}
            </div>
          </div>

          <div className="image-section">
            {complaint.imagePath ? (
              <img
                src={`http://localhost:8081${complaint.imagePath}`}
                alt={complaint.title}
              />
            ) : (
              <p>No complaint image uploaded.</p>
            )}
          </div>
        </div>
      </div>

      <div className="action-card">
        <h3>Update Complaint</h3>

        <label>Status</label>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setSaveMessage("");
            setError("");
          }}
          disabled={isSaving}
        >
          <option value="SUBMITTED">
            Submitted
          </option>

          <option value="IN_PROGRESS">
            In Progress
          </option>

          <option value="RESOLVED">
            Resolved
          </option>
        </select>

        <label>Priority</label>

        <select
          value={priority}
          onChange={(e) => {
            setPriority(e.target.value);
            setSaveMessage("");
            setError("");
          }}
          disabled={isSaving}
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </select>

        <label>Warden Notes</label>

        <textarea
          rows="5"
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
            setSaveMessage("");
            setError("");
          }}
          placeholder="Enter resolution note when resolving the complaint..."
          disabled={isSaving}
        />

        {error && (
          <p className="form-error">
            {error}
          </p>
        )}

        {saveMessage && (
          <p className="form-success">
            {saveMessage}
          </p>
        )}

        <button
          className="save-btn"
          type="button"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

export default ComplaintDetails;