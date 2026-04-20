import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    gender: "",
    adminCode: "",
    license: "",
    pan: "",
    company: "",
    phone: "",
    address: "",
    gst: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Role validations
    if (form.role === "ADMIN" && form.adminCode !== "ADMIN123") {
      alert("Invalid Admin Code");
      return;
    }
    if (form.role === "DRIVER" && (!form.license || !form.pan)) {
      alert("License and PAN required for Driver");
      return;
    }
    if (form.role === "FLEET_MANAGER" && !form.company) {
      alert("Company Name required");
      return;
    }
    if (form.role === "CUSTOMER" && !form.phone) {
      alert("Phone number required for Customer");
      return;
    }

    // DEMO: Skip backend
    alert("Signup Successful (Demo)");
    navigate("/login");
  };

  return (
    <div className="auth-page">
      <div className="signup-box">
        <h2>Create NeuroFleet Account</h2>
        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Full Name</label>
            <input name="name" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Gender</label>
            <select name="gender" onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Role</label>
            <select name="role" onChange={handleChange} required>
              <option value="">Select Role</option>
              <option value="ADMIN">Admin</option>
              <option value="DRIVER">Driver</option>
              <option value="FLEET_MANAGER">Fleet Manager</option>
              <option value="CUSTOMER">Customer</option>
            </select>
          </div>

          {form.role === "ADMIN" && (
            <div className="form-group">
              <label>Admin Access Code</label>
              <input name="adminCode" onChange={handleChange} required />
            </div>
          )}

          {form.role === "DRIVER" && (
            <>
              <div className="form-group">
                <label>Driving License Number</label>
                <input name="license" onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>PAN Number</label>
                <input name="pan" onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input name="phone" onChange={handleChange} required />
              </div>
            </>
          )}

          {form.role === "FLEET_MANAGER" && (
            <>
              <div className="form-group">
                <label>Company Name</label>
                <input name="company" onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>GST Number</label>
                <input name="gst" onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input name="phone" onChange={handleChange} required />
              </div>
            </>
          )}

          {form.role === "CUSTOMER" && (
            <>
              <div className="form-group">
                <label>Phone Number</label>
                <input name="phone" onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input name="address" onChange={handleChange} required />
              </div>
            </>
          )}

          <button type="submit">Sign Up</button>

          <div className="switch-text">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")} className="link">
              Login
            </span>
          </div>

        </form>
      </div>
    </div>
  );
}

export default Signup;