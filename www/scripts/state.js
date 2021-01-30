import map from "./map";

export default {
  showDeaths: false,
  init() {
    map.createMap();

    this.showCasesEl = document.getElementById("showCases");
    this.showDeathsEl = document.getElementById("showDeaths");

    const showDeathsChange = (el) => {
      this.showDeaths = !this.showDeaths;
      map.updateMap();
    };
    this.showCasesEl.addEventListener("change", showDeathsChange);
    this.showDeathsEl.addEventListener("change", showDeathsChange);

    this.showCasesEl.checked = true;
  },
};
