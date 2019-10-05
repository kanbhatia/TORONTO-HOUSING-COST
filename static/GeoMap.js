// Change the panel title
Panel_title = "Toronto map"
d3.select(".panel-title").text(Panel_title);
console.log(Panel_title);

function getJsonData(data) {
    console.log(data)
    return data;
}

// links
var appstat = d3.json("http://localhost:5000/appstat").then(getJsonData);
var rentavg = d3.json("http://localhost:5000/rentavg").then(getJsonData);
var allrent = d3.json("http://localhost:5000/allrent").then(getJsonData);

// Creating map object
var map = L.map("map", {
    center: [40.7128, -74.0059],
    zoom: 11
  });
  
  // Adding tile layer
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: "pk.eyJ1Ijoia2FuYmhhdGlhIiwiYSI6ImNrMTNuZXpsZzAzZWszY3J0bjkxODlsMTkifQ.xnTkF-5CwkzoWs8MpjiyQA"
  }).addTo(map);
  
