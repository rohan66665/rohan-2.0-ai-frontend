import React from "react";
import ChatBox from "./components/ChatBox.jsx";
import UploadBox from "./components/UploadBox.jsx";
import "./App.css";

export default function App() {
  return (
    <div className="page">
      <h1>Rohan 2.0 — AI Chatbot</h1>
      <UploadBox />
      <ChatBox />
    </div>
  );
}
