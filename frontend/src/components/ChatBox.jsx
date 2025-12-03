import React, { useState } from "react";
import { sendChat } from "../api/chat";

export default function ChatBox() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  async function handleSend() {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: "you", text: input }]);

    const reply = await sendChat(input);

    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text: reply.reply || reply.message || JSON.stringify(reply),
      },
    ]);

    setInput("");
  }

  return (
    <div className="chat-box">
      <div className="messages">
        {messages.map((m, i) => (
          <p key={i} className={m.sender}>
            {m.text}
          </p>
        ))}
      </div>

      <div className="input-row">
        <input
          type="text"
          placeholder="Send a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
