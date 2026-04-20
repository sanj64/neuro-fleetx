import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "",
    adminCode: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // DEMO Mode – skip backend
    setTimeout(() => {
      setLoading(false);

      // Admin code check
      if (form.role === "ADMIN" && form.adminCode !== "ADMIN123") {
        setError("Invalid Admin Code (Demo)");
        return;
      }

      // Simple demo login rules
      if (form.email === "" || form.password === "") {
        setError("Email and Password required");
        return;
      }

      // Determine role (already selected)
      const role = form.role;

      // Save user info locally
      localStorage.setItem("user", JSON.stringify({ email: form.email, role }));

      // Navigate based on role
      if (role === "ADMIN") navigate("/admin");
      else if (role === "DRIVER") navigate("/driver");
      else if (role === "FLEET_MANAGER") navigate("/manager");
      else if (role === "CUSTOMER") navigate("/customer");
      else setError("Please select a role");

    }, 500); // simulate loading
  };

  return (
    <div className="auth-page">
      <div className="login-box">
        <h2>Login to NeuroFleet</h2>
        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />

          <label>Password</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} required />

          <label>Role</label>
          <select name="role" value={form.role} onChange={handleChange} required>
            <option value="">Select Role</option>
            <option value="ADMIN">Admin</option>
            <option value="DRIVER">Driver</option>
            <option value="FLEET_MANAGER">Fleet Manager</option>
            <option value="CUSTOMER">Customer</option>
          </select>

          {form.role === "ADMIN" && (
            <>
              <label>Admin Code</label>
              <input type="password" name="adminCode" value={form.adminCode} onChange={handleChange} required />
            </>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="footer">
            Don’t have an account?{" "}
            <span onClick={() => navigate("/signup")} className="link">
              Sign Up
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;