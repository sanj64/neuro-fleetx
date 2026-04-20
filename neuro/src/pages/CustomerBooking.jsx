import { useEffect, useState } from "react";
import "./CustomerBooking.css";

function CustomerBooking() {

  const [active, setActive] = useState("booking");

  // DATA STATES
  const [vehicles, setVehicles] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [trips, setTrips] = useState([]);

  const [selected, setSelected] = useState(null);

  const [filters, setFilters] = useState({
    type: "",
    fuel: "",
    seats: ""
  });

  const [booking, setBooking] = useState({
    date: "",
    slot: ""
  });

  // FETCH ALL DATA
  useEffect(() => {
    fetch("http://localhost:3000/vehicles")
      .then(res => res.json())
      .then(data => {
        const withAI = data.map(v => ({
          ...v,
          score: Math.floor(Math.random() * 30) + 70
        }));
        setVehicles(withAI);
        setFiltered(withAI);
      });

    fetch("http://localhost:3000/alerts")
      .then(res => res.json())
      .then(data => setAlerts(data));

    fetch("http://localhost:3000/trips")
      .then(res => res.json())
      .then(data => setTrips(data));

  }, []);

  // FILTER
  const applyFilter = () => {
    let result = vehicles.filter(v =>
      (filters.type === "" || v.type === filters.type) &&
      (filters.fuel === "" || v.fuel === filters.fuel) &&
      (filters.seats === "" || v.seats == filters.seats)
    );
    setFiltered(result);
  };

  // AI RECOMMENDED
  const recommended = [...vehicles]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  // BOOKING
  const confirmBooking = () => {
    if (!booking.date || !booking.slot) {
      alert("Select date & slot");
      return;
    }

    alert(`✅ Booked ${selected.name}`);
    setSelected(null);
  };

  return (
    <div className="dashboard">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>🚗 Customer</h2>

        <ul>
          <li onClick={() => setActive("booking")}>📅 Booking</li>
          <li onClick={() => setActive("alerts")}>⚠ Alerts</li>
          <li onClick={() => setActive("trips")}>🧾 Trips</li>
        </ul>
      </div>

      {/* MAIN */}
      <div className="main">

        {/* ================= BOOKING ================= */}
        {active === "booking" && (
          <div>

            <h1>🚀 Smart Booking</h1>

            {/* FILTER */}
            <div className="filter-bar">
              <select onChange={(e)=>setFilters({...filters,type:e.target.value})}>
                <option value="">Type</option>
                <option>Car</option>
                <option>Truck</option>
                <option>Van</option>
              </select>

              <select onChange={(e)=>setFilters({...filters,fuel:e.target.value})}>
                <option value="">Fuel</option>
                <option>EV</option>
                <option>Petrol</option>
                <option>Diesel</option>
              </select>

              <select onChange={(e)=>setFilters({...filters,seats:e.target.value})}>
                <option value="">Seats</option>
                <option>2</option>
                <option>4</option>
                <option>6</option>
              </select>

              <button onClick={applyFilter}>Apply</button>
            </div>

            {/* AI */}
            <h2>🤖 Recommended</h2>
            <div className="grid">
              {recommended.map(v => (
                <div className="card ai" key={v.id}>
                  <h3>{v.name}</h3>
                  <p>{v.type} • {v.seats} seats</p>

                  <div className="progress">
                    <div style={{width: `${v.score}%`}}></div>
                  </div>

                  <button onClick={()=>setSelected(v)}>Book</button>
                </div>
              ))}
            </div>

            {/* ALL */}
            <h2>All Vehicles</h2>
            <div className="grid">
              {filtered.map(v => (
                <div className="card" key={v.id}>
                  <h3>{v.name}</h3>
                  <p>{v.type} • {v.seats}</p>
                  <p>{v.fuel}</p>
                  <button onClick={()=>setSelected(v)}>Book</button>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ================= ALERTS ================= */}
        {active === "alerts" && (
          <div>
            <h2>⚠ Alerts</h2>

            <div className="grid">
              {alerts.map(a => (
                <div className="card" key={a.id}>
                  <h4>{a.vehicle}</h4>
                  <p>{a.issue}</p>
                  <p className={a.severity === "CRITICAL" ? "red" : "yellow"}>
                    {a.severity}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TRIPS ================= */}
        {active === "trips" && (
          <div>
            <h2>🧾 Trips</h2>

            <div className="grid">
              {trips.map(t => (
                <div className="card" key={t.id}>
                  <p>Date: {t.date}</p>
                  <p>Distance: {t.distance} km</p>
                  <p>₹ {t.amount}</p>
                  <p>{t.status}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* SIDE PANEL BOOKING */}
      {selected && (
        <div className="side-panel">
          <h3>{selected.name}</h3>

          <input type="date"
            onChange={(e)=>setBooking({...booking,date:e.target.value})}
          />

          <select onChange={(e)=>setBooking({...booking,slot:e.target.value})}>
            <option>Select Slot</option>
            <option>Morning</option>
            <option>Afternoon</option>
            <option>Evening</option>
          </select>

          <button onClick={confirmBooking}>Confirm</button>
          <button className="cancel" onClick={()=>setSelected(null)}>Cancel</button>
        </div>
      )}

    </div>
  );
}

export default CustomerBooking;