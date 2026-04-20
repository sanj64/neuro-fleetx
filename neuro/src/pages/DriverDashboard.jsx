import { useState, useEffect, useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./DriverDashboard.css";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, PieChart, Pie, LineChart, Line, Legend
} from "recharts";

function DriverDashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const [view, setView] = useState("dashboard");

  const [alerts, setAlerts] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [trips, setTrips] = useState([]);

  // ALERT UI
  const [filter, setFilter] = useState("ALL");
  const [showForm, setShowForm] = useState(false);
  const [newAlert, setNewAlert] = useState({
    vehicle: "",
    issue: "",
    severity: "WARNING",
    action: ""
  });

  // FETCH DATA
  useEffect(() => {
    const load = async () => {
      try {
        setAlerts(await (await fetch("http://localhost:3000/alerts")).json());
        setMaintenance(await (await fetch("http://localhost:3000/maintenance")).json());
        setTrips(await (await fetch("http://localhost:3000/trips")).json());
      } catch (e) {
        console.log("API error:", e);
      }
    };
    load();
  }, []);

  // FILTER ALERTS
  const filteredAlerts =
    filter === "ALL"
      ? alerts
      : alerts.filter(a => a.severity === filter);

  // ADD ALERT
  const addAlert = () => {
    if (!newAlert.vehicle || !newAlert.issue) return;

    setAlerts([{ id: Date.now(), ...newAlert }, ...alerts]);

    setNewAlert({
      vehicle: "",
      issue: "",
      severity: "WARNING",
      action: ""
    });

    setShowForm(false);
  };

  // ANALYTICS
  const weeklyTrips = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((d, i) => ({
      name: d,
      trips: trips.filter((_, idx) => idx % 7 === i).length
    }));
  }, [trips]);

  const tripStatus = useMemo(() => [
    { name: "Completed", value: trips.filter(t => t.status === "Completed").length },
    { name: "Pending", value: trips.length - trips.filter(t => t.status === "Completed").length }
  ], [trips]);

  const alertData = useMemo(() => [
    { name: "CRITICAL", value: alerts.filter(a => a.severity === "CRITICAL").length },
    { name: "WARNING", value: alerts.filter(a => a.severity === "WARNING").length },
    { name: "SAFE", value: alerts.filter(a => a.severity === "SAFE").length }
  ], [alerts]);

  const maintenanceData = useMemo(() => [
    { name: "Completed", value: maintenance.filter(m => m.status === "Completed").length },
    { name: "Pending", value: maintenance.filter(m => m.status === "Pending").length }
  ], [maintenance]);

  return (
    <div className="dashboard-wrapper">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2 className="logo">Driver Panel</h2>

        <ul className="menu">
          <li onClick={() => setView("dashboard")}><NavLink to="#">Dashboard</NavLink></li>
          <li onClick={() => setView("trips")}><NavLink to="#">Trips</NavLink></li>

          <li onClick={() => setView("alerts")} className="notif-item">
            <NavLink to="#">Alerts</NavLink>
            {alerts.length > 0 && <span className="badge">{alerts.length}</span>}
          </li>

          <li onClick={() => setView("reports")}><NavLink to="#">Maintenance</NavLink></li>
          <li className="logout" onClick={logout}>Logout</li>
        </ul>
      </aside>

      {/* MAIN */}
      <main className="main-content">

        {/* DASHBOARD */}
        {view === "dashboard" && (
          <>
            <h1>Driver Dashboard</h1>

            <div className="cards">
              <div className="card"><h3>{trips.length}</h3><p>Trips</p></div>
              <div className="card"><h3>{alerts.length}</h3><p>Alerts</p></div>
              <div className="card"><h3>{maintenance.length}</h3><p>Maintenance</p></div>
              <div className="card"><h3>{tripStatus[0]?.value}</h3><p>Completed</p></div>
            </div>
          </>
        )}

        {/* TRIPS */}
        {view === "trips" && (
          <>
            <h1>Trips</h1>

            <table className="table">
              <thead>
                <tr>
                  <th>ID</th><th>Date</th><th>Status</th><th>Distance</th><th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {trips.map(t => (
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td>{t.date}</td>
                    <td className={t.status === "Completed" ? "completed" : "pending"}>
                      {t.status}
                    </td>
                    <td>{t.distance}</td>
                    <td>₹{t.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* ALERTS */}
        {view === "alerts" && (
          <>
            <div className="alerts-header">
              <h1>Alerts 🔔</h1>

              <div className="filter-buttons">
                <button onClick={() => setFilter("ALL")}>All</button>
                <button onClick={() => setFilter("CRITICAL")}>Critical</button>
                <button onClick={() => setFilter("WARNING")}>Warning</button>
                <button onClick={() => setFilter("SAFE")}>Safe</button>
              </div>

              <button className="add-btn" onClick={() => setShowForm(!showForm)}>
                + Add Alert
              </button>
            </div>

            {showForm && (
              <div className="alert-form">
                <input placeholder="Vehicle"
                  value={newAlert.vehicle}
                  onChange={(e) => setNewAlert({ ...newAlert, vehicle: e.target.value })}
                />

                <input placeholder="Issue"
                  value={newAlert.issue}
                  onChange={(e) => setNewAlert({ ...newAlert, issue: e.target.value })}
                />

                <select
                  value={newAlert.severity}
                  onChange={(e) => setNewAlert({ ...newAlert, severity: e.target.value })}
                >
                  <option>SELECT</option>
                  <option>CRITICAL</option>
                  <option>WARNING</option>
                  <option>SAFE</option>
                </select>

                <input placeholder="Action"
                  value={newAlert.action}
                  onChange={(e) => setNewAlert({ ...newAlert, action: e.target.value })}
                />

                <button onClick={addAlert}>Save Alert</button>
              </div>
            )}

            <div className="alerts-grid">
              {filteredAlerts.map(a => (
                <div key={a.id} className={`alert-card ${a.severity.toLowerCase()}`}>
                  <h3>{a.vehicle}</h3>
                  <p>{a.issue}</p>
                  <b>{a.severity}</b>
                  <p>{a.action}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* REPORTS */}
        {view === "reports" && (
          <>
            <h1>Maintenance</h1>

            <div className="charts-grid">

              <div className="chart-card">
                <h3>Weekly Trips</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={weeklyTrips}>
                    <CartesianGrid />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="trips" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card">
                <h3>Trip Status</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={tripStatus} dataKey="value" nameKey="name" label />
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card">
                <h3>Alerts</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={alertData}>
                    <CartesianGrid />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card">
                <h3>Maintenance</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={maintenanceData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line dataKey="value" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

            </div>

            <h2 style={{ marginTop: "30px" }}>Maintenance Records</h2>

            <div className="maintenance-grid">
              {maintenance.map(m => (
                <div key={m.id} className="maintenance-card">
                  <h3>{m.vehicle}</h3>
                  <p>{m.type}</p>
                  <p>{m.date}</p>
                  <span className={m.status}>{m.status}</span>
                </div>
              ))}
            </div>
          </>
        )}

      </main>
    </div>
  );
}

export default DriverDashboard;