

am5.ready(async function() {

// Create root element
// https://www.amcharts.com/docs/v5/getting-started/#Root_element
var root = am5.Root.new("chartdiv");

// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
root.setThemes([
  am5themes_Animated.new(root)
]);

// Create the map chart
// https://www.amcharts.com/docs/v5/charts/map-chart/
var chart = root.container.children.push(
  am5map.MapChart.new(root, {
    panX: "rotateX",
    panY: "none",
    projection: am5map.geoMercator(),    
  })
);

var cont = chart.children.push(
  am5.Container.new(root, {
    layout: root.horizontalLayout,
    x: 20,
    y: 40
  })
);

// Add labels and controls
cont.children.push(
  am5.Label.new(root, {
    centerY: am5.p50,
    text: "Map"
  })
);

var switchButton = cont.children.push(
  am5.Button.new(root, {
    themeTags: ["switch"],
    centerY: am5.p50,
    icon: am5.Circle.new(root, {
      themeTags: ["icon"]
    })
  })
);

switchButton.on("active", function () {
  if (!switchButton.get("active")) {
    chart.set("projection", am5map.geoMercator());
    chart.set("panY", "translateY");
    chart.set("rotationY", 0);
    
    backgroundSeries.mapPolygons.template.set("fillOpacity", 0);
  } else {
    chart.set("projection", am5map.geoOrthographic());
    chart.set("panY", "rotateY");
    backgroundSeries.mapPolygons.template.set("fillOpacity", 0.1);
  }
});

cont.children.push(
  am5.Label.new(root, {
    centerY: am5.p50,
    text: "Globe"
  })
);

// Create series for background fill
// https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/#Background_polygon
var backgroundSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {}));
backgroundSeries.mapPolygons.template.setAll({
  fill: root.interfaceColors.get("alternativeBackground"),
  fillOpacity: 0,
  strokeOpacity: 0
});

// Add background polygon
// https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/#Background_polygon
backgroundSeries.data.push({
  geometry: am5map.getGeoRectangle(90, 180, -90, -180)
});

// Create main polygon series for countries
// https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/
var polygonSeries = chart.series.push(
  am5map.MapPolygonSeries.new(root, {
    geoJSON: am5geodata_worldLow
  })
);

// Create line series for trajectory lines
// https://www.amcharts.com/docs/v5/charts/map-chart/map-line-series/
var lineSeries = chart.series.push(am5map.MapLineSeries.new(root, {}));
lineSeries.mapLines.template.setAll({
  stroke: root.interfaceColors.get("alternativeBackground"),
  strokeOpacity: 0.3
});

// Create point series for markers
// https://www.amcharts.com/docs/v5/charts/map-chart/map-point-series/
var pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));

pointSeries.bullets.push(function () {
  var circle = am5.Circle.new(root, {
    radius: 4,
    tooltipY: 0,
    fill: am5.color(0xffba00),
    stroke: root.interfaceColors.get("background"),
    strokeWidth: 2,
    tooltipText: "{title}"
  });

  return am5.Bullet.new(root, {
    sprite: circle
  });
});

var cities = [];
var GeoIP = []
var IP = []

await fetch("http://localhost:8003/nodeFile.json")
.then(response => {
   return response.json();
})

    
.then(data => { 

    // pour chaque élément de data, on fait une reqete à l'api pour tous les élements du tablea IP
    for (var i = 0; i < data.length; i++) {
        // si l'élémennt est défini
        if(data[i].IPv4 != undefined){
        
        for(var j = 0; j < data[i].IPv4.length; j++){
                // si l'ip est dans un réseau privé, on ne fait rien
                if(data[i].IPv4[j].startsWith("192.168") || data[i].IPv4[j].startsWith("10.") || data[i].IPv4[j].startsWith("172.16") || data[i].IPv4[j].startsWith("172.17") || data[i].IPv4[j].startsWith("172.18") || data[i].IPv4[j].startsWith("172.19") || data[i].IPv4[j].startsWith("172.20") || data[i].IPv4[j].startsWith("172.21") || data[i].IPv4[j].startsWith("172.22") || data[i].IPv4[j].startsWith("172.23") || data[i].IPv4[j].startsWith("172.24") || data[i].IPv4[j].startsWith("172.25") || data[i].IPv4[j].startsWith("172.26") || data[i].IPv4[j].startsWith("172.27") || data[i].IPv4[j].startsWith("172.28") || data[i].IPv4[j].startsWith("172.29") || data[i].IPv4[j].startsWith("172.30") || data[i].IPv4[j].startsWith("172.31") || data[i].IPv4[j].startsWith("169.254")){
                    console.log("ip privée");
                }
                else{
                    
                    IP.push(data[i].IPv4[j]);

                }
   

            }
        }

    }});

                

for(var i = 0; i < IP.length; i++){

    await fetch("https://get.geojs.io/v1/ip/geo/"+IP[i]+".json")
    .then(response => {
        return response.json();
    })

    .then(data => { 
        // for (var i = 0; i < GeoIP.length; i++) {
          var city = data;
          console.log(city);
          addCity(city.longitude, city.latitude, city.organization_name);
        // }
        

        
        // Make stuff animate on load
        
    })


}
chart.appear(1000, 100);

function addCity(longitude, latitude, title) {
  pointSeries.data.push({
    geometry: { type: "Point", coordinates: [longitude, latitude] },
    title: title
  });
}


console.log(GeoIP);





}); // end am5.ready()
