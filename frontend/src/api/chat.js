export async function sendChat(message) {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await res.json();
    console.log("chat response:", data);

    return (
      data.reply ||
      data.response ||
      data.message ||
      JSON.stringify(data)
    );
  } catch (err) {
    console.error("chat error:", err);
    return "Server error — chat failed.";
  }
}
