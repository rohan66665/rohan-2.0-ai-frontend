// src/App.jsx
import React, { useState } from "react";
import "./App.css";
import UploadBox from "./components/UploadBox";
import ChatBox from "./components/ChatBox";

function App() {
  const [messages, setMessages] = useState([]);
  const [theme, setTheme] = useState("light"); // "light" | "dark"

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className={`app-root ${theme}`}>
      <header className="app-header">
        <div className="brand">
          <span className="logo-dot">R</span>
          <div className="brand-text">
            <h1>Rohan 2.0 — AI Chatbot</h1>
            <p className="subtitle">PDF • TXT • DOCX • Images • Chat</p>
          </div>
        </div>

        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "light" ? "🌙 Dark" : "☀ Light"}
        </button>
      </header>

      <main className="app-main">
        <section className="panel upload-panel">
          <UploadBox />
        </section>

        <section className="panel chat-panel">
          <ChatBox messages={messages} setMessages={setMessages} />
        </section>
      </main>

      <footer className="app-footer">
        <span>Made by Rohan 2.0 • Local RAG + Groq</span>
      </footer>
    </div>
  );
}

export default App;
