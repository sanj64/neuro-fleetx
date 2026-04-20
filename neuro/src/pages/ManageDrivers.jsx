import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./ManageDrivers.css";

function ManageDrivers() {
  const [drivers, setDrivers] = useState([]);

  const [form, setForm] = useState({
    id: null,
    name: "",
    email: "",
    phone: "",
    status: "ACTIVE",
    vehicle: ""
  });

  const [editing, setEditing] = useState(false);

  // Handle form input changes
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Add driver
  const addDriver = () => {
    const newDriver = { ...form, id: Date.now() };
    setDrivers([...drivers, newDriver]);
    resetForm();
  };

  // Edit driver
  const editDriver = (driver) => {
    setForm(driver);
    setEditing(true);
  };

  // Update driver
  const updateDriver = () => {
    setDrivers(drivers.map(d => d.id === form.id ? form : d));
    setEditing(false);
    resetForm();
  };

  // Delete driver
  const deleteDriver = (id) => setDrivers(drivers.filter(d => d.id !== id));

  // Reset form
  const resetForm = () => setForm({ id: null, name: "", email: "", phone: "", status: "ACTIVE", vehicle: "" });

  // Dashboard counts
  const total = drivers.length;
  const active = drivers.filter(d => d.status === "ACTIVE").length;
  const onLeave = drivers.filter(d => d.status === "ON LEAVE").length;
  const suspended = drivers.filter(d => d.status === "SUSPENDED").length;

  return (
    <div className="admin-container">

      {/* ---------------- SIDEBAR ---------------- */}
      <aside className="sidebar">
        <h2 className="logo">Fleet Admin</h2>
        <ul className="menu">
          <li><NavLink to="/admin" className="menu-link">Dashboard</NavLink></li>
          <li><NavLink to="/admin/users" className="menu-link">Users</NavLink></li>
          <li><NavLink to="/admin/vehicles" className="menu-link">Vehicles</NavLink></li>
          <li><NavLink to="/admin/drivers" className="menu-link active">Drivers</NavLink></li>
          <li><NavLink to="/admin/reports" className="menu-link">Reports</NavLink></li>
          <li className="logout" onClick={() => { localStorage.clear(); window.location.href="/login"; }}>Logout</li>
        </ul>
      </aside>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <main className="main-content">
        <h1>Manage Drivers</h1>

        {/* Dashboard Cards */}
        <div className="dashboard-cards">
          <div className="card"><h3>{total}</h3><p>Total Drivers</p></div>
          <div className="card active"><h3>{active}</h3><p>Active</p></div>
          <div className="card on-leave"><h3>{onLeave}</h3><p>On Leave</p></div>
          <div className="card suspended"><h3>{suspended}</h3><p>Suspended</p></div>
        </div>

        {/* Driver Form */}
        <div className="form-container">
          <h3>{editing ? "Update Driver" : "Add New Driver"}</h3>
          <form onSubmit={e => { e.preventDefault(); editing ? updateDriver() : addDriver(); }}>
            <input type="text" name="name" placeholder="Driver Name" value={form.name} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
            <input type="text" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="ACTIVE">ACTIVE</option>
              <option value="ON LEAVE">ON LEAVE</option>
              <option value="SUSPENDED">SUSPENDED</option>
            </select>
            <input type="text" name="vehicle" placeholder="Assigned Vehicle" value={form.vehicle} onChange={handleChange} />
            <button type="submit">{editing ? "Update Driver" : "Add Driver"}</button>
          </form>
        </div>

        {/* Drivers Table */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Vehicle</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {drivers.length === 0 ? (
                <tr><td colSpan="6">No Drivers Found</td></tr>
              ) : (
                drivers.map(d => (
                  <tr key={d.id}>
                    <td>{d.name}</td>
                    <td>{d.email}</td>
                    <td>{d.phone}</td>
                    <td className={`status-badge ${d.status.toLowerCase().replace(" ", "-")}`}>{d.status}</td>
                    <td>{d.vehicle}</td>
                    <td>
                      <button className="btn-edit" onClick={() => editDriver(d)}>Edit</button>
                      <button className="btn-delete" onClick={() => deleteDriver(d.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
}

export default ManageDrivers;