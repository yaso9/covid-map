import "leaflet";
import "leaflet.vectorgrid";
import "leaflet/dist/leaflet.css";

import state from "./state";
import queryCaseData from "./queryCaseData";
import countyBoundaries from "./countyBoundaries.json";

const colors = [
  "#fff5f0",
  "#fee0d2",
  "#fcbba1",
  "#fc9272",
  "#fb6a4a",
  "#ef3b2c",
  "#cb181d",
  "#99000d",
];

export default {
  getThresholds() {
    if (state.showDeaths) return [10000, 5000, 1000, 500, 100, 50, 10];
    else return [100000, 50000, 10000, 5000, 1000, 500, 100];
  },
  getColor(pop) {
    const thresholds = this.getThresholds();

    return pop >= thresholds[0]
      ? colors[7]
      : pop >= thresholds[1]
      ? colors[6]
      : pop >= thresholds[2]
      ? colors[5]
      : pop >= thresholds[3]
      ? colors[4]
      : pop >= thresholds[4]
      ? colors[3]
      : pop >= thresholds[5]
      ? colors[2]
      : pop >= thresholds[6]
      ? colors[1]
      : colors[0];
  },
  calculateStyle(properties) {
    return {
      stroke: false,
      fillColor: this.getColor(
        state.showDeaths ? properties.DEATHS : properties.CONFIRMED
      ),
      fillOpacity: 1,
      fill: true,
    };
  },
  createMap() {
    this.map = L.map("map").setView([37.09024, -95.712891], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    this.mapScale = document.getElementById("mapScale");
    this.updateScale();
    this.updateData();
  },
  async updateData() {
    const cases = await queryCaseData(state.date);

    // Add the case data to the GeoJSON
    for (const feature of countyBoundaries.features) {
      const fips = parseInt(feature.properties.GEO_ID.split("US")[1]);
      const { confirmed, deaths } = cases[fips] || {
        confirmed: 0,
        deaths: 0,
      };

      feature.properties.CONFIRMED = confirmed;
      feature.properties.DEATHS = deaths;
      feature.properties.FIPS = fips;
    }

    if (this.vectorGrid) this.map.removeLayer(this.vectorGrid);
    this.vectorGrid = L.vectorGrid
      .slicer(countyBoundaries, {
        interactive: true,
        vectorTileLayerStyles: {
          sliced: this.calculateStyle.bind(this),
        },
        getFeatureId: (feat) => feat.properties.FIPS,
      })
      .on("click", (e) => {
        L.popup()
          .setContent(
            `
    <b>County: </b>${e.sourceTarget.properties.NAME}<br/>
    <b>Confirmed Cases: </b>${e.sourceTarget.properties.CONFIRMED}<br/>
    <b>Deaths: </b>${e.sourceTarget.properties.DEATHS}
    `
          )
          .setLatLng(e.latlng)
          .openOn(this.map);
      })
      .addTo(this.map);
  },
  updateMap() {
    for (const feature of countyBoundaries.features) {
      this.vectorGrid.setFeatureStyle(
        feature.properties.FIPS,
        this.calculateStyle.bind(this)
      );
    }
    this.updateScale();
  },
  updateScale() {
    this.mapScale.innerHTML = "";
    this.thresholds = [...this.getThresholds(), 0].reverse();

    for (const idx in colors) {
      const singleScaleEl = document.createElement("div");
      singleScaleEl.className = "singleScale";

      const numberEl = document.createElement("div");
      numberEl.className = "number";
      numberEl.innerText = this.thresholds[idx] || 0;
      singleScaleEl.appendChild(numberEl);

      const colorSwatchEl = document.createElement("div");
      colorSwatchEl.className = "color";
      colorSwatchEl.style.backgroundColor = colors[idx];
      singleScaleEl.appendChild(colorSwatchEl);

      this.mapScale.appendChild(singleScaleEl);
    }
  },
};
