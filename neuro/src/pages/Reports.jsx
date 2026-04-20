import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import "./Reports.css";

function Reports() {
  const [tripData, setTripData] = useState([]);
  const [vehicleStatusData, setVehicleStatusData] = useState([]);

  useEffect(() => {
    setTripData([
      { day: "Mon", trips: 12 },
      { day: "Tue", trips: 18 },
      { day: "Wed", trips: 9 },
      { day: "Thu", trips: 14 },
      { day: "Fri", trips: 20 },
      { day: "Sat", trips: 8 },
      { day: "Sun", trips: 16 },
    ]);

    setVehicleStatusData([
      { status: "Active", value: 65 },
      { status: "Maintenance", value: 10 },
      { status: "Idle", value: 15 },
      { status: "Charging", value: 10 },
    ]);
  }, []);

  const COLORS = ["#16a34a", "#f97316", "#64748b", "#3b82f6"];

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
          <li><NavLink to="/admin/reports" className="menu-link active">Reports</NavLink></li>
          <li className="logout" onClick={() => { localStorage.clear(); window.location.href="/login"; }}>Logout</li>
        </ul>
      </aside>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <main className="main-content">
        <h1>Reports Dashboard</h1>

        {/* ---------------- CARDS ---------------- */}
        <div className="dashboard-cards">
          <div className="card">
            <h3>450</h3>
            <p>Total Trips</p>
          </div>
          <div className="card">
            <h3>80</h3>
            <p>Total Vehicles</p>
          </div>
          <div className="card">
            <h3>120</h3>
            <p>Total Drivers</p>
          </div>
          <div className="card">
            <h3>35</h3>
            <p>Total Managers</p>
          </div>
        </div>

        {/* ---------------- CHARTS ---------------- */}
        <div className="charts-container">

          {/* Bar Chart */}
          <div className="chart-box">
            <h3>Trips per Day</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={tripData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="trips" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="chart-box">
            <h3>Vehicle Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={vehicleStatusData} dataKey="value" nameKey="status" cx="50%" cy="50%" outerRadius={100} label>
                  {vehicleStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Reports;