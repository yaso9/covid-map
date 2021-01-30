import "../style/style.scss";

import "leaflet";
import "leaflet/dist/leaflet.css";

document.addEventListener("DOMContentLoaded", () => {
  const map = L.map("map").setView([37.09024, -95.712891], 5);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
});
