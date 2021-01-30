import "../style/style.scss";
import axios from 'axios';
import "leaflet";
import "leaflet/dist/leaflet.css";

document.addEventListener("DOMContentLoaded", () => {
  const map = L.map("map").setView([37.09024, -95.712891], 5);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
});

getCases("06/30/2019")
function getCases(date){
    var today = new Date();
    // Source: https://stackoverflow.com/questions/1531093/how-do-i-get-the-current-date-in-javascript
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = new Date(mm + '/' + dd + '/' + yyyy);
    console.log(today);
    // source: https://www.geeksforgeeks.org/how-to-calculate-the-number-of-days-between-two-dates-in-javascript/
    var date1 = new Date(date); 

    var Difference_In_Time = today.getTime() - date1.getTime(); 
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24); 
    console.log(Difference_In_Days);


    axios.get("https://disease.sh/v3/covid-19/nyt/states/Alabama%2C%20Alaska%2C%20American%20Samoa%2C%20Arizona%2C%20Arkansas%2C%20California%2C%20Colorado%2C%20Connecticut%2C%20Delaware%2C%20District%20of%20Columbia%2C%20Florida%2C%20Georgia%2C%20Guam%2C%20Hawaii%2C%20Idaho%2C%20Illinois%2C%20Indiana%2C%20Iowa%2C%20Kansas%2C%20Kentucky%2C%20Louisiana%2C%20Maine%2C%20Maryland%2C%20Massachusetts%2C%20Michigan%2C%20Minnesota%2C%20Minor%20Outlying%20Islands%2C%20Mississippi%2C%20Missouri%2C%20Montana%2C%20Nebraska%2C%20Nevada%2C%20New%20Hampshire%2C%20New%20Jersey%2C%20New%20Mexico%2C%20New%20York%2C%20North%20Carolina%2C%20North%20Dakota%2C%20Northern%20Mariana%20Islands%2C%20Ohio%2C%20Oklahoma%2C%20Oregon%2C%20Pennsylvania%2C%20Puerto%20Rico%2C%20Rhode%20Island%2C%20South%20Carolina%2C%20South%20Dakota%2C%20Tennessee%2C%20Texas%2C%20U.S.%20Virgin%20Islands%2C%20Utah%2C%20Vermont%2C%20Virginia%2C%20Washington%2C%20West%20Virginia%2C%20Wisconsin%2C%20Wyoming?lastdays=0")
.then(response =>{
    for(let states in response)
    {
        console.log(response.data);
    }
    
})

}


