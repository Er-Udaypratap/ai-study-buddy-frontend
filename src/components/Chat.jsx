import { useState, useRef, useEffect } from "react";
import { supabase } from "../supabaseClient";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function Chat({ user, onLogout, theme, onToggleTheme, onShowPrivacy }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]); // {role, text} or {role: "model", thinking: true}
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [appHeight, setAppHeight] = useState("100vh");
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const menuRef = useRef(null);

  const fullName = user?.user_metadata?.full_name || "Student";
  const initial = fullName.charAt(0).toUpperCase();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mobile keyboard khulne par viewport height sahi set karo
  useEffect(() => {
    const setHeight = () => {
      const h = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      setAppHeight(h + "px");
    };
    setHeight();
    window.addEventListener("resize", setHeight);
    if (window.visualViewport) window.visualViewport.addEventListener("resize", setHeight);
    return () => {
      window.removeEventListener("resize", setHeight);
      if (window.visualViewport) window.visualViewport.removeEventListener("resize", setHeight);
    };
  }, []);

  // Dropdown ke bahar click hone par band karo
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputFocus = () => {
    setTimeout(() => inputRef.current?.scrollIntoView({ block: "end", behavior: "smooth" }), 300);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const isFirstMessage = messages.length === 0;
    const userMsg = { role: "user", text: input };
    const withUserMsg = [...messages, userMsg];
    setMessages([...withUserMsg, { role: "model", thinking: true }]);
    setInput("");
    setLoading(true);

    const history = messages.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [m.text],
    }));

    try {
      const res = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "general", message: userMsg.text, history }),
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
      setMessages([...withUserMsg, { role: "model", text: data.reply }]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages([...withUserMsg, { role: "model", text: "Error: " + err.message }]);
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

  const hasMessages = messages.length > 0;

  return (
    <div className="d-flex flex-column" style={{ height: appHeight }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center px-3 py-2 chat-header">
        <span className="fw-semibold" id="userNameLabel">
          Hi, {fullName}
        </span>
        <div className="d-flex gap-2 align-items-center">
          <button className="btn btn-sm btn-outline-secondary" onClick={onToggleTheme}>
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>

          <div className="dropdown position-relative" ref={menuRef}>
            <button className="avatar-circle" onClick={() => setMenuOpen((o) => !o)}>
              <span>{initial}</span>
            </button>
            {menuOpen && (
              <ul
                className="dropdown-menu dropdown-menu-end show"
                style={{ position: "absolute", right: 0, top: "100%", marginTop: "8px" }}
              >
                <li className="px-3 py-1">
                  <div className="fw-semibold">{fullName}</div>
                  <div className="small text-muted">{user?.email}</div>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setMenuOpen(false);
                      onShowPrivacy();
                    }}
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button className="dropdown-item text-danger" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Title bar - shown once chat starts */}
      {hasMessages && <div className="chat-title-bar">AI Study Buddy</div>}

      {/* Chat messages */}
      <div className="flex-grow-1 chat-window px-3 py-3">
        {!hasMessages && (
          <div className="welcome-screen">
            <h2>Welcome AI Study Buddy</h2>
            <p>Ask me anything - education, Indian Constitution, or practice your English.</p>
          </div>
        )}
        {messages.map((m, i) => {
          if (m.thinking) {
            return (
              <div key={i} className="d-flex justify-content-start">
                <div className="msg-bubble msg-bot thinking-bubble">
                  <div className="thinking-row">
                    <span className="thinking-star">★</span>
                    <span className="thinking-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </span>
                  </div>
                  <span className="thinking-label">Thinking</span>
                </div>
              </div>
            );
          }
          return (
            <div
              key={i}
              className={`d-flex mb-2 ${m.role === "user" ? "justify-content-end" : "justify-content-start"}`}
            >
              <div
                className={`msg-bubble ${m.role === "user" ? "msg-user" : "msg-bot"}`}
                style={{ whiteSpace: "pre-wrap" }}
              >
                {m.text}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input box */}
      <div className="d-flex p-2 chat-input-bar">
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
