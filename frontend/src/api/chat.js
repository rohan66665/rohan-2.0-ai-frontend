export async function sendChat(message) {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  const data = await res.json();

  // Safely return only the reply text
  return data.reply || JSON.stringify(data);
}
