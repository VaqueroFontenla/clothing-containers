var map = L.map("map").setView([42.15, -8.68], 11);

var layer = L.esri.basemapLayer("Gray").addTo(map);
var layerLabels;

// create the geocoding control and add it to the map
var searchControl = L.esri.Geocoding.geosearch().addTo(map);

// create geoservice
var geocodeService = L.esri.Geocoding.geocodeService();

// create an empty layer group to store the results and add it to the map
var results = L.layerGroup().addTo(map);

// Container Icon
var baseballIcon = L.icon({
  iconUrl: "../images/registro.png",
  iconSize: [6, 6],
  iconAnchor: [4, 9],
  popupAnchor: [0, -8]
});

function setBasemap(basemap) {
  if (layer) {
    map.removeLayer(layer);
  }

  layer = L.esri.basemapLayer(basemap);

  map.addLayer(layer);

  if (layerLabels) {
    map.removeLayer(layerLabels);
  }

  if (basemap === "Gray" || basemap === "DarkGray") {
    layerLabels = L.esri.basemapLayer(basemap + "Labels");
    map.addLayer(layerLabels);
  }
}

const onEachFeature = (feature, layer) => {
  if (feature.properties) {
    var popupContent = ` 
		<div>
			<strong> ${feature.properties.Lugar} </strong>
			  <hr>
			   <strong>Dirección:  </strong>${feature.properties.Dirección} <br />
			   <strong>Barrio:  </strong> ${feature.properties.Barrio}
			  </div>
			`;
  }

  layer.bindPopup(popupContent);
};

const addDataToMap = containers => {
  L.geoJSON(containers, {
    pointToLayer: function(feature, latlng) {
      return L.marker(latlng, { icon: baseballIcon });
    },

    onEachFeature: onEachFeature
  }).addTo(map);
};

const init = () => {
  fetch("../data/clothing-containers.geojson")
    .then(response => {
      return response.json();
    })
    .then(data => {
      const containers = data;
      addDataToMap(containers);
      buildGeocoder();
    });
};

// listen for the results event and add every result to the map
searchControl.on("results", function(data) {
  results.clearLayers();
  for (var i = data.results.length - 1; i >= 0; i--) {
    results.addLayer(L.marker(data.results[i].latlng));
  }
});

// listen for to show the closest street address to the clicked point.
map.on("click", function(e) {
  geocodeService
    .reverse()
    .latlng(e.latlng)
    .run(function(error, result) {
      if (error) {
        return;
      }

      L.marker(result.latlng)
        .addTo(map)
        .bindPopup(result.address.Match_addr)
        .openPopup();
    });
});

const buildGeocoder = () => {
  document
    .querySelector(".geocoder-control")
    .classList.add("geocoder-control-expanded", "hidden");
};

document
  .querySelector(".dashboard__search")
  .addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelector(".geocoder-control").classList.toggle("hidden");
  });

document
  .querySelector(".dashboard__basemaps")
  .addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelector("#basemaps-wrapper").classList.toggle("hidden");
  });

document
  .querySelector(".dashboard__help")
  .addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelector(".help").classList.toggle("hidden");
  });

document.querySelector("#basemaps").addEventListener("click", function(e) {
  e.stopPropagation()
});

document.querySelector("#basemaps").addEventListener("change", function(e) {
  var basemap = e.target.value;
  setBasemap(basemap);
});

init();
