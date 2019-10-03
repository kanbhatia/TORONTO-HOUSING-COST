// Change the panel title
Panel_title = "Toronto map"
d3.select(".panel-title").text(Panel_title);
console.log(Panel_title);

function asd (stats){
    xa = stats;
    console.log(xa);
}

url = "http://localhost:5000/appstat"
d3.json(url).then(asd)