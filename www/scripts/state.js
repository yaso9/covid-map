import datepicker from "js-datepicker";
import "js-datepicker/src/datepicker.scss";

import { DateTime } from "luxon";

import map from "./map";

export default {
  showDeaths: false,
  init() {
    this.showCasesEl = document.getElementById("showCases");
    this.showDeathsEl = document.getElementById("showDeaths");

    const showDeathsChange = (el) => {
      this.showDeaths = !this.showDeaths;
      map.updateMap();
    };
    this.showCasesEl.addEventListener("change", showDeathsChange);
    this.showDeathsEl.addEventListener("change", showDeathsChange);

    this.showCasesEl.checked = true;

    this.date = DateTime.local().minus({ days: 1 });
    this.datePicker = datepicker("#datePicker", {
      maxDate: new Date(this.date.toISO()),
      dateSelected: new Date(this.date.toISO()),
      onSelect: (instance, date) => {
        if (date) {
          this.date = DateTime.fromISO(date.toISOString());
          map.updateData();
        } else {
          instance.setDate(new Date(this.date.toISO()));
        }
      },
    });

    map.createMap();
  },
};