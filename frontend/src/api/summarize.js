export async function summarize(text) {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/summarize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  return await res.json();
}
