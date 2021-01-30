import axios from "axios";

export default async (date) => {
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
};
