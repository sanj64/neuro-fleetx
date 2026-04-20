// src/pages/ManagerDashboard.jsx
import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie
} from "recharts";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";

import "./ManagerDashboard.css";

function ManagerDashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const [view, setView] = useState("dashboard");
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [newAlert, setNewAlert] = useState({
    vehicle: "",
    issue: "",
    severity: "WARNING",
    action: ""
  });

  const mapRef = useRef(null);

  // Sample dashboard data
  const vehicleStatusData = [
    { status: "Available", count: 20 },
    { status: "In Use", count: 12 },
    { status: "Maintenance", count: 3 }
  ];

  const weeklyTripsData = [
    { day: "Mon", trips: 5 },
    { day: "Tue", trips: 8 },
    { day: "Wed", trips: 6 },
    { day: "Thu", trips: 7 },
    { day: "Fri", trips: 9 },
    { day: "Sat", trips: 4 },
    { day: "Sun", trips: 2 }
  ];

  // Sample maintenance data
  const maintenanceMonthlyData = [
    { month: "Jan", services: 5 },
    { month: "Feb", services: 8 },
    { month: "Mar", services: 6 },
    { month: "Apr", services: 10 },
    { month: "May", services: 7 },
    { month: "Jun", services: 4 }
  ];

  const maintenanceTypeData = [
    { type: "Engine", count: 6 },
    { type: "Oil Change", count: 10 },
    { type: "Tire", count: 4 },
    { type: "Brake", count: 3 },
    { type: "Battery", count: 5 }
  ];

  const maintenanceTableData = [
    { id: 1, vehicle: "Truck A", type: "Engine", date: "2026-03-10", status: "Completed" },
    { id: 2, vehicle: "Van B", type: "Oil Change", date: "2026-03-12", status: "Pending" },
    { id: 3, vehicle: "Car C", type: "Battery", date: "2026-03-15", status: "Completed" }
  ];
const [trips, setTrips] = useState([]);
useEffect(() => {
  fetch("http://localhost:3000/trips")
    .then(res => res.json())
    .then(data => setTrips(data))
    .catch(err => console.log(err));
}, []);
  // Load vehicles and drivers
  useEffect(() => {
    const sampleVehicles = [
      {
        id: 1,
        name: "TS09AB1234",
        status: "Available",
        fuel: 80,
        battery: 90,
        source: [17.3850, 78.4867],
        destination: [17.4500, 78.3900]
      },
      {
        id: 2,
        name: "TS08CD5678",
        status: "In Use",
        fuel: 50,
        battery: 60,
        source: [17.3800, 78.4800],
        destination: [17.4550, 78.3950]
      },
      {
        id: 3,
        name: "Car C",
        status: "Maintenance",
        fuel: 20,
        battery: 10,
        source: [17.3900, 78.4850],
        destination: [17.4600, 78.4000]
      }
    ];
    setVehicles(sampleVehicles);

    const sampleDrivers = [
      { id: 1, name: "John Doe" },
      { id: 2, name: "Jane Smith" }
    ];
    setDrivers(sampleDrivers);
  }, []);
