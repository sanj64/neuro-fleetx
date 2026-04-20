import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./AdminUsers.css";

function AdminUsers() {

  const navigate = useNavigate();

  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: ""
  });

  /* ---------------- LOGOUT ---------------- */

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  /* ---------------- FETCH USERS ---------------- */

  const fetchUsers = async () => {
    try {

      const res = await fetch("http://localhost:8080/api/users");

      const data = await res.json();

      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setUsers([]);
      }

    } catch (error) {
      console.log("Fetch Error:", error);
    }
  };

  /* ---------------- LOAD USERS ---------------- */

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ---------------- FORM INPUT ---------------- */

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  /* ---------------- ADD USER ---------------- */

  const addUser = async (e) => {

    e.preventDefault();

    try {

      await fetch("http://localhost:8080/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      // refresh users
      fetchUsers();

      setFormData({
        name: "",
        email: "",
        role: ""
      });

    } catch (error) {
      console.log("Add Error:", error);
    }

  };

  /* ---------------- DELETE USER ---------------- */

  const deleteUser = async (id) => {

    try {

      await fetch(`http://localhost:8080/api/users/${id}`, {
        method: "DELETE"
      });

      // refresh users
      fetchUsers();

    } catch (error) {
      console.log("Delete Error:", error);
    }

  };

  return (

    <div className="admin-container">

      {/* ---------------- SIDEBAR ---------------- */}

      <aside className="sidebar">

        <h2 className="logo">Fleet Admin</h2>

        <ul className="menu">

          <li>
            <NavLink to="/admin" className="menu-link">
              Dashboard
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/users" className="menu-link">
              User Management
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/vehicles" className="menu-link">
              Vehicles
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/drivers" className="menu-link">
              Drivers
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/managers" className="menu-link">
              Managers
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/customers" className="menu-link">
              Customers
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/reports" className="menu-link">
              Reports
            </NavLink>
          </li>

          <li className="logout" onClick={logout}>
            Logout
          </li>

        </ul>

      </aside>

      {/* ---------------- MAIN CONTENT ---------------- */}

      <main className="main-content">

        <h1>User Management</h1>

        {/* ---------------- ADD USER FORM ---------------- */}

        <div className="form-container">

          <h3>Add New User</h3>

          <form onSubmit={addUser}>

            <input
              type="text"
              name="name"
              placeholder="Enter Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >

              <option value="">Select Role</option>
              <option value="Driver">Driver</option>
              <option value="Manager">Manager</option>
              <option value="Customer">Customer</option>

            </select>

            <button type="submit" className="add-btn">
              Add User
            </button>

          </form>

        </div>

        {/* ---------------- USERS TABLE ---------------- */}

        <div className="table-container">

          <table>

            <thead>

              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {users.length === 0 ? (

                <tr>
                  <td colSpan="5">No Users Found</td>
                </tr>

              ) : (

                users.map((user) => (

                  <tr key={user.id}>

                    <td>{user.id}</td>

                    <td>{user.name}</td>

                    <td>{user.email}</td>

                    <td>{user.role}</td>

                    <td>

                      <button
                        className="delete-btn"
                        onClick={() => deleteUser(user.id)}
                      >
                        Delete
                      </button>

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

export default AdminUsers;