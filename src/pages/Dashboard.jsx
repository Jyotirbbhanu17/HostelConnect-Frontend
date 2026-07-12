import { useState } from "react";

function Dashboard() {
  const [openComplaint, setOpenComplaint] = useState(null);

  return (
    <div className="dashboard-container">
      <div className="dashboard-stats">
        <div className="card">
          <h3>Total Complaints</h3>
          <h1>30</h1>
        </div>

        <div className="card">
          <h3>In Progress</h3>
          <h1>10</h1>
        </div>

        <div className="card">
          <h3>Resolved</h3>
          <h1>12</h1>
        </div>
      </div>

      <div className="hc-recent">
        <h2>Complaints Overview</h2>

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
            {/* Complaint 1 */}
            <tr>
              <td>Electrical</td>

              <td>
                <span className="status-badge badge-progress">
                  In Progress
                </span>
              </td>

              <td>High</td>

              <td>
                <button className="upvote-btn">
                  ⬆ 15
                </button>
              </td>

              <td>03/06/2026</td>

              <td>
                <button
                  className="details-btn"
                  onClick={() =>
                    setOpenComplaint(
                      openComplaint === 1 ? null : 1
                    )
                  }
                >
                  {openComplaint === 1
                    ? "Hide Details"
                    : "View Details"}
                </button>
              </td>
            </tr>

            {openComplaint === 1 && (
              <tr>
                <td colSpan="6">
                  <div className="complaint-details">
                    <p>
                      <strong>Author:</strong> Jyotirbhanu
                    </p>

                    <p>
                      <strong>Title:</strong> Tube Light Not Working
                    </p>

                    <p>
                      <strong>Description:</strong> Tube light is not
                      turning on even after replacement attempt.
                    </p>

                    <p>
                      <strong>Hostel:</strong> H. Bhabha Hostel
                    </p>

                    <p>
                      <strong>Room:</strong> F-18
                    </p>
                  </div>
                </td>
              </tr>
            )}

            {/* Complaint 2 */}
            <tr>
              <td>Mess</td>

              <td>
                <span className="status-badge badge-resolved">
                  Resolved
                </span>
              </td>

              <td>Medium</td>

              <td>
                <button className="upvote-btn">
                  ⬆ 12
                </button>
              </td>

              <td>01/06/2026</td>

              <td>
                <button
                  className="details-btn"
                  onClick={() =>
                    setOpenComplaint(
                      openComplaint === 2 ? null : 2
                    )
                  }
                >
                  {openComplaint === 2
                    ? "Hide Details"
                    : "View Details"}
                </button>
              </td>
            </tr>

            {openComplaint === 2 && (
              <tr>
                <td colSpan="6">
                  <div className="complaint-details">
                    <p>
                      <strong>Author:</strong> Rahul Kumar
                    </p>

                    <p>
                      <strong>Title:</strong> Poor Food Quality
                    </p>

                    <p>
                      <strong>Description:</strong> Food quality has
                      decreased significantly during the last week.
                    </p>

                    <p>
                      <strong>Hostel:</strong> H. Bhabha Hostel
                    </p>

                    <p>
                      <strong>Room:</strong> C-205
                    </p>
                  </div>
                </td>
              </tr>
            )}

            {/* Complaint 3 */}
            <tr>
              <td>Plumbing</td>

              <td>
                <span className="status-badge badge-pending">
                  Submitted
                </span>
              </td>

              <td>High</td>

              <td>
                <button className="upvote-btn">
                  ⬆ 8
                </button>
              </td>

              <td>28/05/2026</td>

              <td>
                <button
                  className="details-btn"
                  onClick={() =>
                    setOpenComplaint(
                      openComplaint === 3 ? null : 3
                    )
                  }
                >
                  {openComplaint === 3
                    ? "Hide Details"
                    : "View Details"}
                </button>
              </td>
            </tr>

            {openComplaint === 3 && (
              <tr>
                <td colSpan="6">
                  <div className="complaint-details">
                    <p>
                      <strong>Author:</strong> Aman Singh
                    </p>

                    <p>
                      <strong>Title:</strong> Water Leakage
                    </p>

                    <p>
                      <strong>Description:</strong> Continuous leakage
                      from bathroom pipeline causing water accumulation.
                    </p>

                    <p>
                      <strong>Hostel:</strong> H. Bhabha Hostel
                    </p>

                    <p>
                      <strong>Room:</strong> B-112
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
