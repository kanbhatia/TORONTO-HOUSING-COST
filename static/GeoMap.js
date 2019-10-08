// Change the panel title
Panel_title = "Toronto map"
d3.select(".panel-title").text(Panel_title);
console.log(Panel_title);

function getJsonData(data) {
  data.Year = Object.entries(data.Year).map(([key, value]) => (value));
  data.Neighbourhood = Object.entries(data.Neighbourhood).map(([key, value]) => (value));
  data.Total = Object.entries(data.Total).map(([key, value]) =>{
    if (value === "**"){
      return 1;
    }
    else{
      return (value)
    }
  });
  data.Whole_Toronto_AV = Object.entries(data.Whole_Toronto_AV).map(([key, value]) => (value));

  map_data = [data.Year,data.Neighbourhood,data.Total,data.Whole_Toronto_AV]
  return map_data;
}

// links
// var appstat = d3.json("http://localhost:5000/appstat").then(getJsonData);
// var rentavg = d3.json("http://localhost:5000/rentavg").then(getJsonData);
var allrent = d3.json("http://localhost:5000/allrent").then(getJsonData);

// Creating map object
var map = L.map("map", {
  center: [43.723734, -79.381762],
  zoom: 11
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: "pk.eyJ1Ijoia2FuYmhhdGlhIiwiYSI6ImNrMTNuZXpsZzAzZWszY3J0bjkxODlsMTkifQ.xnTkF-5CwkzoWs8MpjiyQA"
}).addTo(map);

// Getting Geojson data
var link_GeoJson = "./static/Data/Neighbourhoods.geojson"

function chooseColor(name) {
  New_name = name.split(" (")[0]
  
    switch (New_name) {
    case "New Toronto":
      return "yellow";
    case "Bronx":
      return "red";
    case "Manhattan":
      return "orange";
    case "Queens":
      return "green";
    case "Staten Island":
      return "purple";
    default:
      return "black";
    }
}

d3.json(link_GeoJson).then(data => {
  var GeoJsonData = data;
  // Creating a geoJSON layer with the retrieved data
  L.geoJson(data, {
    // Style each feature (in this case a neighborhood)
    style: function (neighborhood) {
      return {
        color: "white",
        // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
        fillColor: chooseColor(neighborhood.properties.AREA_NAME),
        fillOpacity: 0.5,
        weight: 1.5
      };
    },
    // Called on each feature
    onEachFeature: function (feature, layer) {
      // Set mouse events to change map styling
      layer.on({
        // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
        mouseover: function (event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.9
          });
        },
        // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
        mouseout: function (event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.5
          });
        },
        // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
        click: function (event) {
          map.fitBounds(event.target.getBounds());
        }
      });
      // Giving each feature a pop-up with information pertinent to it
      layer.bindPopup("<h1>" + feature.properties.neighborhood + "</h1> <hr> <h2>" + feature.properties.borough + "</h2>");

    }
  }).addTo(map);
});
