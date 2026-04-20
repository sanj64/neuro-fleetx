import { useEffect, useState } from "react";
import "./ManageCustomers.css";

function ManageCustomers() {
  const [customers, setCustomers] = useState([]);

  // Dummy data fetch simulation
  useEffect(() => {
    const dummyData = [
      { id: 1, name: "James Brown", email: "james@customer.com", phone: "9876543210", address: "123 Main St" },
      { id: 2, name: "Emily White", email: "emily@customer.com", phone: "9876543211", address: "456 Oak St" },
      { id: 3, name: "Michael Green", email: "michael@customer.com", phone: "9876543212", address: "789 Pine St" },
    ];
    setCustomers(dummyData);
  }, []);

  return (
    <div className="customers-page">
      <h2>Manage Customers</h2>

      <table className="customers-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.phone}</td>
              <td>{customer.address}</td>
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

export default ManageCustomers;