export async function uploadFile(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/upload/image`, {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    console.log("upload response:", data);

    return (
      data.text ||
      data.message ||
      "Uploaded"
    );
  } catch (err) {
    console.error("upload error:", err);
    return "Upload failed — server error.";
  }
}
