import { useState } from "react";
import "../styles/submitComplaint.css";

function SubmitComplaint() {
  const [form, setForm] = useState({
    title: "",
    category: "",
    priority: "",
    description: "",
    image: null,
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setForm({
      ...form,
      image: e.target.files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(form);

    alert("Complaint Submitted");
  };

  return (
    <div className="submit-page">
      <div className="submit-card">
        <h3>Complaint Details</h3>
        <p className="submit-card__intro">
          Share the details below so the hostel team can address your concern promptly.
        </p>

        <form className="complaint-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="complaint-title">Complaint Title</label>
            <input
              id="complaint-title"
              type="text"
              name="title"
              placeholder="Enter complaint title"
              value={form.title}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label htmlFor="complaint-category">Category</label>
            <select
              id="complaint-category"
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              <option value="Electrical">Electrical</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Water">Water</option>
              <option value="Cleanliness">Cleanliness</option>
              <option value="Mess">Mess</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* <label>Priority</label>
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
          >
            <option value="">Select Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select> */}

          <div className="form-field">
            <label htmlFor="complaint-description">Description</label>
            <textarea
              id="complaint-description"
              name="description"
              rows="5"
              placeholder="Describe your issue..."
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <span className="form-label">Upload Image (Optional)</span>
            <input
              id="complaint-image"
              className="file-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              aria-describedby="image-upload-help image-upload-name"
            />
            <label htmlFor="complaint-image" className="file-upload-control">
              <span className="file-upload-icon" aria-hidden="true">↑</span>
              <span>
                <span className="file-upload-title">Choose an image</span>
                <span className="file-upload-copy">PNG, JPG, or any image format</span>
              </span>
            </label>
            <span id="image-upload-name" className="selected-file-name" aria-live="polite">
              {form.image ? form.image.name : "No file selected"}
            </span>
            <span id="image-upload-help" className="form-help-text">
              Attach a clear photo if it helps explain the issue.
            </span>
          </div>

          <button type="submit" className="submit-btn">
            Submit Complaint
          </button>
        </form>
      </div>
    </div>
  );
}

export default SubmitComplaint;
