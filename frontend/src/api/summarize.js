export async function summarizeFile(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/summarize-file`, {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    console.log("summarize response:", data);

    return data.summary || data.text || JSON.stringify(data);
  } catch (err) {
    console.error("summarize error:", err);
    return "Summary failed — backend error.";
  }
}
