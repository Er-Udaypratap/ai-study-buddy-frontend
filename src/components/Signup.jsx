import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Signup({ onSwitchToLogin }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobileNo: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.fullName || !form.email || !form.mobileNo || !form.password) {
      return "Sabhi fields bharna zaroori hai.";
    }
    if (!/^\d{10}$/.test(form.mobileNo)) {
      return "Mobile number 10 digit ka valid number hona chahiye.";
    }
    if (form.password.length < 6) {
      return "Password kam se kam 6 characters ka hona chahiye.";
    }
    if (form.password !== form.confirmPassword) {
      return "Password aur Confirm Password match nahi kar rahe.";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    const { error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.fullName,
          mobile_no: form.mobileNo,
        },
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    setSuccessMsg("Account ban gaya! Email verify karke login karo.");
  };

  return (
    <div className="card shadow-sm p-4" style={{ maxWidth: "420px", margin: "40px auto" }}>
      <h3 className="mb-3 text-center">Create Account</h3>

      {error && <div className="alert alert-danger py-2">{error}</div>}
      {successMsg && <div className="alert alert-success py-2">{successMsg}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            name="fullName"
            className="form-control"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
          />
        </div>

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
          <label className="form-label">Mobile Number</label>
          <input
            type="tel"
            name="mobileNo"
            className="form-control"
            value={form.mobileNo}
            onChange={handleChange}
            placeholder="10 digit mobile number"
            maxLength={10}
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
            placeholder="Minimum 6 characters"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            className="form-control"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter your password"
          />
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Creating..." : "Sign Up"}
        </button>
      </form>

      <p className="text-center mt-3 mb-0">
        Already have an account?{" "}
        <button className="btn btn-link p-0" onClick={onSwitchToLogin}>
          Login
        </button>
      </p>
    </div>
  );
}
