function createMap(EarthquakesMap) {

  // Create the tile layer that will be the background of our map
  const lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 16,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  });

  // Create a baseMaps object to hold the lightmap layer
  const baseMaps = {
    "Light Map": lightmap
  };

  // Create an overlayMaps object to hold the bikeStations layer
  const overlayMaps = {
    "Earthquakes": EarthquakesMap
  };

  // Create the map object with options
  const map = L.map("map", {
    center: [45.00, -120.00],
    zoom: 8,
    layers: [lightmap, EarthquakesMap]
  });

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);
}

function createMarkers(activities) {

  // Pull the "stations" property off of response.data
  const earthquakeSpots = activities.features;

  // Initialize an array to hold bike markers
  const earthMarkers = [];

  // Loop through the earthquake array
  earthquakeSpots.forEach(activity => {
    // For each station, create a marker and bind a popup with the station's name
    const earthMarker = L.marker([activity.geometry.coordinates[1], activity.geometry.coordinates[0]])
      .bindPopup("<h3>" + activity.properties.title + 
      "<h3><h3>Activity Type: " + activity.properties.type +
      "<h3><h3>Magnitude: " + activity.properties.mag +
      "<h3><h3>Activity Depth: " + activity.geometry.coordinates[2] + "</h3>");

    // Add the marker to the earthMarkers array
    earthMarkers.push(earthMarker);
  })

  // Create a layer group made from the bike markers array, pass it into the createMap function
  createMap(L.layerGroup(earthMarkers));
}


// Perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
d3.json("static/js/all_month.geojson").then(createMarkers);



/* NOTE FOR STEP 2
/  You can use the javascript Promise.all function to make two d3.json calls, 
/  and your then function will not run until all data has been retreived.
/
/ ----------------------------------------
/  Promise.all(
/    [
/        d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"),
/        d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json")
/    ]
/  ).then( ([data,platedata]) => {
/
/        console.log("earthquakes", data)
/        console.log("tectonic plates", platedata)
/
/    }).catch(e => console.warn(e));
/
/ ----------------------------------------*/
