const API_URL = `${import.meta.env.VITE_BACKEND_URL}/summarize`;

export async function summarizeFile(formData) {
  const res = await fetch(API_URL, {
    method: "POST",
    body: formData,
  });

  return await res.json();
}
