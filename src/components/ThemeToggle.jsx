export default function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      className="btn btn-sm btn-outline-secondary"
      onClick={onToggle}
      title="Toggle dark/light mode"
    >
      {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}
