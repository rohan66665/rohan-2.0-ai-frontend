const API_URL = `${import.meta.env.VITE_BACKEND_URL}/summarize`;

export async function summarizeText(text) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error("Summarization error");
    }

    const data = await response.json();
    return data.summary;
  } catch (error) {
    console.error("Summarize API Error:", error);
    return "❌ Server error!";
  }
}
