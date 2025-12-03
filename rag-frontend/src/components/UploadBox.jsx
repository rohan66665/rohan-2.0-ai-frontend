// src/components/UploadBox.jsx
import React, { useState } from "react";
import "./UploadBox.css";
import { API_BASE_URL } from "../config";

function UploadBox() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const handleUpload = async () => {
    if (!files.length) {
      alert("Please select files!");
      return;
    }

    setUploading(true);
    setStatusMsg("Uploading...");

    const formData = new FormData();
    for (let f of files) formData.append("files", f);

    try {
      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.status === "ok") {
        setStatusMsg("✔ Upload successful!");
      } else {
        setStatusMsg("❌ Upload failed!");
      }
    } catch (err) {
      console.error(err);
      setStatusMsg("❌ Server error!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-header">
        <span className="folder-icon">📂</span>
        <div>
          <h3>Upload Files</h3>
          <p className="upload-subtitle">(PDF, TXT, DOCX, IMAGES)</p>
        </div>
      </div>

      <div className="upload-controls">
        <input
          type="file"
          id="file-input"
          multiple
          onChange={(e) => setFiles(e.target.files)}
        />
        <label htmlFor="file-input" className="file-button">
          Choose files
        </label>

        <button
          className="upload-button"
          disabled={uploading}
          onClick={handleUpload}
        >
          {uploading ? "Processing..." : "Upload"}
        </button>
      </div>

      {statusMsg && <p className="status">{statusMsg}</p>}
    </div>
  );
}

export default UploadBox;
