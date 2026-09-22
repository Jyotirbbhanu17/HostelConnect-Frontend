import { useEffect, useState } from "react";
import { apiRequest } from "../../services/api";
import "../../styles/adminStudents.css";
function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [hostelYear, setHostelYear] = useState("");
  const [accountStatus, setAccountStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadStudents();
  }, [search, hostelYear, accountStatus]);

  async function loadStudents() {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (search.trim()) {
        params.append("search", search.trim());
      }

      if (hostelYear) {
        params.append("hostelYear", hostelYear);
      }

      if (accountStatus) {
        params.append("accountStatus", accountStatus);
      }

      const query = params.toString();
      const data = await apiRequest(
        `/admin/students${query ? `?${query}` : ""}`
      );

      setStudents(data || []);
    } catch (error) {
      console.error("Failed to load students:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(student) {
    const newStatus =
      student.accountStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    try {
      setUpdatingId(student.id);

      await apiRequest(
        `/admin/students/${student.id}/status?accountStatus=${newStatus}`,
        {
          method: "PUT",
        }
      );

      await loadStudents();
    } catch (error) {
      console.error("Failed to update student status:", error);
    } finally {
      setUpdatingId(null);
    }
  }

  function getStatusClass(status) {
    switch (status) {
      case "ACTIVE":
        return "admin-status active";

      case "INACTIVE":
        return "admin-status inactive";

      case "SUSPENDED":
        return "admin-status suspended";

      default:
        return "admin-status";
    }
  }

  return (
    <div className="admin-students-page">
      <div className="admin-page-header">
        <div>
          <h1>Students</h1>
          <p>Manage registered students and their account status.</p>
        </div>
      </div>

      <div className="admin-student-filters">
        <input
          type="text"
          placeholder="Search by name, email or enrollment number"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={hostelYear}
          onChange={(e) => setHostelYear(e.target.value)}
        >
          <option value="">All Years</option>
          <option value="FIRST">First Year</option>
          <option value="SECOND">Second Year</option>
          <option value="THIRD">Third Year</option>
          <option value="FOURTH">Fourth Year</option>
        </select>

        <select
          value={accountStatus}
          onChange={(e) => setAccountStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
      </div>

      <div className="admin-students-card">
        {loading ? (
          <div className="admin-loading">Loading students...</div>
        ) : students.length === 0 ? (
          <div className="admin-empty">
            No students found.
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-students-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Enrollment No.</th>
                  <th>Email</th>
                  <th>Hostel</th>
                  <th>Year</th>
                  <th>Room</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <div className="admin-student-name">
                        {student.fullName}
                      </div>
                    </td>

                    <td>{student.enrollmentNumber || "-"}</td>

                    <td>{student.email || "-"}</td>

                    <td>{student.hostelName || "-"}</td>

                    <td>{student.hostelYear || "-"}</td>

                    <td>{student.roomNumber || "-"}</td>

                    <td>
                      <span className={getStatusClass(student.accountStatus)}>
                        {student.accountStatus}
                      </span>
                    </td>

                    <td>
                      <button
                        className={
                          student.accountStatus === "ACTIVE"
                            ? "admin-status-btn deactivate"
                            : "admin-status-btn activate"
                        }
                        onClick={() => handleStatusChange(student)}
                        disabled={updatingId === student.id}
                      >
                        {updatingId === student.id
                          ? "Updating..."
                          : student.accountStatus === "ACTIVE"
                            ? "Deactivate"
                            : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminStudents;