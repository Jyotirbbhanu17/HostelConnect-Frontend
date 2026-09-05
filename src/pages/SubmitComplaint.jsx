import { useState } from "react";
import "../styles/submitComplaint.css";
import { apiRequest } from "../services/api";

function SubmitComplaint() {
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    image: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
    setSuccess("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    setForm({
      ...form,
      image: file || null,
    });

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Basic frontend validation
    if (!form.title.trim()) {
      setError("Please enter a complaint title.");
      return;
    }

    if (!form.category) {
      setError("Please select a category.");
      return;
    }

    if (!form.description.trim()) {
      setError("Please describe your complaint.");
      return;
    }

    try {
      setIsSubmitting(true);

      /*
       * Backend expects multipart/form-data
       */
      const formData = new FormData();

      formData.append("title", form.title.trim());

      formData.append(
        "description",
        form.description.trim()
      );

      /*
       * Backend enum expects values like:
       * ELECTRICAL
       * PLUMBING
       * WATER
       * MESS
       *
       * Our select already uses these values below.
       */
      formData.append("category", form.category);

      /*
       * DO NOT append priority.
       *
       * Backend automatically sets initial priority to LOW.
       */

      /*
       * Image is optional.
       * Only send it when the student selected one.
       */
      if (form.image) {
        formData.append("image", form.image);
      }

      const response = await apiRequest("/complaints", {
        method: "POST",
        body: formData,
      });

      console.log("Complaint created:", response);

      setSuccess("Complaint submitted successfully!");

      // Reset form
      setForm({
        title: "",
        category: "",
        description: "",
        image: null,
      });

      // Reset file input
      const fileInput = document.getElementById("complaint-image");

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (err) {
      console.error("Failed to submit complaint:", err);

      if (err.status === 401 || err.status === 403) {
        setError(
          "Your session has expired. Please login again."
        );
      } else {
        setError(
          err.message ||
            "Unable to submit complaint. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="submit-page">
      <div className="submit-card">

        <h3>Complaint Details</h3>

        <p className="submit-card__intro">
          Share the details below so the hostel team can address your concern promptly.
        </p>

        {/* =========================
            SUCCESS MESSAGE
        ========================= */}

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        {/* =========================
            ERROR MESSAGE
        ========================= */}

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <form
          className="complaint-form"
          onSubmit={handleSubmit}
        >

          {/* =========================
              TITLE
          ========================= */}

          <div className="form-field">

            <label htmlFor="complaint-title">
              Complaint Title
            </label>

            <input
              id="complaint-title"
              type="text"
              name="title"
              placeholder="Enter complaint title"
              value={form.title}
              onChange={handleChange}
              disabled={isSubmitting}
            />

          </div>


          {/* =========================
              CATEGORY
          ========================= */}

          <div className="form-field">

            <label htmlFor="complaint-category">
              Category
            </label>

            <select
              id="complaint-category"
              name="category"
              value={form.category}
              onChange={handleChange}
              disabled={isSubmitting}
            >

              <option value="">
                Select Category
              </option>

              <option value="ELECTRICAL">
                Electrical
              </option>

              <option value="PLUMBING">
                Plumbing
              </option>

              <option value="WATER">
                Water
              </option>

              <option value="CLEANLINESS">
                Cleanliness
              </option>

              <option value="MESS">
                Mess
              </option>

              <option value="INTERNET">
                Internet
              </option>

              <option value="OTHER">
                Other
              </option>

            </select>

          </div>


          {/* =========================
              DESCRIPTION
          ========================= */}

          <div className="form-field">

            <label htmlFor="complaint-description">
              Description
            </label>

            <textarea
              id="complaint-description"
              name="description"
              rows="5"
              placeholder="Describe your issue..."
              value={form.description}
              onChange={handleChange}
              disabled={isSubmitting}
            />

          </div>


          {/* =========================
              IMAGE
          ========================= */}

          <div className="form-field">

            <span className="form-label">
              Upload Image (Optional)
            </span>

            <input
              id="complaint-image"
              className="file-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={isSubmitting}
              aria-describedby="image-upload-help image-upload-name"
            />

            <label
              htmlFor="complaint-image"
              className="file-upload-control"
            >

              <span
                className="file-upload-icon"
                aria-hidden="true"
              >
                ↑
              </span>

              <span>

                <span className="file-upload-title">
                  Choose an image
                </span>

                <span className="file-upload-copy">
                  PNG, JPG, or any image format
                </span>

              </span>

            </label>

            <span
              id="image-upload-name"
              className="selected-file-name"
              aria-live="polite"
            >
              {form.image
                ? form.image.name
                : "No file selected"}
            </span>

            <span
              id="image-upload-help"
              className="form-help-text"
            >
              Attach a clear photo if it helps explain the issue.
            </span>

          </div>


          {/* =========================
              SUBMIT BUTTON
          ========================= */}

          <button
            type="submit"
            className="submit-btn"
            disabled={isSubmitting}
          >

            {isSubmitting
              ? "Submitting..."
              : "Submit Complaint"}

          </button>

        </form>

      </div>
    </div>
  );
}

export default SubmitComplaint;