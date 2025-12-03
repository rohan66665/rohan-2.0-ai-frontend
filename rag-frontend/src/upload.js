const API_URL = `${import.meta.env.VITE_BACKEND_URL}/upload`;

export async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Upload API Error:", error);
    return { error: "❌ Server error!" };
  }
}
