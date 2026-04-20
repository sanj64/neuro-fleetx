import { useEffect, useState } from "react";
import "./Alerts.css";

function Alerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/alerts")
      .then(res => res.json())
      .then(data => {
        console.log("API DATA:", data);
        setAlerts(data);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="alerts-container">

      <h2 className="title">🚨 Vehicle Alerts</h2>

      <div className="alerts-grid">

        {alerts.map(alert => (
          <div
            key={alert.id}
            className={`alert-card 
              ${alert.severity === "CRITICAL"
                ? "critical-card"
                : alert.severity === "WARNING"
                ? "warning-card"
                : "safe-card"}`}
          >

            <div className="alert-header">
              <h3>🚚 {alert.vehicle}</h3>

              <span className={`badge 
                ${alert.severity === "CRITICAL"
                  ? "critical"
                  : alert.severity === "WARNING"
                  ? "warning"
                  : "safe"}`}>
                {alert.severity}
              </span>
            </div>

            <p className="issue">{alert.issue}</p>
            <p className="action">{alert.action}</p>

          </div>
        ))}

      </div>

    </div>
  );
}

export default Alerts;