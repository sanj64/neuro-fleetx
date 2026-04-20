import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "./MapPage.css";

function MapPage() {
  useEffect(() => {
    const mapContainer = document.getElementById("map");
    if (!mapContainer._leaflet_id) { // prevent "already initialized" error
      const map = L.map("map").setView([17.385, 78.4867], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      L.Routing.control({
        waypoints: [
          L.latLng(17.385, 78.4867),
          L.latLng(17.450, 78.3900)
        ],
        routeWhileDragging: true
      }).addTo(map);
    }
  }, []);

  return <div id="map" style={{ height: "600px", width: "100%" }} />;
}

export default MapPage;