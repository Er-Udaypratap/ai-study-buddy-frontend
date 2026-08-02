import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Login({ onSwitchToSignup, onLoginSuccess }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Email aur password both needed.");
      return;
    }

    setLoading(true);

    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    setLoading(false);

    if (loginError) {
      setError(loginError.message);
      return;
    }

    onLoginSuccess(data.user);
  };

  return (
    <div className="card shadow-sm p-4" style={{ maxWidth: "420px", margin: "40px auto" }}>
      <h3 className="mb-3 text-center">Login</h3>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="text-center mt-3 mb-0">
        New here?{" "}
        <button className="btn btn-link p-0" onClick={onSwitchToSignup}>
          Create an account
        </button>
      </p>
    </div>
  );
}
