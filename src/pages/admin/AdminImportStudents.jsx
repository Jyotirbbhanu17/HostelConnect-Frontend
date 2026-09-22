import { useRef, useState } from "react";

import "../../styles/adminImportStudents.css";

function AdminImportStudents() {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);

  function selectFile(selectedFile) {
    setMessage("");
    setError("");

    if (!selectedFile) return;

    const isExcel = /\.(xlsx|xls)$/i.test(selectedFile.name);

    if (!isExcel) {
      setFile(null);
      setError("Please select an Excel file (.xlsx or .xls).");
      return;
    }

    setFile(selectedFile);
  }

  function handleFileChange(event) {
    selectFile(event.target.files[0]);
  }

  function handleDragOver(event) {
    event.preventDefault();
    setDragActive(true);
  }

  function handleDragLeave(event) {
    event.preventDefault();
    setDragActive(false);
  }

  function handleDrop(event) {
    event.preventDefault();
    setDragActive(false);

    const droppedFile = event.dataTransfer.files[0];
    selectFile(droppedFile);
  }

  function removeFile(event) {
    event.stopPropagation();

    setFile(null);
    setMessage("");
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  

  return (
    <div className="admin-import-page">
      <div className="admin-page-header">
        <div>
          
          <p>
            Add multiple students to HostelConnect using an Excel file.
          </p>
        </div>
      </div>

      <div className="admin-import-layout">
        <div className="admin-import-card">
          <div>
            <div className="admin-import-section-header">
              <h2>Upload Student Data</h2>
              <p>
                Select the official student Excel sheet provided by the
                hostel administration.
              </p>
            </div>

            <div
              className={`admin-file-upload ${
                dragActive ? "drag-active" : ""
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                className="admin-file-input"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
              />

              <div className="admin-file-icon">
                <span>↑</span>
              </div>

              <h3>
                {file
                  ? "Excel file selected"
                  : "Drop your Excel file here"}
              </h3>

              <p>
                {file
                  ? "Click anywhere to choose another file"
                  : "or click to browse from your computer"}
              </p>

              <span className="admin-file-format">
                Supported formats: .xlsx, .xls
              </span>
            </div>

            {file && (
              <div className="admin-selected-file">
                <div className="admin-selected-file-left">
                  <div className="admin-excel-icon">X</div>

                  <div>
                    <div className="admin-selected-file-name">
                      {file.name}
                    </div>

                    <div className="admin-selected-file-size">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="admin-remove-file"
                  onClick={removeFile}
                >
                  Remove
                </button>
              </div>
            )}

            {message && (
              <div className="admin-import-message success">
                <span>✓</span>
                {message}
              </div>
            )}

            {error && (
              <div className="admin-import-message error">
                <span>!</span>
                {error}
              </div>
            )}
          </div>
        </div>

        <div className="admin-import-info-card">
          <div className="admin-info-icon">i</div>

          <div>
            <h3>Before you import</h3>

            <p>
              Make sure the Excel sheet is the official format provided
              by your hostel administration.
            </p>

            <div className="admin-info-list">
              <div>
                <span>✓</span>
                <p>Use the official student Excel format.</p>
              </div>

              <div>
                <span>✓</span>
                <p>Make sure student details are complete.</p>
              </div>

              <div>
                <span>✓</span>
                <p>Check the file before starting the import.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminImportStudents;