import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import "../styles/notices.css";

function Notices() {
  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadNotices() {
      try {
        setIsLoading(true);
        setError("");

        const data = await apiRequest("/notices");

        setNotices(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load notices:", err);
        setError("Unable to load notices. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    loadNotices();
  }, []);

  const formatDate = (dateValue) => {
    if (!dateValue) return "-";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString("en-IN");
  };

  if (isLoading) {
    return (
      <div className="student-notices-page">
        <p>Loading notices...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="student-notices-page">
        <p>{error}</p>
      </div>
    );
  }

  if (notices.length === 0) {
    return (
      <div className="student-notices-page">
        <p>No notices available.</p>
      </div>
    );
  }

  return (
    <div className="student-notices-page">
      <div className="notice-grid">
        {notices.map((notice) => (
          <div key={notice.id} className="notice-card">
            <div className="notice-header">
              <h3>{notice.title}</h3>

              <span>
                {formatDate(notice.createdAt || notice.date)}
              </span>
            </div>

            <p className="notice-author">
              👤 {notice.author || "Hostel Warden"}
            </p>

            <p>{notice.content || notice.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notices;