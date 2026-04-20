import { useEffect, useState } from "react";
import "./ManageManagers.css";

function ManageManagers() {
  const [managers, setManagers] = useState([]);

  // Dummy data fetch simulation
  useEffect(() => {
    const dummyData = [
      { id: 1, name: "John Doe", email: "john@fleet.com", company: "FleetX", phone: "9876543210" },
      { id: 2, name: "Alice Smith", email: "alice@fleet.com", company: "SpeedyTrans", phone: "9876543211" },
      { id: 3, name: "Bob Johnson", email: "bob@fleet.com", company: "UrbanMove", phone: "9876543212" },
    ];
    setManagers(dummyData);
  }, []);

  return (
    <div className="managers-page">
      <h2>Manage Fleet Managers</h2>

      <table className="managers-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Company</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {managers.map(manager => (
            <tr key={manager.id}>
              <td>{manager.id}</td>
              <td>{manager.name}</td>
              <td>{manager.email}</td>
              <td>{manager.company}</td>
              <td>{manager.phone}</td>
              <td>
                <button className="edit-btn">Edit</button>
                <button className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageManagers;