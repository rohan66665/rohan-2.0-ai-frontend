const API_URL = `${import.meta.env.VITE_BACKEND_URL}/chat`;

export async function sendMessage(message) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  return await res.json();
}
