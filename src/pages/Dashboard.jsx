import React, { useEffect, useState } from "react";
import { apiRequest } from "../services/api";

function Dashboard() {
  // ============================================================
  // DATA
  // ============================================================

  // Complaints belonging only to the logged-in student.
  // Used for dashboard statistics and ownership checks.
  const [myComplaints, setMyComplaints] = useState([]);

  // Complaints submitted by all students.
  // Used for the Complaints Overview section.
  const [recentComplaints, setRecentComplaints] = useState([]);

  const [openComplaint, setOpenComplaint] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Stores complaint IDs that this student has upvoted
  // during the current page session.
  const [upvotedComplaints, setUpvotedComplaints] = useState(
    new Set()
  );

  // Stores the complaint currently being upvoted.
  // Prevents repeated clicks while the request is running.
  const [upvoteLoading, setUpvoteLoading] = useState(null);

  // ============================================================
  // LOAD DASHBOARD DATA
  // ============================================================

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setIsLoading(true);
        setError("");

        /*
         * Two endpoints are intentionally used:
         *
         * 1. /complaints/my
         *    -> complaints belonging to logged-in student
         *
         * 2. /complaints?sortBy=newest
         *    -> complaints belonging to all students
         */
        const [myData, allData] = await Promise.all([
          apiRequest("/complaints/my"),
          apiRequest("/complaints?sortBy=newest"),
        ]);

        setMyComplaints(
          Array.isArray(myData) ? myData : []
        );

        setRecentComplaints(
          Array.isArray(allData) ? allData : []
        );
      } catch (err) {
        console.error(
          "Failed to load dashboard data:",
          err
        );

        setError(
          "Unable to load complaints. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  // ============================================================
  // STUDENT-SPECIFIC STATISTICS
  // ============================================================

  const totalComplaints = myComplaints.length;

  const inProgressComplaints = myComplaints.filter(
    (complaint) =>
      complaint.status === "IN_PROGRESS"
  ).length;

  const resolvedComplaints = myComplaints.filter(
    (complaint) =>
      complaint.status === "RESOLVED"
  ).length;

  // ============================================================
  // COMPLAINT OWNERSHIP
  // ============================================================

  /*
   * Create a Set containing IDs of complaints belonging
   * to the currently logged-in student.
   *
   * This allows us to disable the upvote button for
   * the student's own complaints.
   */
  const myComplaintIds = new Set(
    myComplaints.map(
      (complaint) => complaint.id
    )
  );

  // ============================================================
  // UPVOTE
  // ============================================================

  const handleUpvote = async (complaintId) => {
    // Prevent repeated clicks while request is running.
    if (upvoteLoading === complaintId) {
      return;
    }

    // Prevent self-upvote on frontend.
    // Backend also enforces this rule.
    if (myComplaintIds.has(complaintId)) {
      alert(
        "You cannot upvote your own complaint."
      );
      return;
    }

    // Prevent duplicate vote during current page session.
    if (upvotedComplaints.has(complaintId)) {
      return;
    }

    try {
      setUpvoteLoading(complaintId);

      const updatedComplaint = await apiRequest(
        `/complaints/${complaintId}/upvote`,
        {
          method: "POST",
        }
      );

      /*
       * Use the complete response returned by the backend.
       *
       * This is important because the backend can update:
       * - upvotes
       * - priority
       *
       * based on the new vote count.
       */
      setRecentComplaints(
        (currentComplaints) =>
          currentComplaints.map((complaint) =>
            complaint.id === updatedComplaint.id
              ? updatedComplaint
              : complaint
          )
      );

      // Remember this vote for the current page session.
      setUpvotedComplaints(
        (currentUpvoted) => {
          const updated = new Set(
            currentUpvoted
          );

          updated.add(complaintId);

          return updated;
        }
      );
    } catch (err) {
      console.error(
        "Failed to upvote complaint:",
        err
      );

      alert(
        err.message ||
          "Unable to upvote complaint."
      );
    } finally {
      setUpvoteLoading(null);
    }
  };

  // ============================================================
  // DISPLAY HELPERS
  // ============================================================

  const enumLabels = {
    PLUMBING: "Plumbing",
    ELECTRICAL: "Electrical",
    MESS: "Mess",
    WATER: "Water",
    CLEANLINESS: "Cleanliness",
    INTERNET: "Internet",
    OTHER: "Other",

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
      .replace(
        /\b\w/g,
        (letter) => letter.toUpperCase()
      );
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
    if (!imagePath) {
      return null;
    }

    // Already a complete URL.
    if (
      imagePath.startsWith("http://") ||
      imagePath.startsWith("https://")
    ) {
      return imagePath;
    }

    // Remove leading slash to avoid double slash.
    const cleanPath = imagePath.replace(
      /^\/+/,
      ""
    );

    return `http://localhost:8081/${cleanPath}`;
  };

  // ============================================================
  // VIEW
  // ============================================================

  return (
    <div className="dashboard-container">

      {/* ======================================================
          DASHBOARD STATISTICS
      ======================================================= */}

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

      {/* ======================================================
          ALL RECENT COMPLAINTS
      ======================================================= */}

      <div className="hc-recent">

        <h2>Complaints Overview</h2>

        {/* Loading */}
        {isLoading && (
          <div className="complaint-details">
            <p>
              Loading recent complaints...
            </p>
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <div className="login-error">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!isLoading &&
          !error &&
          recentComplaints.length === 0 && (
            <div className="complaint-details">
              <p>
                No complaints have been posted yet.
              </p>
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

                  {recentComplaints.map(
                    (complaint) => {
                      const isOwnComplaint =
                        myComplaintIds.has(
                          complaint.id
                        );

                      const hasUpvoted =
                        upvotedComplaints.has(
                          complaint.id
                        );

                      const isUpvoteLoading =
                        upvoteLoading ===
                        complaint.id;

                      return (
                        <React.Fragment
                          key={complaint.id}
                        >

                          {/* Complaint row */}
                          <tr>

                            <td>
                              {formatCategory(
                                complaint.category
                              )}
                            </td>

                            <td>
                              <span
                                className={`status-badge ${getStatusClass(
                                  complaint.status
                                )}`}
                              >
                                {formatStatus(
                                  complaint.status
                                )}
                              </span>
                            </td>

                            <td>
                              {formatPriority(
                                complaint.priority
                              )}
                            </td>

                            <td>
                              <button
                                className="upvote-btn"
                                type="button"
                                disabled={
                                  isOwnComplaint ||
                                  hasUpvoted ||
                                  isUpvoteLoading
                                }
                                title={
                                  isOwnComplaint
                                    ? "You cannot upvote your own complaint."
                                    : hasUpvoted
                                      ? "You have already upvoted this complaint."
                                      : "Upvote this complaint"
                                }
                                onClick={() =>
                                  handleUpvote(
                                    complaint.id
                                  )
                                }
                              >
                                {isUpvoteLoading
                                  ? "..."
                                  : `⬆ ${complaint.upvotes ?? 0}`}
                              </button>
                            </td>

                            <td>
                              {formatDate(
                                complaint.createdAt
                              )}
                            </td>

                            <td>
                              <button
                                className="details-btn"
                                type="button"
                                onClick={() =>
                                  setOpenComplaint(
                                    openComplaint ===
                                      complaint.id
                                      ? null
                                      : complaint.id
                                  )
                                }
                              >
                                {openComplaint ===
                                complaint.id
                                  ? "Hide Details"
                                  : "View Details"}
                              </button>
                            </td>

                          </tr>

                          {/* Complaint details */}
                          {openComplaint ===
                            complaint.id && (
                            <tr>

                              <td colSpan="6">

                                <div className="complaint-details">

                                  {/* Title */}
                                  <p>
                                    <strong>
                                      Title:
                                    </strong>{" "}
                                    {complaint.title ||
                                      "-"}
                                  </p>

                                  {/* Description */}
                                  <p>
                                    <strong>
                                      Description:
                                    </strong>{" "}
                                    {complaint.description ||
                                      "-"}
                                  </p>

                                  {/* Image */}
                                  {complaint.imagePath && (
                                    <div className="complaint-image">

                                      <p>
                                        <strong>
                                          Attached Image:
                                        </strong>
                                      </p>

                                      <img
                                        src={getImageUrl(
                                          complaint.imagePath
                                        )}
                                        alt="Complaint attachment"
                                        className="complaint-image-preview"
                                        onError={(
                                          event
                                        ) => {
                                          event.currentTarget.style.display =
                                            "none";
                                        }}
                                      />

                                    </div>
                                  )}

                                  {/* Category */}
                                  <p>
                                    <strong>
                                      Category:
                                    </strong>{" "}
                                    {formatCategory(
                                      complaint.category
                                    )}
                                  </p>

                                  {/* Status */}
                                  <p>
                                    <strong>
                                      Status:
                                    </strong>{" "}
                                    {formatStatus(
                                      complaint.status
                                    )}
                                  </p>

                                  {/* Priority */}
                                  <p>
                                    <strong>
                                      Priority:
                                    </strong>{" "}
                                    {formatPriority(
                                      complaint.priority
                                    )}
                                  </p>

                                  {/* Upvotes */}
                                  <p>
                                    <strong>
                                      Upvotes:
                                    </strong>{" "}
                                    {complaint.upvotes ??
                                      0}
                                  </p>

                                  {/* Resolution Note */}
                                  <p>
                                    <strong>
                                      Resolution Note:
                                    </strong>{" "}
                                    {complaint.resolutionNote ||
                                      "-"}
                                  </p>

                                  {/* Created Date */}
                                  <p>
                                    <strong>
                                      Created At:
                                    </strong>{" "}
                                    {formatDate(
                                      complaint.createdAt
                                    )}
                                  </p>

                                </div>

                              </td>

                            </tr>
                          )}

                        </React.Fragment>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>
          )}

      </div>

    </div>
  );
}

export default Dashboard;