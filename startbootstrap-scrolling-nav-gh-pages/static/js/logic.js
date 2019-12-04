// Load in geojson data
var countyGeojson = "static/data/2017_county_data_complete.geojson";

var geojson;


// Perform a GET request to the query geojson
d3.json(countyGeojson, function(data) {
  // Assign data.features object to the createFeatures function
  createFeatures(data.features);
  console.log(data.features)
});

function createFeatures(countyData) {

  // Define a function to run for each feature in the "features" array and create popup displaying the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("State:" + feature.properties.State + "<br>" + "County:" + feature.properties.County + "<br>" + "Population:" + feature.properties.Population + "<hr>" + "Number of Incidents:" + feature.properties.Number_of_Incidents + "<br>" + "Killed:" + feature.properties.Total_Killed + "<br>" + "Injured:" + feature.properties.Total_Injured +  "<hr>" +  "Poverty Rate:" + feature.properties.Poverty_Rate + "<br>" + "Unemployment Rate:" + feature.properties.Unemployment_Rate);
  }

  

  // Define function to create the circle radius based on the numOfIncidents
  function markerSize(numOfIncidents) {
    return numOfIncidents * 100;
  }

  // Define function to set the circle color based on the numOfIncidents
  function markerColor(numOfIncidents) {
    if (numOfIncidents < 50) {
      return "#FFA07A"
    }
    else if (numOfIncidents >= 51 && numOfIncidents <= 100) {
      return "#FA8072"
    }
    else if (numOfIncidents >= 101 && numOfIncidents <= 200) {
      return "#CD5C5C"
    }
    else if (numOfIncidents >= 201 && numOfIncidents <= 500) {
      return "#B22222"
    }
    else if (numOfIncidents >= 501 && numOfIncidents <= 1500) {
      return "#8B0000"
    }
    else {
      return "#FF0000"
    }
  }

  // Create a GeoJSON layer and Run the onEachFeature function for each item in the array 
  var gunViolence = L.geoJSON(countyData, {
    pointToLayer: function(countyData, latlng) {
      return L.circle(latlng, {
        radius: markerSize(countyData.properties.Number_of_Incidents),
        color: markerColor(countyData.properties.Number_of_Incidents),
        fillOpacity: 10
      });
    },
    onEachFeature: onEachFeature
  });

  // Sending our gunViolence layer to the createMap function
  createMap(gunViolence);
}

function createMap(gunViolence) {

  // Define outdoormap, satellitemap, and grayscalemap layers
  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  var SpinalMap = L.tileLayer('https://tile.thunderforest.com/spinal-map/{z}/{x}/{y}.png?apikey=056564efff454fffa0ebc2162116e605', {
	attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	apikey: '<your apikey>',
	maxZoom: 22
});

  var outdoorsmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
  });

  var MobileAtlas = L.tileLayer('https://tile.thunderforest.com/mobile-atlas/{z}/{x}/{y}.png?apikey=056564efff454fffa0ebc2162116e605', {
    attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    apikey: '<your apikey>',
    maxZoom: 22
  });

  
  
  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Dark Map": darkmap,
    "Outdoors": outdoorsmap,
    "Mobile Atlas": MobileAtlas,
    "Spinal Map": SpinalMap
    
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    GunViolence: gunViolence
  };


  // Create our map, giving it the darkmap and gunViolence layers to display when prompted to load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [darkmap, gunViolence]
  });

  // Create a layer control and pass in our baseMaps and overlayMaps
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

 // color function to be used when creating the legend
 function getColor(noOfIncidents) {
  return noOfIncidents > 1500 ? '#FF0000' :
         noOfIncidents > 500 ? '#8B0000' :
         noOfIncidents > 200 ? '#B22222' :
         noOfIncidents > 100 ? '#CD5C5C' :
         noOfIncidents > 50 ? '#FA8072' :
                         '#FFA07A';
}

  // Add legend to the map 
  var legend = L.control({position: 'bottomright'});
  
  legend.onAdd = function() {
  
      var div = L.DomUtil.create('div', 'info legend'),
          incidents = [0, 50, 100, 200, 500, 1500],
          labels = ['<strong>Number of Incidents</strong> <hr>'];
  
      // loop through our density levels and create a label with a color assigned to each range
      for (var i = 0; i < incidents.length; i++) {
          div.innerHTML += 
          labels.push(
              '<i style="background:' + getColor(incidents[i] + 1) + '"></i> ' +
              incidents[i] + (incidents[i + 1] ? '&ndash;' + incidents[i + 1] + '<br>' : '+'));
      }
  
      div.innerHTML = labels.join('<br>');

      return div;
  };
  
  legend.addTo(myMap);
}