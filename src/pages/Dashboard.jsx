import React, { useEffect, useState } from "react";
import { apiRequest } from "../services/api";

function Dashboard() {
  // ============================================================
  // DATA
  // ============================================================

  // Only the logged-in student's complaints.
  // Used for the dashboard statistics/cards.
  const [myComplaints, setMyComplaints] = useState([]);

  // Complaints posted by ALL students.
  // Used for the Complaints Overview table.
  const [recentComplaints, setRecentComplaints] = useState([]);

  const [openComplaint, setOpenComplaint] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================================
  // LOAD DASHBOARD DATA
  // ============================================================

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setIsLoading(true);
        setError("");

        // We intentionally call TWO different endpoints:
        //
        // 1. /complaints/my
        //    -> complaints belonging to logged-in student
        //
        // 2. /complaints?sortBy=newest
        //    -> complaints belonging to ALL students

        const [myData, allData] = await Promise.all([
          apiRequest("/complaints/my"),
          apiRequest("/complaints?sortBy=newest"),
        ]);

        setMyComplaints(Array.isArray(myData) ? myData : []);
        setRecentComplaints(Array.isArray(allData) ? allData : []);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        setError("Unable to load complaints. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  // ============================================================
  // STUDENT-SPECIFIC STATISTICS
  // ============================================================

  // These statistics MUST use myComplaints,
  // not recentComplaints.

  const totalComplaints = myComplaints.length;

  const inProgressComplaints = myComplaints.filter(
    (complaint) => complaint.status === "IN_PROGRESS"
  ).length;

  const resolvedComplaints = myComplaints.filter(
    (complaint) => complaint.status === "RESOLVED"
  ).length;

  // ============================================================
  // DISPLAY HELPERS
  // ============================================================

  const enumLabels = {
    PLUMBING: "Plumbing",
    ELECTRICAL: "Electrical",
    MESS: "Mess",
    WATER: "Water",
    CLEANLINESS: "Cleanliness",

    IN_PROGRESS: "In Progress",
    SUBMITTED: "Submitted",
    RESOLVED: "Resolved",

    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
  };

  const formatEnum = (value) => {
    if (!value) {
      return "-";
    }

    if (enumLabels[value]) {
      return enumLabels[value];
    }

    return value
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const formatCategory = (category) => {
    return formatEnum(category);
  };

  const formatStatus = (status) => {
    return formatEnum(status);
  };

  const formatPriority = (priority) => {
    return formatEnum(priority);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "IN_PROGRESS":
        return "badge-progress";

      case "RESOLVED":
        return "badge-resolved";

      case "SUBMITTED":
        return "badge-pending";

      default:
        return "badge-default";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return "-";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleDateString("en-GB");
  };

  // ============================================================
  // IMAGE HELPER
  // ============================================================

  const getImageUrl = (imagePath) => {
  if (!imagePath) return null;

  // Already a complete URL
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // Remove leading slash so we don't create //
  const cleanPath = imagePath.replace(/^\/+/, "");

  return `http://localhost:8081/${cleanPath}`;
};

  // ============================================================
  // VIEW
  // ============================================================

  return (
    <div className="dashboard-container">

      {/* ========================================================
          DASHBOARD STATISTICS
          These are ONLY for the logged-in student.
      ======================================================== */}

      <div className="dashboard-stats">

        <div className="card">
          <h3>My Total Complaints</h3>
          <h1>{totalComplaints}</h1>
        </div>

        <div className="card">
          <h3>In Progress</h3>
          <h1>{inProgressComplaints}</h1>
        </div>

        <div className="card">
          <h3>Resolved</h3>
          <h1>{resolvedComplaints}</h1>
        </div>

      </div>

      {/* ========================================================
          ALL RECENT COMPLAINTS
          This section shows complaints from ALL students.
      ======================================================== */}

      <div className="hc-recent">

        <h2>Complaints Overview</h2>

        {/* Loading */}
        {isLoading && (
          <div className="complaint-details">
            <p>Loading recent complaints...</p>
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <div className="login-error">
            {error}
          </div>
        )}

        {/* No complaints */}
        {!isLoading &&
          !error &&
          recentComplaints.length === 0 && (
            <div className="complaint-details">
              <p>No complaints have been posted yet.</p>
            </div>
          )}

        {/* Complaints table */}
        {!isLoading &&
          !error &&
          recentComplaints.length > 0 && (
            <div className="table-wrap">

              <table className="hc-table">

                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Upvotes</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {recentComplaints.map((complaint) => (
                    <React.Fragment key={complaint.id}>

                      {/* ===============================
                          COMPLAINT ROW
                      =============================== */}

                      <tr>

                        <td>
                          {formatCategory(complaint.category)}
                        </td>

                        <td>
                          <span
                            className={`status-badge ${getStatusClass(
                              complaint.status
                            )}`}
                          >
                            {formatStatus(complaint.status)}
                          </span>
                        </td>

                        <td>
                          {formatPriority(complaint.priority)}
                        </td>

                        <td>
                          <button
                            className="upvote-btn"
                            type="button"
                          >
                            {"\u2B06"} {complaint.upvotes ?? 0}
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
                              setOpenComplaint(
                                openComplaint === complaint.id
                                  ? null
                                  : complaint.id
                              )
                            }
                          >
                            {openComplaint === complaint.id
                              ? "Hide Details"
                              : "View Details"}
                          </button>
                        </td>

                      </tr>

                      {/* ===============================
                          COMPLAINT DETAILS
                      =============================== */}

                      {openComplaint === complaint.id && (
                        <tr>
                          <td colSpan="6">

                            <div className="complaint-details">

                              {/* TITLE */}
                              <p>
                                <strong>Title:</strong>{" "}
                                {complaint.title || "-"}
                              </p>

                              {/* DESCRIPTION */}
                              <p>
                                <strong>Description:</strong>{" "}
                                {complaint.description || "-"}
                              </p>

                              {/* IMAGE */}
                              {complaint.imagePath && (
                                <div className="complaint-image">

                                  <p>
                                    <strong>Attached Image:</strong>
                                  </p>

                                  <img
                                    src={getImageUrl(
                                      complaint.imagePath
                                    )}
                                    alt="Complaint attachment"
                                    className="complaint-image-preview"
                                    onError={(event) => {
                                      event.currentTarget.style.display =
                                        "none";
                                    }}
                                  />

                                </div>
                              )}

                              {/* CATEGORY */}
                              <p>
                                <strong>Category:</strong>{" "}
                                {formatCategory(complaint.category)}
                              </p>

                              {/* STATUS */}
                              <p>
                                <strong>Status:</strong>{" "}
                                {formatStatus(complaint.status)}
                              </p>

                              {/* PRIORITY */}
                              <p>
                                <strong>Priority:</strong>{" "}
                                {formatPriority(complaint.priority)}
                              </p>

                              {/* UPVOTES */}
                              <p>
                                <strong>Upvotes:</strong>{" "}
                                {complaint.upvotes ?? 0}
                              </p>

                              {/* RESOLUTION NOTE */}
                              <p>
                                <strong>Resolution Note:</strong>{" "}
                                {complaint.resolutionNote || "-"}
                              </p>

                              {/* CREATED DATE */}
                              <p>
                                <strong>Created At:</strong>{" "}
                                {formatDate(complaint.createdAt)}
                              </p>

                            </div>

                          </td>
                        </tr>
                      )}

                    </React.Fragment>
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