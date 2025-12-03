import { useState } from "react";
import { uploadFile } from "../api/upload";

export default function UploadBox() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");

  async function handleUpload() {
    if (!file) return;
    const res = await uploadFile(file);
    setResult(res.text || "No output");
  }

  return (
    <div>
      <h2>Upload File</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
      <p>{result}</p>
    </div>
  );
}
