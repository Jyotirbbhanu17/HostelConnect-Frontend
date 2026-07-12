import { useParams } from "react-router-dom";
import { useState } from "react";
import complaints from "../../data/complaints";
import "../../styles/complaintDetails.css";
import {useNavigate } from "react-router-dom";

function ComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const complaint = complaints.find(
    (c) => c.id === Number(id)
  );

  const [status, setStatus] = useState(
    complaint?.status || ""
  );

  const [priority, setPriority] = useState(
    complaint?.priority || ""
  );

  const [notes, setNotes] = useState(
    complaint?.wardenNotes || ""
  );

  if (!complaint) {
    return <h2>Complaint Not Found</h2>;
  }

  const handleSave = () => {
    alert("Changes Saved (Backend later)");
  };

  return (
    <div className="complaint-details-page">

      <div className="details-card">
        <button
  className="back-btn"
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
              <strong>Category:</strong> {complaint.category}
            </div>

            <div className="info-item">
              <strong>Student:</strong> {complaint.student}
            </div>

            <div className="info-item">
              <strong>Hostel:</strong> {complaint.hostel}
            </div>

            <div className="info-item">
              <strong>Room:</strong> {complaint.room}
            </div>

            <div className="info-item">
              <strong>Date:</strong> {complaint.date}
            </div>

            <div className="info-item">
              <strong>Upvotes:</strong> {complaint.upvotes}
            </div>

          </div>

          <div className="image-section">
            <img
              src={complaint.image}
              alt={complaint.title}
            />
          </div>

        </div>

      </div>

      <div className="action-card">

        <h3>Update Complaint</h3>

        <label>Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option>Submitted</option>
          <option>Under Review</option>
          <option>In Progress</option>
          <option>Resolved</option>
        </select>

        <label>Priority</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
          <option>Critical</option>
        </select>

        <label>Warden Notes</label>
        <textarea
          rows="5"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <button
          className="save-btn"
          onClick={handleSave}
        >
          Save Changes
        </button>

      </div>

    </div>
  );
}

export default ComplaintDetails;
