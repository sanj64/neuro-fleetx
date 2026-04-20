import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Vehicles.css";

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);

  const [form, setForm] = useState({
    id: null,
    vehicleNumber: "",
    type: "",
    model: "",
    year: "",
    fuelLevel: "",
    batteryLevel: "",
    location: "",
    mileage: "",
    assignedDriver: ""
  });

  const [editing, setEditing] = useState(false);

  // Handle input changes
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Calculate vehicle status and alerts
  const calculateStatusAlert = (fuel, battery) => {
    fuel = Number(fuel);
    battery = Number(battery);

    let alerts = [];
    let status = "ACTIVE";

    if (fuel === 0) { alerts.push("Fuel Empty"); status = "IN_MAINTENANCE"; }
    else if (fuel < 20) alerts.push("Fuel Low");

    if (battery < 10) { alerts.push("Critical Battery"); status = "IN_MAINTENANCE"; }
    else if (battery < 30) { alerts.push("Battery Low"); status = "CHARGING"; }

    if (alerts.length === 0) alerts.push("No Alerts");

    return { status, alerts: alerts.join(", ") };
  };

  // Add vehicle
  const addVehicle = () => {
    const condition = calculateStatusAlert(form.fuelLevel, form.batteryLevel);
    const newVehicle = { ...form, id: Date.now(), status: condition.status, alerts: condition.alerts, lastUpdated: new Date().toLocaleString() };
    setVehicles([...vehicles, newVehicle]);
    resetForm();
  };

  // Edit vehicle
  const editVehicle = (vehicle) => { setForm(vehicle); setEditing(true); };

  // Update vehicle
  const updateVehicle = () => {
    const condition = calculateStatusAlert(form.fuelLevel, form.batteryLevel);
    const updatedVehicle = { ...form, status: condition.status, alerts: condition.alerts, lastUpdated: new Date().toLocaleString() };
    setVehicles(vehicles.map(v => v.id === form.id ? updatedVehicle : v));
    setEditing(false);
    resetForm();
  };

  // Delete vehicle
  const deleteVehicle = (id) => setVehicles(vehicles.filter(v => v.id !== id));

  // Reset form
  const resetForm = () => setForm({
    id: null,
    vehicleNumber: "",
    type: "",
    model: "",
    year: "",
    fuelLevel: "",
    batteryLevel: "",
    location: "",
    mileage: "",
    assignedDriver: ""
  });

  // Dashboard counts
  const total = vehicles.length;
  const active = vehicles.filter(v => v.status === "ACTIVE").length;
  const charging = vehicles.filter(v => v.status === "CHARGING").length;
  const maintenance = vehicles.filter(v => v.status === "IN_MAINTENANCE").length;

  return (
    <div className="admin-container">

      {/* ---------------- SIDEBAR ---------------- */}
      <aside className="sidebar">
        <h2 className="logo">Fleet Admin</h2>
        <ul className="menu">
          <li><NavLink to="/admin" className="menu-link">Dashboard</NavLink></li>
          <li><NavLink to="/admin/users" className="menu-link">Users</NavLink></li>
          <li><NavLink to="/admin/vehicles" className="menu-link active">Vehicles</NavLink></li>
          <li><NavLink to="/admin/drivers" className="menu-link">Drivers</NavLink></li>
          <li><NavLink to="/admin/reports" className="menu-link">Reports</NavLink></li>
          <li className="logout" onClick={() => { localStorage.clear(); window.location.href="/login"; }}>Logout</li>
        </ul>
      </aside>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <main className="main-content">
        <h1>Fleet Vehicles</h1>

        {/* Dashboard Cards */}
        <div className="vehicle-cards">
          <div className="card"><h3>{total}</h3><p>Total Vehicles</p></div>
          <div className="card active"><h3>{active}</h3><p>Active</p></div>
          <div className="card charging"><h3>{charging}</h3><p>Charging</p></div>
          <div className="card maintenance"><h3>{maintenance}</h3><p>Maintenance</p></div>
        </div>

        {/* Vehicle Form */}
        <div className="form-container">
          <h3>{editing ? "Update Vehicle" : "Add New Vehicle"}</h3>
          <form onSubmit={(e) => { e.preventDefault(); editing ? updateVehicle() : addVehicle(); }}>
            <input type="text" name="vehicleNumber" placeholder="Vehicle Number" value={form.vehicleNumber} onChange={handleChange} required />
            <select name="type" value={form.type} onChange={handleChange} required>
              <option value="">Select Type</option>
              <option value="Truck">Truck</option>
              <option value="Van">Van</option>
              <option value="Car">Car</option>
              <option value="Bike">Bike</option>
            </select>
            <input type="text" name="model" placeholder="Model" value={form.model} onChange={handleChange} required />
            <input type="text" name="year" placeholder="Year" value={form.year} onChange={handleChange} required />
            <input type="number" name="fuelLevel" placeholder="Fuel %" value={form.fuelLevel} onChange={handleChange} required />
            <input type="number" name="batteryLevel" placeholder="Battery %" value={form.batteryLevel} onChange={handleChange} required />
            <input type="text" name="location" placeholder="Location" value={form.location} onChange={handleChange} />
            <input type="text" name="mileage" placeholder="Mileage" value={form.mileage} onChange={handleChange} />
            <input type="text" name="assignedDriver" placeholder="Driver" value={form.assignedDriver} onChange={handleChange} />
            <button type="submit">{editing ? "Update Vehicle" : "Add Vehicle"}</button>
          </form>
        </div>

        {/* Vehicles Table */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Vehicle</th><th>Type</th><th>Model</th><th>Year</th><th>Status</th><th>Fuel</th><th>Battery</th><th>Location</th><th>Mileage</th><th>Driver</th><th>Alerts</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.length === 0 ? (
                <tr><td colSpan="12">No Vehicles Found</td></tr>
              ) : (
                vehicles.map(v => (
                  <tr key={v.id}>
                    <td>{v.vehicleNumber}</td>
                    <td>{v.type}</td>
                    <td>{v.model}</td>
                    <td>{v.year}</td>
                    <td>{v.status}</td>
                    <td>{v.fuelLevel}%</td>
                    <td>{v.batteryLevel}%</td>
                    <td>{v.location}</td>
                    <td>{v.mileage}</td>
                    <td>{v.assignedDriver}</td>
                    <td>{v.alerts}</td>
                    <td>
                      <button onClick={() => editVehicle(v)}>Edit</button>
                      <button onClick={() => deleteVehicle(v.id)}>Delete</button>
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

export default Vehicles;