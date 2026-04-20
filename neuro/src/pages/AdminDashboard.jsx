import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import { MapContainer, TileLayer, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("dashboard");

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // ================= STATE =================
  const [users, setUsers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [trips, setTrips] = useState([]);

  // ================= FETCH DATA =================
  useEffect(() => {
    fetch("http://localhost:3000/users")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.log(err));

    fetch("http://localhost:3000/drivers")
      .then(res => res.json())
      .then(data => setDrivers(data))
      .catch(err => console.log(err));

    fetch("http://localhost:3000/vehicles")
      .then(res => res.json())
      .then(data => setVehicles(data))
      .catch(err => console.log(err));

    fetch("http://localhost:3000/trips")
      .then(res => res.json())
      .then(data => setTrips(data))
      .catch(err => console.log(err));
  }, []);

  // ================= CHART DATA =================
  const fleetActivity = [
    { day: "Mon", trips: 20 },
    { day: "Tue", trips: 28 },
    { day: "Wed", trips: 18 },
    { day: "Thu", trips: 35 },
    { day: "Fri", trips: 30 },
    { day: "Sat", trips: 22 },
    { day: "Sun", trips: 40 }
  ];

  const vehicleStatus = [
    { status: "Active", count: 60 },
    { status: "Maintenance", count: 12 },
    { status: "Idle", count: 8 }
  ];

  // ================= ALERTS =================
  const [alerts, setAlerts] = useState([
    { id: 1, vehicle: "V-101", issue: "Engine overheating", severity: "CRITICAL", action: "Stop vehicle" },
    { id: 2, vehicle: "V-202", issue: "Oil level low", severity: "WARNING", action: "Refill oil" },
    { id: 3, vehicle: "V-303", issue: "Tyre pressure ok", severity: "SAFE", action: "No action" }
  ]);

  const [newAlert, setNewAlert] = useState({
    vehicle: "",
    issue: "",
    severity: "WARNING",
    action: ""
  });

  const addAlert = () => {
    if (!newAlert.vehicle || !newAlert.issue) return;
    setAlerts([{ id: Date.now(), ...newAlert }, ...alerts]);
    setNewAlert({ vehicle: "", issue: "", severity: "WARNING", action: "" });
  };

  // ================= MAINTENANCE =================
  const maintenance = [
    { id: 1, vehicle: "V-101", type: "Engine Repair", date: "2026-03-20", status: "Completed" },
    { id: 2, vehicle: "V-202", type: "Oil Change", date: "2026-03-22", status: "Pending" },
    { id: 3, vehicle: "V-303", type: "Brake Check", date: "2026-03-23", status: "Completed" }
  ];

  // ================= DOWNLOAD =================
  const downloadCSV = () => {
    const data = [
      ["Vehicle", "Status"],
      ["V-101", "Active"],
      ["V-202", "Maintenance"],
      ["V-303", "Idle"]
    ];
    const csv = data.map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "fleet_report.csv");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Fleet Report", 20, 20);
    vehicleStatus.forEach((v, i) => doc.text(`${v.status}: ${v.count}`, 20, 40 + i * 10));
    doc.save("fleet_report.pdf");
  };

  return (
    <div className="admin-container">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2 className="logo">Fleet Admin</h2>
        <ul className="menu">
          <li onClick={() => setActiveSection("dashboard")}>Dashboard</li>
          <li onClick={() => setActiveSection("users")}>Users</li>
          <li onClick={() => setActiveSection("vehicles")}>Vehicles</li>
          <li onClick={() => setActiveSection("drivers")}>Drivers</li>
          <li onClick={() => setActiveSection("trips")}>Trips</li>
          <li onClick={() => setActiveSection("reports")}>Reports</li>
          <li onClick={() => setActiveSection("heatmap")}>Urban Mobility</li>
          <li className="logout" onClick={logout}>Logout</li>
        </ul>
      </aside>

      <main className="main-content">

        {/* DASHBOARD */}
        {activeSection === "dashboard" && (
          <>
            <h1>Admin Dashboard</h1>

            <div className="cards">
              <div className="card"><h3>{users.length}</h3><p>Total Users</p></div>
              <div className="card"><h3>{vehicles.length}</h3><p>Vehicles</p></div>
              <div className="card"><h3>60</h3><p>Active Vehicles</p></div>
              <div className="card"><h3>{trips.length}</h3><p>Trips Today</p></div>
            </div>

            <div className="charts-grid">
              <div className="chart-card">
                <h3>Weekly Fleet Activity</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={fleetActivity}>
                    <CartesianGrid />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line dataKey="trips" stroke="#2563eb" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card">
                <h3>Vehicle Status</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={vehicleStatus}>
                    <CartesianGrid />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ALERTS */}
            <div className="section">
              <h2>Alerts 🔔</h2>
              <div className="alert-form">
                <input placeholder="Vehicle" value={newAlert.vehicle} onChange={e => setNewAlert({ ...newAlert, vehicle: e.target.value })} />
                <input placeholder="Issue" value={newAlert.issue} onChange={e => setNewAlert({ ...newAlert, issue: e.target.value })} />
                <select value={newAlert.severity} onChange={e => setNewAlert({ ...newAlert, severity: e.target.value })}>
                  <option>CRITICAL</option>
                  <option>WARNING</option>
                  <option>SAFE</option>
                </select>
                <input placeholder="Action" value={newAlert.action} onChange={e => setNewAlert({ ...newAlert, action: e.target.value })} />
                <button onClick={addAlert}>Add Alert</button>
              </div>

              <div className="alerts-grid">
                {alerts.map(a => (
                  <div key={a.id} className={`alert-card ${a.severity.toLowerCase()}`}>
                    <h3>{a.vehicle}</h3>
                    <p>{a.issue}</p>
                    <b>{a.severity}</b>
                    <p>{a.action}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* MAINTENANCE */}
            <div className="section">
              <h2>Maintenance 🔧</h2>
              <div className="maintenance-grid">
                {maintenance.map(m => (
                  <div key={m.id} className="maintenance-card">
                    <h3>{m.vehicle}</h3>
                    <p>{m.type}</p>
                    <p>{m.date}</p>
                    <span className={m.status.toLowerCase()}>{m.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* DOWNLOAD */}
            <div className="section">
              <h2>Download Reports 📊</h2>
              <button onClick={downloadCSV}>CSV</button>
              <button onClick={downloadPDF}>PDF</button>
            </div>
          </>
        )}

        {/* USERS */}
        {activeSection === "users" && (
          <div className="section">
            <h1>Users</h1>
            <table className="table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Role</th></tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

       {activeSection === "drivers" && (
  <div className="section">
    <h1>Drivers 👨‍✈️</h1>

    {/* SUMMARY CARDS */}
    <div className="cards">
      <div className="card">
        <h3>{drivers.length}</h3>
        <p>Total Drivers</p>
      </div>

      <div className="card">
        <h3>{drivers.filter(d => d.status === "Available").length}</h3>
        <p>Available</p>
      </div>

      <div className="card">
        <h3>{drivers.filter(d => d.status === "On Trip").length}</h3>
        <p>On Trip</p>
      </div>
    </div>

    {/* DRIVERS TABLE */}
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>License</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {drivers.length === 0 ? (
            <tr>
              <td colSpan="4">No Drivers Found</td>
            </tr>
          ) : (
            drivers.map(d => (
              <tr key={d.id}>
                <td>{d.id}</td>
                <td>{d.name}</td>
                <td>{d.license || "—"}</td>
                <td>
                  <span className={`status ${d.status?.toLowerCase().replace(" ", "")}`}>
                    {d.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
)}

    {activeSection === "vehicles" && (
  <div className="section">
    <h1>Vehicles 🚗</h1>

    {/* SUMMARY CARDS */}
    <div className="cards">
      <div className="card">
        <h3>{vehicles.length}</h3>
        <p>Total Vehicles</p>
      </div>

      <div className="card">
        <h3>{vehicles.filter(v => v.status === "Active").length}</h3>
        <p>Active</p>
      </div>

      <div className="card">
        <h3>{vehicles.filter(v => v.status === "Maintenance").length}</h3>
        <p>Maintenance</p>
      </div>
    </div>

    {/* VEHICLE TABLE */}
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {vehicles.length === 0 ? (
            <tr>
              <td colSpan="4">No Vehicles Found</td>
            </tr>
          ) : (
            vehicles.map(v => (
              <tr key={v.id}>
                <td>{v.id}</td>
                <td>{v.name}</td>
                <td>{v.type || "—"}</td>
                <td>
                  <span className={`status ${v.status?.toLowerCase()}`}>
                    {v.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
)}

        {/* TRIPS */}
        {activeSection === "trips" && (
          <div className="section">
            <h1>Trips</h1>
            <table className="table">
              <thead>
                <tr><th>Date</th><th>Amount</th></tr>
              </thead>
              <tbody>
                {trips.map(t => (
                  <tr key={t.id}>
                    <td>{t.date}</td>
                    <td>₹{t.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* REPORTS
        {activeSection === "reports" && (
          <div className="section">
            <h1>Reports</h1>
            <h3>Total Trips: {trips.length}</h3>
            <h3>Total Revenue: ₹{trips.reduce((sum, t) => sum + (t.amount || 0), 0)}</h3>
          </div>
        )} */}
        {activeSection === "reports" && (
  <div className="section">
    <h1>Reports 📊</h1>

    {/* SUMMARY CARDS */}
    <div className="cards">
      <div className="card">
        <h3>{trips.length}</h3>
        <p>Total Trips</p>
      </div>

      <div className="card">
        <h3>₹{trips.reduce((sum, t) => sum + t.amount, 0)}</h3>
        <p>Total Revenue</p>
      </div>
    </div>

    {/* BAR CHART */}
    <div className="chart-card">
      <h3>Trips Revenue Overview</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={trips}>
          <CartesianGrid />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#6366f1" />
        </BarChart>
      </ResponsiveContainer>
    </div>

    {/* LINE CHART */}
    <div className="chart-card" style={{ marginTop: "20px" }}>
      <h3>Trips Trend</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={trips}>
          <CartesianGrid />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line dataKey="amount" stroke="#10b981" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>

  </div>
)}

        {/* HEATMAP */}
        {activeSection === "heatmap" && (
          <div className="section">
            <h2>Urban Mobility Insights 🌍</h2>
            <MapContainer center={[17.385, 78.4867]} zoom={12} style={{ height: "600px" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {/* 🔴 HIGH TRAFFIC */}
<Circle
  center={[17.385, 78.4867]}
  radius={1000}
  pathOptions={{
    color: "red",
    fillColor: "red",
    fillOpacity: 0.6
  }}
/>

{/* 🟡 MEDIUM TRAFFIC */}
<Circle
  center={[17.40, 78.48]}
  radius={700}
  pathOptions={{
    color: "yellow",
    fillColor: "yellow",
    fillOpacity: 0.6
  }}
/>

{/* 🟢 LOW TRAFFIC */}
<Circle
  center={[17.37, 78.49]}
  radius={500}
  pathOptions={{
    color: "green",
    fillColor: "green",
    fillOpacity: 0.6
  }}
/>
            </MapContainer>
            
          </div>
        )}

      </main>
    </div>
  );
}

export default AdminDashboard;