useEffect(() => {
  fetch("http://localhost:3000/maintenance")
    .then(res => res.json())
    .then(data => setMaintenance(data))
    .catch(err => console.log(err));
}, []);
  // Fetch alerts from backend
  useEffect(() => {
    fetch("http://localhost:3000/alerts")
      .then(res => res.json())
      .then(data => setAlerts(data))
      .catch(err => console.log(err));
  }, []);

  // Delete vehicle
  const deleteVehicle = (id) => {
    setVehicles(vehicles.filter(v => v.id !== id));
  };

  // Handle alert form input
  const handleChange = (e) => {
    setNewAlert({ ...newAlert, [e.target.name]: e.target.value });
  };

  // Add alert
  const addAlert = () => {
    if (!newAlert.vehicle || !newAlert.issue || !newAlert.action) {
      alert("Fill all fields");
      return;
    }
    fetch("http://localhost:3000/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newAlert, id: Date.now() })
    })
      .then(res => res.json())
      .then(data => {
        setAlerts([...alerts, data]);
        setNewAlert({ vehicle: "", issue: "", severity: "WARNING", action: "" });
      });
  };

  // Map with animated vehicles and polyline
  useEffect(() => {
    if (view === "map" && mapRef.current === null) {
      const map = L.map("map").setView([17.3850, 78.4867], 13);
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors"
      }).addTo(map);

      const markers = vehicles.map(v => {
        const route = L.polyline([v.source, v.destination], {
          color: v.status === "Available" ? "blue" : v.status === "In Use" ? "green" : "red",
          weight: 4
        }).addTo(map);

        const marker = L.circleMarker(v.source, {
          color: v.status === "Available" ? "blue" : v.status === "In Use" ? "green" : "red",
          radius: 8,
          fillOpacity: 0.8
        }).addTo(map);

        marker.bindPopup(`${v.name} (${v.status})`);
        return { marker, source: v.source, destination: v.destination, progress: 0 };
      });

      setInterval(() => {
        markers.forEach(m => {
          if (m.progress < 1) m.progress += 0.002;
          const lat = m.source[0] + (m.destination[0] - m.source[0]) * m.progress;
          const lng = m.source[1] + (m.destination[1] - m.source[1]) * m.progress;
          m.marker.setLatLng([lat, lng]);
        });
      }, 100);
    }
  }, [view, vehicles]);

  return (
    <div className="fleet-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">Fleet Manager</h2>
        <ul className="menu">
          <li onClick={() => setView("dashboard")}><NavLink to="#">Dashboard</NavLink></li>
          <li onClick={() => setView("vehicles")}><NavLink to="#">Vehicles</NavLink></li>
          <li onClick={() => setView("drivers")}><NavLink to="#">Drivers</NavLink></li>
          <li onClick={() => setView("map")}><NavLink to="#">Live Map</NavLink></li>
          <li onClick={() => setView("maintenance")}><NavLink to="#">Maintenance</NavLink></li>
          <li onClick={() => setView("alerts")}><NavLink to="#">Alerts</NavLink></li>
          <li onClick={() => setView("reports")}><NavLink to="#">Reports</NavLink></li>
          <li className="logout" onClick={logout}>Logout</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Dashboard */}
        {view === "dashboard" && (
          <>
            <h1>Fleet Manager Dashboard</h1>
            <div className="cards">
              <div className="card"><h3>{vehicles.length}</h3><p>Vehicles</p></div>
              <div className="card"><h3>{drivers.length}</h3><p>Drivers</p></div>
              <div className="card"><h3>10</h3><p>Trips</p></div>
            </div>

            <div className="charts">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={vehicleStatusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* Vehicles */}
        {view === "vehicles" && (
          <>
            <h1>Fleet Vehicles</h1>
            <table className="table">
              <thead>
                <tr><th>ID</th><th>Name</th><th>Status</th><th>Fuel</th><th>Battery</th><th>Action</th></tr>
              </thead>
              <tbody>
                {vehicles.map(v => (
                  <tr key={v.id}>
                    <td>{v.id}</td>
                    <td>{v.name}</td>
                    <td>{v.status}</td>
                    <td>{v.fuel}%</td>
                    <td>{v.battery}%</td>
                    <td><button className="delete-btn" onClick={() => deleteVehicle(v.id)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
       

{/* Drivers */}
{view === "drivers" && (
  <div>
    <h1>Drivers Management</h1>

    <table className="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        {drivers.map(d => (
          <tr key={d.id}>
            <td>{d.id}</td>
            <td>{d.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

        {/* Alerts */}
        {view === "alerts" && (
          <div>
            <h1>Vehicle Alerts</h1>
            <div className="alert-form">
              <input name="vehicle" placeholder="Vehicle No" value={newAlert.vehicle} onChange={handleChange} />
              <input name="issue" placeholder="Issue" value={newAlert.issue} onChange={handleChange} />
              <select name="severity" value={newAlert.severity} onChange={handleChange}>
                 <option value="SELECT">SELECT</option>
                <option value="CRITICAL">CRITICAL</option>
                <option value="WARNING">WARNING</option>
                <option value="SAFE">SAFE</option>
              </select>
              <input name="action" placeholder="Action" value={newAlert.action} onChange={handleChange} />
              <button onClick={addAlert}>Add</button>
            </div>

            <div className="alerts-grid">
              {alerts.map(a => (
                <div key={a.id} className={`alert-card ${a.severity === "CRITICAL" ? "critical-card" : a.severity === "WARNING" ? "warning-card" : "safe-card"}`}>
                  <h3>🚚 {a.vehicle}</h3>
                  <p>{a.issue}</p>
                  <span>{a.severity}</span>
                  <p>{a.action}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Map */}
        {view === "map" && <div id="map" style={{ height: "600px", width: "100%" }} />}

        {/* Maintenance */}
        {view === "maintenance" && (
          <div className="maintenance-container">
            <h1>Maintenance Dashboard</h1>
            <div className="charts">
              <div className="chart-card">
                <h3>Monthly Maintenance Services</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={maintenanceMonthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="services" stroke="#3b82f6" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card">
                <h3>Maintenance Types</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={maintenanceTypeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card">
                <h3>Maintenance Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Tooltip />
                    <Legend verticalAlign="bottom" />
                    <Pie
                      data={maintenanceTypeData}
                      dataKey="count"
                      nameKey="type"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#facc15"
                      label
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="table-container">
              <h3>Maintenance Records</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Vehicle</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {maintenanceTableData.map(m => (
                    <tr key={m.id}>
                      <td>{m.id}</td>
                      <td>{m.vehicle}</td>
                      <td>{m.type}</td>
                      <td>{m.date}</td>
                      <td className={m.status === "Completed" ? "completed" : "pending"}>{m.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          
        )}
        {view === "reports" && (
          <div>
            <h1>Reports</h1>

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

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trips}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>

            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Distance</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {trips.map(t => (
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td>{t.date}</td>
                    <td>{t.status}</td>
                    <td>{t.distance}</td>
                    <td>₹{t.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {view === "map" && <div id="map" style={{ height: "600px" }} />}

      </main>
    </div>
    
  );
}
     
export default ManagerDashboard;