import "leaflet";
import "leaflet.vectorgrid";
import "leaflet/dist/leaflet.css";

import axios from "axios";
import { DateTime } from "luxon";

import "../style/style.scss";
import countyData from "./countyBoundaries.json";

document.addEventListener("DOMContentLoaded", () => {
  const map = L.map("map").setView([37.09024, -95.712891], 5);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  (async () => {
    const cases = await getCases(DateTime.local().minus({ days: 1 }));

    // Add the case data to the GeoJSON
    let maxConfirmed = 0;
    for (const feature of countyData.features) {
      const { confirmed, deaths } = cases[
        parseInt(feature.properties.GEO_ID.split("US")[1])
      ] || {
        confirmed: 0,
        deaths: 0,
      };

      if (!cases[parseInt(feature.properties.GEO_ID.split("US")[1])])
        console.log(feature);

      feature.properties.CONFIRMED = confirmed;
      feature.properties.DEATHS = deaths;

      if (confirmed > maxConfirmed) maxConfirmed = confirmed;
    }
    console.log(maxConfirmed);

    const colors = [
      "#fff5f0",
      "#fee0d2",
      "#fcbba1",
      "#fc9272",
      "#fb6a4a",
      "#ef3b2c",
      "#cb181d",
      "#99000d",
    ].reverse();
    function getColor(pop) {
      return pop > 100000
        ? colors[7]
        : pop > 50000
        ? colors[6]
        : pop > 10000
        ? colors[5]
        : pop > 5000
        ? colors[4]
        : pop > 1000
        ? colors[3]
        : pop > 500
        ? colors[2]
        : pop > 100
        ? colors[1]
        : colors[0];
    }

    L.vectorGrid
      .slicer(countyData, {
        vectorTileLayerStyles: {
          sliced: (properties) => {
            return {
              stroke: false,
              fillColor: getColor(properties.CONFIRMED),
              fillOpacity: 1,
              fill: true,
            };
          },
        },
      })
      .addTo(map);
  })();
});

async function getCases(date) {
  const API_URL = "https://covid-api.com/api/reports?iso=USA";

  const counties = {};
  const data = (await axios.get(`${API_URL}&date=${date.toFormat("y-LL-dd")}`))
    .data.data;
  for (const { region } of data) {
    for (const county of region.cities) {
      counties[county.fips] = {
        confirmed: county.confirmed,
        deaths: county.deaths,
      };
    }
  }
  return counties;
}
