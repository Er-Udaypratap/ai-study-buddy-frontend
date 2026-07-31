import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Chat from "./components/Chat";
import ThemeToggle from "./components/ThemeToggle";

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("login"); // "login" | "signup"
  const [checkingSession, setCheckingSession] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    // Page reload hone par bhi login session yaad rakho
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
      setCheckingSession(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Bootstrap 5.3 ka native dark mode attribute
    document.documentElement.setAttribute("data-bs-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  if (checkingSession) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (user) {
    return <Chat user={user} onLogout={() => setUser(null)} theme={theme} onToggleTheme={toggleTheme} />;
  }

  return (
    <div>
      <div className="d-flex justify-content-end p-3">
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </div>
      {view === "login" ? (
        <Login onSwitchToSignup={() => setView("signup")} onLoginSuccess={setUser} />
      ) : (
        <Signup onSwitchToLogin={() => setView("login")} />
      )}
    </div>
  );
}
