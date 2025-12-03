// src/components/ChatBox.jsx
import React, { useState, useRef, useEffect } from "react";
import "../App.css";
import { API_BASE_URL } from "../config";

function ChatBox({ messages, setMessages }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!query.trim() || loading) return;

    const text = query;
    const userMsg = { role: "user", text };
    setMessages((m) => [...m, userMsg]);
    setQuery("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text }),
      });

      const data = await res.json();

      const botMsg = {
        role: "bot",
        text: data.answer || "No answer",
        sources: Array.isArray(data.sources) ? data.sources : [],
      };

      setMessages((m) => [...m, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages((m) => [
        ...m,
        {
          role: "bot",
          text: "❌ Backend Error / No Response",
          sources: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message-row ${msg.role}`}>
            <div className="avatar">
              {msg.role === "user" ? "🧑" : "🤖"}
            </div>
            <div className="bubble">
              <p>{msg.text}</p>

              {msg.sources?.length > 0 && (
                <div className="sources">
                  <strong>Sources:</strong>
                  {msg.sources.map((s, idx) => (
                    <div className="source" key={idx}>
                      <b>{s.filename || "unknown"}</b>
                      <div className="src-text">
                        {(s.text || "").slice(0, 180)}
                        {(s.text || "").length > 180 ? "..." : ""}
                      </div>
                      {s.score !== undefined && (
                        <div className="score">
                          score: {Number(s.score).toFixed(3)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="chat-controls">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Send a message..."
          rows={2}
        />
        <button onClick={sendMessage} disabled={loading}>
          {loading ? "Thinking..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default ChatBox;
