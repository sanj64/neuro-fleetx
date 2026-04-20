import { useEffect, useState } from "react";
import "./Vehicles.css";

function FleetVehicles() {
  const [vehicles, setVehicles] = useState([]);

  // Sample data (replace with API fetch later)
  useEffect(() => {
    const sampleVehicles = [
      { id: 1, name: "Truck A", status: "Available", fuel: 80, battery: 90 },
      { id: 2, name: "Van B", status: "In Use", fuel: 50, battery: 60 },
      { id: 3, name: "Car C", status: "Maintenance", fuel: 20, battery: 10 },
    ];
    setVehicles(sampleVehicles);
  }, []);

  return (
    <div className="vehicles-container">
      <h1>Fleet Vehicles</h1>

      <table className="vehicles-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Vehicle Name</th>
            <th>Status</th>
            <th>Fuel (%)</th>
            <th>Battery (%)</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((v) => (
            <tr key={v.id}>
              <td>{v.id}</td>
              <td>{v.name}</td>
              <td className={v.status.toLowerCase().replace(" ", "-")}>{v.status}</td>
              <td>{v.fuel}</td>
              <td>{v.battery}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FleetVehicles;