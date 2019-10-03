// Change the panel title
Panel_title = "Toronto map"
d3.select(".panel-title").text(Panel_title);
console.log(Panel_title);

function getJsonData (data){
    return data;
}

// links
var appstat = d3.json("http://localhost:5000/appstat").then(getJsonData);
var rentavg = d3.json("http://localhost:5000/rentavg").then(getJsonData);
var allrent = d3.json("http://localhost:5000/allrent").then(getJsonData);



