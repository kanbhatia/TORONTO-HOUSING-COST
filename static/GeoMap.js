
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


// Change the panel title
Panel_title = "Toronto map"
d3.select(".panel-title").text(Panel_title);
console.log(Panel_title);

function getJsonData(data) {
  data.Year = Object.entries(data.Year).map(([key, value]) => (value));
  data.Neighbourhood = Object.entries(data.Neighbourhood).map(([key, value]) => (value));

  data.Total = Object.entries(data.Total).map(([key, value]) => {
    if (value === "**") {
      return data.Whole_Toronto_AV[key];
    }
    else {
      return (value)
    }
  });

  data.Whole_Toronto_AV = Object.entries(data.Whole_Toronto_AV).map(([key, value]) => (value));
  map_data = [data.Year, data.Neighbourhood, data.Total, data.Whole_Toronto_AV]

  color_factor = [];

  // turning "1,000 into 1000" and getting a ratio between total and toronto avg
  for (var i = 0; i < (data.Total).length; i++) {
    color_factor.push((((map_data[2][i])) / ((map_data[3][i]))) * 100)
  }

  map_data.push(color_factor)
  var sum = []

  Object.entries(map_data[0]).forEach(([key, value]) => {
    sum.push([map_data[0][key], map_data[1][key], map_data[2][key], map_data[3][key], map_data[4][key]])
  });
  function chooseColor(name, data) {
    var New_name = name.split(" (")[0]
    
    for (var i = 0; i < data.length; i++) {
      if (New_name.split(" ").includes((data[i][1]).split(" ")[0]) || New_name.split(" ").includes((data[i][1]).split("-")[0]) || New_name.split(" ").includes((data[i][1]).split(" ")[1] || New_name.split(" ").includes((data[i][1]).split("-")[1]))) {
        console.log(`${(data[i][4])} ${data[i][1]}`)
        if ((data[i][4]) < 80) {
            return "#00CC66";
            break;
          }
          else if ((data[i][4]) < 85) {
            return "#66FF99";
            break;
          }
          else if ((data[i][4]) < 90) {
            return "#CCFF66";
            break;
          }
          else if ((data[i][4]) < 95) {
            return "#FFFF99";
            break;
          }
          else if ((data[i][4]) < 100.1) {
            return "#FFCC99";
            break;
          }
          else {
            return "#ff0000";
            break;
          }
          
        }
        else if (New_name.split("-").includes((data[i][1]).split(" ")[0]) || New_name.split("-").includes((data[i][1]).split("-")[0]) || New_name.split("-").includes((data[i][1]).split(" ")[1] || New_name.split("-").includes((data[i][1]).split("-")[1]))) {
          
          if ((data[i][4]) < 80) {
            return "#00CC66";
            break;
          }
          else if ((data[i][4]) < 85) {
            return "#66FF99";
            break;
          }
          else if ((data[i][4]) < 90) {
            return "#CCFF66";
            break;
          }
          else if ((data[i][4]) < 95) {
            return "#FFFF99";
            break;
          }
          else if ((data[i][4]) < 100.1) {
            return "#FFCC99";
            break;
          }
          else {
            return "#ff0000";
            break;
          }
          
        }
        else if (New_name.split("/").includes((data[i][1]).split(" ")[0]) || New_name.split("/").includes((data[i][1]).split("-")[0]) || New_name.split("/").includes((data[i][1]).split(" ")[1] || New_name.split("/").includes((data[i][1]).split("-")[1]))) {
          
          if ((data[i][4]) < 80) {
            return "#00CC66";
            break;
          }
          else if ((data[i][4]) < 85) {
            return "#66FF99";
            break;
          }
          else if ((data[i][4]) < 90) {
            return "#CCFF66";
            break;
          }
          else if ((data[i][4]) < 95) {
            return "#FFFF99";
            break;
          }
          else if ((data[i][4]) < 100.1) {
            return "#FFCC99";
            break;
          }
          else {
            return "#ff0000";
            break;
          }

        }
      
    }

  }

  d3.json(link_GeoJson).then(data => {
    var GeoJsonData = data;
    // Creating a geoJSON layer with the retrieved data

    // for (var i = 2010; i < 2019; i++) {
      var GeoJson_layer = L.geoJson(data, {
        // Style each feature (in this case a neighborhood)
        style: function (neighborhood) {
            return {
              color: "white",
              // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
              fillColor: chooseColor(neighborhood.properties.AREA_NAME, sum),
              fillOpacity: 0.7,
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
                  fillOpacity: 1
                });
              },
              // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
              mouseout: function (event) {
                layer = event.target;
                layer.setStyle({
                  fillOpacity: 0.7
                });
              },
              // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
              click: function (event) {
                map.fitBounds(event.target.getBounds());
                map.setView([43.723734, -79.381762], 11)
              }

            });
            layer.bindPopup("<p>" + feature.properties.AREA_NAME.split(" (")[0] + "</p>");

          }
        }).addTo(map);
      //   setTimeout(function () {
      //   map.removeLayer(GeoJson_layer)
      //   console.log(i)
      // }, 10000);
    // }

  });

}


function markerColor(d) {
  return d === 80 ? "#00CC66" :
    d === 85 ? "#66FF99" :
      d === 90 ? "#CCFF66" :
        d === 95 ? "#FFFF99" :
          d === 100 ? "#FFCC99" :
            "#ff0000";
}

var legend = L.control({ position: 'bottomright' });

legend.onAdd = function () {
  var div = L.DomUtil.create('div', 'info legend'),
    magnitudes = [75, 80, 85, 90, 95, 100];

  for (var i = 0; i < magnitudes.length; i++) {
    div.innerHTML +=
      '<i style="background:' + markerColor(magnitudes[i] + 5) + '"></i> ' +
      + magnitudes[i] + (magnitudes[i + 1] ? ' - ' + magnitudes[i + 1] + '<br>' : ' + ');
  }
  return div;
};
legend.addTo(map);


// links
// var appstat = d3.json("http://localhost:5000/appstat").then(getJsonData);
// var rentavg = d3.json("http://localhost:5000/rentavg").then(getJsonData);
// var allrent = d3.json("http://localhost:5000/allrent").then(getJsonData);
var rentneigh = d3.json("http://localhost:5000/rentneigh").then(getJsonData);

