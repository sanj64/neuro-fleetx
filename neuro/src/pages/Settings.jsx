import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Settings.css";

function Settings() {
  const [form, setForm] = useState({
    siteName: "Fleet Management",
    adminEmail: "admin@fleet.com",
    notifications: true,
    theme: "light"
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert("Settings saved successfully!");
    console.log(form);
  };

  return (
    <div className="admin-container">

      {/* ---------------- SIDEBAR ---------------- */}
      <aside className="sidebar">
        <h2 className="logo">Fleet Admin</h2>
        <ul className="menu">
          <li><NavLink to="/admin" className="menu-link">Dashboard</NavLink></li>
          <li><NavLink to="/admin/users" className="menu-link">Users</NavLink></li>
          <li><NavLink to="/admin/vehicles" className="menu-link">Vehicles</NavLink></li>
          <li><NavLink to="/admin/drivers" className="menu-link">Drivers</NavLink></li>
          <li><NavLink to="/admin/reports" className="menu-link">Reports</NavLink></li>
          <li><NavLink to="/admin/settings" className="menu-link active">Settings</NavLink></li>
          <li className="logout" onClick={() => { localStorage.clear(); window.location.href="/login"; }}>Logout</li>
        </ul>
      </aside>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <main className="main-content">
        <h1>Settings</h1>

        <div className="settings-form">
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label>Site Name</label>
              <input
                type="text"
                name="siteName"
                value={form.siteName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Admin Email</label>
              <input
                type="email"
                name="adminEmail"
                value={form.adminEmail}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="notifications"
                  checked={form.notifications}
                  onChange={handleChange}
                />
                Enable Notifications
              </label>
            </div>

            <div className="form-group">
              <label>Theme</label>
              <select name="theme" value={form.theme} onChange={handleChange}>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            <button type="submit" className="btn-save">Save Settings</button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Settings;