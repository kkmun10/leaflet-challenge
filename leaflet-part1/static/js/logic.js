// Create our map, giving it the streetmap and earthquakes layers to display on load.
     let myMap = L.map("map", {
      center: [39.8282, -98.5795],
      zoom: 5,
  });
  
 // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });
  

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
  };

// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
let earthquakes = new L.LayerGroup();

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
    L.geoJSON(data, {
      onEachFeature: onEachFeature,
      style: formatCircleMarker,
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng);
      }}).addTo(earthquakes);



  // Create an overlay object to hold our overlays
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  earthquakes.addTo(myMap);
  street.addTo(myMap);

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><hr><p>Magnitude: ${feature.properties.mag}</p><hr><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
  };

  //Define function to select marker color based on depth
  function chooseColor(depth) {
    var color = "";
    if (depth >= -10 && depth <= 10) {
        return color = "#98ee00";
    }
    else if (depth > 10 && depth <= 30) {
        return color = "#d4ee00";
    }
    else if (depth > 30 && depth <= 50) {
        return color = "#eecc00";
    }
    else if (depth > 50 && depth <= 70) {
        return color =  "#ee9c00";
    }
    else if (depth > 70 && depth <= 90) {
        return color = "#ff8533";
    }
    else if (90 < depth) {
        return color = "#ff6666";
    }
    else {
        return color = "black";
    }
  }
  //Define function to select marker size based on magnitude
  function chooseSize(magnitude) {
    if (magnitude === 0) {
      return magnitude * 1
    };
    return magnitude * 5
  };

 // Create a function to format markers
 function formatCircleMarker (feature, latlng) {
  let format = {
      radius: chooseSize(feature.properties.mag),
      fillColor: chooseColor(feature.geometry.coordinates[2]),
      color: "black",
	fillOpacity:0.75,
	weight: .8,
	opacity: .8,
  }
  return format
}

  });

//Set up map legend to show depth colors
    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function(myMap) {
  var div = L.DomUtil.create("div", "legend");
  div.innerHTML += '<i style="background: #98ee00"></i><span>-10 - 10</span><br>';
  div.innerHTML += '<i style="background: #d4ee00"></i><span>10 - 30</span><br>';
  div.innerHTML += '<i style="background: #eecc00"></i><span>30 - 50</span><br>';
  div.innerHTML += '<i style="background: #ee9c00"></i><span>50 - 70</span><br>';
  div.innerHTML += '<i style="background: #ff8533"></i><span>70 - 90</span><br>';
  div.innerHTML += '<i style="background: #ff6666"></i><span>90+</span><br>';

  // Add white border and adjust color square size
  var colorSquares = div.querySelectorAll("i");
  colorSquares.forEach(function(square) {
    square.style.border = "1px solid white";
    square.style.width = "16px";
    square.style.height = "16px";
 });

  return div;
};

//Add legend to map
legend.addTo(myMap);