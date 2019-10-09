
// Creating map object
var map = L.map("map2", {
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
Panel_title = "TORONTO MAP WITH RENTAL PRICES"
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
        // console.log(`${(data[i][4])} ${data[i][1]}`)
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
                stock = (event.target.feature.properties.AREA_NAME.split(" (")[0])
                map.setView([43.723734, -79.381762], 11)
                buildPlot(stock)
                function buildPlot(stock) {
                  var id = stock;
                  
                
                  d3.json("http://localhost:5000/rentneigh").then(function(data) {
                    // Grab values from the response json object to build the plots
                    // Print the names of the columns
                  console.log("hello")
                    var Neighbour = Object.values(data["Neighbourhood"])
                
                    var bed1 = Object.values(data["1 Bedroom"])
                    var bed2 = Object.values(data["2 Bedroom"])
                    var bed3 = Object.values(data["3 Bedroom +"])
                    var bach = Object.values(data["Bachelor"])
                    var avgbed = Object.values(data["Total"])
                    var year = Object.values(data["Year"])
                    var bed1Plot = [] 
                    var bed2Plot = [] 
                    var bed3Plot = [] 
                    var bachPlot = [] 
                    var avgbedPlot = [] 
                    var yearPlot = [] 
                  
                    var tempyear
                
                    var apartments = {}
                
                    for (var i = 0; i < Neighbour.length; i++) {
                      if (Neighbour[i] == id){
                        tempyear = yearPlot.includes(year[i])
                        if( tempyear != true){
                          bed1Plot.push(bed1[i]); 
                          bed2Plot.push(bed2[i]);
                          bed3Plot.push(bed3[i]); 
                          bachPlot.push(bach[i]);
                          avgbedPlot.push(avgbed[i]);
                          yearPlot.push(year[i]);
                        }
                        }
                      }
                    
                    let zip = (a1, a2) => a1.map((x, i) => [x, a2[i]]); 
                    var chartPlot =zip(yearPlot, avgbedPlot); // ["a", 1], ["b", 2], ["c", 3]
                
                    //var chartPlot = new Array(yearPlot, avgbedPlot)
                    //console.log(chartPlot);
                
                
                    chartPlot.sort(function(a, b){return a[0] - b[0]});
                
                    var bed1Plot2 = [] 
                    var bed2Plot2 = [] 
                    var bed3Plot2 = [] 
                    var bachPlot2 = [] 
                    var avgbedPlot2 = [] 
                    var yearPlot2 = [] 
                
                    console.log(chartPlot)
                
                    for (var k = 0; k < chartPlot.length; k++)  {
                      avgbedPlot2.push(chartPlot[k][1]);
                      yearPlot2.push(chartPlot[k][0])
                    }  
                    console.log(avgbedPlot2)
                
                    var trace1 = {
                      type: "line",
                      x: yearPlot2,
                      y: avgbedPlot2,
                      line: {
                        color: "#17BECF"
                      }
                    };
                
                    var plotData = [trace1];
                
                    var layout = {
                      title: `closing prices`,
                      xaxis: {
                        autorange: true,
                        type: "time",
                          time: {unit: 'year'}
                      },
                      yaxis: {
                        autorange: true,
                        type: "linear"
                      }
                    };
                
                    Plotly.newPlot("plot", plotData, layout);

                  
                  });
                
                }
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
