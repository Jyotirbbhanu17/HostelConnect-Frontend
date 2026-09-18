import { useEffect, useState } from "react";
import { apiRequest } from "../../services/api";
import "../../styles/wardenNotices.css";

function Notices() {
  const [notices, setNotices] = useState([]);

  const [form, setForm] = useState({
    title: "",
    content: "",
  });

  const [editingId, setEditingId] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function loadNotices() {
      try {
        setIsLoading(true);
        setError("");

        const data = await apiRequest("/notices");

        const sortedNotices = Array.isArray(data)
  ? [...data].sort(
      (a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    )
  : [];

      setNotices(sortedNotices);
      } catch (err) {
        console.error("Failed to load notices:", err);
        setError(
          err.message ||
            "Unable to load notices. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadNotices();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
    setSuccessMessage("");
  };

  const resetForm = () => {
    setForm({
      title: "",
      content: "",
    });

    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      setError("Please fill in both title and content.");
      return;
    }

    try {
      setIsSaving(true);
      setError("");
      setSuccessMessage("");

      if (editingId) {
        const updatedNotice = await apiRequest(
          `/notices/${editingId}`,
          {
            method: "PUT",
            body: JSON.stringify({
              title: form.title.trim(),
              content: form.content.trim(),
            }),
          }
        );

        setNotices((currentNotices) =>
          currentNotices.map((notice) =>
            notice.id === editingId
              ? updatedNotice
              : notice
          )
        );

        setSuccessMessage("Notice updated successfully.");
      } else {
        const newNotice = await apiRequest("/notices", {
          method: "POST",
          body: JSON.stringify({
            title: form.title.trim(),
            content: form.content.trim(),
          }),
        });

        setNotices((currentNotices) => [
          newNotice,
          ...currentNotices,
        ]);

        setSuccessMessage("Notice published successfully.");
      }

      resetForm();
    } catch (err) {
      console.error("Failed to save notice:", err);

      setError(
        err.message ||
          "Unable to save notice. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (notice) => {
    setEditingId(notice.id);

    setForm({
      title: notice.title || "",
      content: notice.content || "",
    });

    setError("");
    setSuccessMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (noticeId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this notice?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(noticeId);
      setError("");
      setSuccessMessage("");

      await apiRequest(`/notices/${noticeId}`, {
        method: "DELETE",
      });

      setNotices((currentNotices) =>
        currentNotices.filter(
          (notice) => notice.id !== noticeId
        )
      );

      if (editingId === noticeId) {
        resetForm();
      }

      setSuccessMessage("Notice deleted successfully.");
    } catch (err) {
      console.error("Failed to delete notice:", err);

      setError(
        err.message ||
          "Unable to delete notice. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "-";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString("en-IN");
  };

  return (
    <div className="notices-page">
      {/* Create / Edit Notice */}

      <div className="notice-form-card">
        <h2>
          {editingId ? "Edit Notice" : "Create Notice"}
        </h2>

        <input
          type="text"
          name="title"
          placeholder="Notice Title"
          value={form.title}
          onChange={handleChange}
          disabled={isSaving}
        />

        <textarea
          name="content"
          rows="5"
          placeholder="Write notice content..."
          value={form.content}
          onChange={handleChange}
          disabled={isSaving}
        />

        {error && (
          <p className="form-error">
            {error}
          </p>
        )}

        {successMessage && (
          <p className="form-success">
            {successMessage}
          </p>
        )}

        <div className="notice-form-actions">
          <button
            className="publish-btn"
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
          >
            {isSaving
              ? "Saving..."
              : editingId
              ? "Update Notice"
              : "Publish Notice"}
          </button>

          {editingId && (
            <button
              className="cancel-btn"
              type="button"
              onClick={resetForm}
              disabled={isSaving}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* View Notices */}

      <div className="notice-list-card">
        <h2>All Notices</h2>

        {isLoading ? (
          <p>Loading notices...</p>
        ) : notices.length === 0 ? (
          <p>No notices available.</p>
        ) : (
          notices.map((notice) => (
            <div
              key={notice.id}
              className="notice-card"
            >
              <h3>{notice.title}</h3>

              <p>{notice.content}</p>

              <div className="notice-meta">
                <span>
                  {notice.postedBy || "Hostel Warden"}
                </span>

                <span>
                  {formatDate(notice.createdAt)}
                </span>
              </div>

              <div className="notice-actions">
                <button
                  type="button"
                  className="edit-btn"
                  onClick={() => handleEdit(notice)}
                  disabled={deletingId === notice.id}
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => handleDelete(notice.id)}
                  disabled={deletingId === notice.id}
                >
                  {deletingId === notice.id
                    ? "Deleting..."
                    : "Delete"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notices;