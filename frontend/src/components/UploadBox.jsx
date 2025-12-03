import React, { useState } from "react";
import { uploadFile } from "../api/upload";

export default function UploadBox() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  async function handleUpload() {
    if (!file) return;
    setStatus("Uploading...");

    const res = await uploadFile(file);
    setStatus(res);
  }

  return (
    <div className="upload-box">
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
      {status && <p>{status}</p>}
    </div>
  );
}
