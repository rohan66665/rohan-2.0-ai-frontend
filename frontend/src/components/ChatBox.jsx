import { useState } from "react";
import { chat } from "../api/chat";

export default function ChatBox() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  async function handleSend() {
    if (!input.trim()) return;

    setMessages([...messages, { sender: "You", text: input }]);

    const res = await chat(input);
    setMessages((m) => [...m, { sender: "AI", text: res.reply }]);

    setInput("");
  }

  return (
    <div>
      <h2>Chat</h2>
      <div>
        {messages.map((m, i) => (
          <p key={i}><b>{m.sender}:</b> {m.text}</p>
        ))}
      </div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
