import { useState, useRef, useEffect } from "react";
import { supabase } from "../supabaseClient";
import ThemeToggle from "./ThemeToggle";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL; // e.g. https://your-backend.onrender.com

const MODES = [
  { key: "education", label: "Education" },
  { key: "constitution", label: "Constitution" },
  { key: "english", label: "English Speaking" },
];

export default function Chat({ user, onLogout, theme, onToggleTheme }) {
  const [mode, setMode] = useState("education");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]); // {role: "user"/"model", text: "..."}
  const [loading, setLoading] = useState(false);
  const [appHeight, setAppHeight] = useState("100vh");
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mobile keyboard khulne par viewport height sahi set karo (dvh CSS Android Chrome pe reliable nahi hota)
  useEffect(() => {
    const updateHeight = () => {
      const height = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      setAppHeight(height + "px");
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", updateHeight);
    }
    return () => {
      window.removeEventListener("resize", updateHeight);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", updateHeight);
      }
    };
  }, []);

  const handleInputFocus = () => {
    setTimeout(() => inputRef.current?.scrollIntoView({ block: "end", behavior: "smooth" }), 300);
  };

  // Mode switch karne par history alag rakho (har mode ki apni conversation)
  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setMessages([]);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", text: input };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    // Gemini format ke liye history convert karo
    const history = messages.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [m.text],
    }));

    try {
      const res = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, message: userMsg.text, history }),
      });

      if (!res.ok) {
        let detail = `Status ${res.status}`;
        try {
          const errBody = await res.json();
          detail = errBody.detail || detail;
        } catch (_) {}
        throw new Error(detail);
      }

      const data = await res.json();
      setMessages([...updatedMessages, { role: "model", text: data.reply }]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages([...updatedMessages, { role: "model", text: "Error: " + err.message }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  return (
    <div className="d-flex flex-column" style={{ height: appHeight }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom bg-body">
        <span className="fw-semibold">Hi, {user?.user_metadata?.full_name || "Student"}</span>
        <div className="d-flex gap-2">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button className="btn btn-sm btn-outline-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Mode tabs */}
      <ul className="nav nav-tabs px-3 pt-2 bg-body">
        {MODES.map((m) => (
          <li className="nav-item" key={m.key}>
            <button
              className={`nav-link ${mode === m.key ? "active" : ""}`}
              onClick={() => handleModeSwitch(m.key)}
            >
              {m.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Chat messages */}
      <div className="flex-grow-1 overflow-auto px-3 py-3 bg-body-tertiary">
        {messages.length === 0 && (
          <p className="text-muted text-center mt-5">
            {mode === "education" && "Ask any subject or exam-related question."}
            {mode === "constitution" && "Ask anything about the Indian Constitution."}
            {mode === "english" && "Type in English and I'll help correct your mistakes."}
          </p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`d-flex mb-2 ${m.role === "user" ? "justify-content-end" : "justify-content-start"}`}
          >
            <div
              className={`p-2 px-3 rounded-3 ${
                m.role === "user" ? "bg-primary text-white" : "bg-body border"
              }`}
              style={{ maxWidth: "75%", whiteSpace: "pre-wrap" }}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && <div className="text-muted small">Typing...</div>}
        <div ref={bottomRef} />
      </div>

      {/* Input box */}
      <div className="d-flex p-2 border-top bg-body">
        <textarea
          ref={inputRef}
          className="form-control me-2"
          rows={1}
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
        />
        <button className="btn btn-primary" onClick={handleSend} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}
