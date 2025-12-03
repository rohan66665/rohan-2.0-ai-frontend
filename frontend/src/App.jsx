// frontend/src/App.jsx
import { useState, useRef } from "react";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "";

function ChatMessage({ m }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{
        display: "inline-block",
        padding: 10,
        borderRadius: 12,
        background: m.from === "user" ? "#0b93f6" : "#202124",
        color: m.from === "user" ? "white" : "#ddd",
        maxWidth: "80%"
      }}>
        {m.text}
        {m.file && (
          <div style={{ marginTop: 8 }}>
            <a href={m.file.url} target="_blank" rel="noreferrer" style={{ color: m.from==="user" ? "#fff" : "#9cf" }}>
              {m.file.name}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [messages, setMessages] = useState([
    { id: Date.now(), from: "bot", text: "Hello — upload a PDF / TXT / Image and ask." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const appendMessage = (m) => setMessages((s) => [...s, m]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const msg = { id: Date.now(), from: "user", text: input.trim() };
    appendMessage(msg);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg.text })
      });
      const data = await res.json();
      appendMessage({ id: Date.now()+1, from: "bot", text: data.answer || "No answer" });
    } catch (e) {
      appendMessage({ id: Date.now()+2, from: "bot", text: "Error connecting to backend." });
    } finally { setLoading(false); }
  };

  const handleFileUpload = async (ev) => {
    const file = ev.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append("file", file);

    // choose endpoint based on type
    let endpoint = `${BACKEND}/upload/`;
    if (file.type.includes("pdf")) endpoint = `${BACKEND}/upload/pdf`;
    else if (file.type.startsWith("image/")) endpoint = `${BACKEND}/upload/image`;
    else if (file.type.includes("text") || file.name.endsWith(".txt")) endpoint = `${BACKEND}/upload/text`;

    const userMsg = { id: Date.now(), from: "user", text: `Uploaded file: ${file.name}`, file: { name: file.name } };
    appendMessage(userMsg);

    setLoading(true);
    try {
      const resp = await fetch(endpoint, { method: "POST", body: form });
      const j = await resp.json(); // assume { success: true, url: "...", text: "extracted text" }
      // show file link if backend returned url
      const botMsgText = j?.text ? (j.text.length>400 ? j.text.slice(0,400)+"..." : j.text) : (j?.message || "File uploaded.");
      const botMsg = { id: Date.now()+1, from: "bot", text: botMsgText, file: j?.url ? { url: j.url, name: file.name } : undefined };
      appendMessage(botMsg);
    } catch (err) {
      appendMessage({ id: Date.now()+2, from: "bot", text: "Upload failed." });
    } finally {
      setLoading(false);
      // clear input
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#0f1115", color: "#ddd", padding: 16 }}>
      <div style={{ flex: 1, overflow: "auto", padding: 12 }}>
        {messages.map(m => <ChatMessage key={m.id} m={m} />)}
      </div>

      <div style={{ borderTop: "1px solid #222", paddingTop: 12 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.txt,image/*"
            onChange={handleFileUpload}
            style={{ display: "inline-block" }}
            title="Upload PDF / TXT / Image"
          />

          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type a message..."
            style={{ flex: 1, padding: 10, borderRadius: 8, border: "none", background: "#0b0b0c", color: "#fff" }}
            onKeyDown={e => { if (e.key === "Enter") handleSend(); }}
          />

          <button onClick={handleSend} disabled={loading} style={{
            padding: "8px 12px", borderRadius: 8, border: "none", background: "#06b6d4", color: "#000", fontWeight: "600"
          }}>
            {loading ? "..." : "Send"}
          </button>
        </div>
        <div style={{ marginTop: 8, color: "#888", fontSize: 12 }}>
          Backend: {BACKEND || "<not-set - add VITE_BACKEND_URL in Vercel / .env>"}
        </div>
      </div>
    </div>
  );
}
