export async function chat(message) {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  return await res.json();
}
