import "leaflet";
import "leaflet.vectorgrid";
import "leaflet/dist/leaflet.css";

import { DateTime } from "luxon";

import queryCaseData from "./queryCaseData";
import countyBoundaries from "./countyBoundaries.json";

export default () => {
  const map = L.map("map").setView([37.09024, -95.712891], 5);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  (async () => {
    const cases = await queryCaseData(DateTime.local().minus({ days: 1 }));

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

    const vectorgrid = L.vectorGrid
      .slicer(countyBoundaries, {
        interactive: true,
        vectorTileLayerStyles: {
          sliced: (properties) => ({
            stroke: false,
            fillColor: getColor(properties.CONFIRMED),
            fillOpacity: 1,
            fill: true,
          }),
        },
        getFeatureId: (feat) => feat.properties.FIPS,
      })
      .on("click", (e) => {
        console.log(e);
        L.popup()
          .setContent(
            `
      <b>County: </b>${e.sourceTarget.properties.NAME}<br/>
      <b>Confirmed Cases: </b>${e.sourceTarget.properties.CONFIRMED}<br/>
      <b>Deaths: </b>${e.sourceTarget.properties.DEATHS}
      `
          )
          .setLatLng(e.latlng)
          .openOn(map);
      })
      .addTo(map);
  })();

  return map;
};
