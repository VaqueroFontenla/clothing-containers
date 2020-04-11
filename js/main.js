const ZOOM = 13;
const ZOOM_MOBILE = 12;
const MAP_CENTER = [42.2, -8.71];
const PLACEHOLDER_GEOCODER =
  window.screen.width > 798
    ? "Busca o cotenedor que esté máis preto da tua casa"
    : "Busca o cotenedor";
const POSITION_GEOCODER = window.screen.width > 798 ? "topright" : "topleft";

const basemaps = document.querySelector("#basemaps");
const basemapsWrapper = document.querySelector("#basemaps-wrapper");
const help = document.querySelector(".help");

const map = L.map("map").setView(
  MAP_CENTER,
  window.screen.width > 798 ? ZOOM : ZOOM_MOBILE
);

let layer = L.esri.basemapLayer("Gray").addTo(map);
let layerLabels;

// create the geocoding control and add it to the map
const searchControl = L.esri.Geocoding.geosearch({
  position: POSITION_GEOCODER,
  placeholder: PLACEHOLDER_GEOCODER,
  expanded: true,
}).addTo(map);

// create geoservice
const geocodeService = L.esri.Geocoding.geocodeService();

// create an empty layer group to store the results and add it to the map
const results = L.layerGroup().addTo(map);

// Container Icon
const baseballIcon = L.icon({
  iconUrl:
    window.screen.width > 798 ? "./images/trash.png" : "./images/registro.png",
  iconSize: window.screen.width > 798 ? [24, 24] : [6, 6],
  iconAnchor: [4, 9],
  popupAnchor: [0, -8],
});

const setBasemap = (basemap) => {
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
};

const onEachFeature = (feature, layer) => {
  if (feature.properties) {
    const popupContent = ` 
		<div>
			<strong> ${feature.properties.Lugar} </strong>
			  <hr>
			   <strong>Dirección:  </strong>${feature.properties.Dirección} <br />
			   <strong>Barrio:  </strong> ${feature.properties.Barrio}
			  </div>
      `;
    layer.bindPopup(popupContent);
  }
};

const addDataToMap = (containers) => {
  L.geoJSON(containers, {
    pointToLayer: function (feature, latlng) {
      return L.marker(latlng, { icon: baseballIcon });
    },

    onEachFeature: onEachFeature,
  }).addTo(map);
};

const addHidden = () => {
  if (window.screen.width < 798) {
    document.querySelector(".help").classList.add("hidden");
    document.querySelector(".leaflet-control-zoom").classList.add("hidden");
    document.querySelector(".leaflet-bar").classList.add("hidden");
    document.querySelector(".geocoder-control-input").classList.add("hidden");
  }
};

const init = () => {
  fetch("./data/clothing-containers.geojson")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const containers = data;
      addDataToMap(containers);
      addHidden();
    });
};

document.querySelector(".dashboard__search").addEventListener("click", (e) => {
  e.preventDefault();
  document.querySelector(".geocoder-control-input").classList.toggle("hidden");
  if (!basemapsWrapper.classList.contains("hidden")) {
    basemapsWrapper.classList.add("hidden");
  }
  if (!help.classList.contains("hidden")) {
    help.classList.add("hidden");
  }
});

const closeBaseMap = (e) => {
  e.stopPropagation();
  basemapsWrapper.classList.toggle("hidden");
  if (
    !document
      .querySelector(".geocoder-control-input")
      .classList.contains("hidden")
  ) {
    document.querySelector(".geocoder-control-input").classList.add("hidden");
  }
  if (!help.classList.contains("hidden")) {
    help.classList.add("hidden");
  }
};

document
  .querySelector(".dashboard__basemaps")
  .addEventListener("click", (e) => closeBaseMap(e));
document
  .querySelector(".basemaps__close")
  .addEventListener("click", (e) => closeBaseMap(e));

  
const closeHelp = (e) => {
  e.stopPropagation();
  help.classList.toggle("hidden");
  if (
    !document
      .querySelector(".geocoder-control-input")
      .classList.contains("hidden")
  ) {
    document.querySelector(".geocoder-control-input").classList.add("hidden");
  }
  if (!basemapsWrapper.classList.contains("hidden")) {
    basemapsWrapper.classList.add("hidden");
  }
};

document
  .querySelector(".dashboard__help")
  .addEventListener("click", (e) => closeHelp(e));
document
  .querySelector(".help__close")
  .addEventListener("click", (e) => closeHelp(e));

basemaps.addEventListener("click", (e) => e.stopPropagation());
basemaps.addEventListener("change", (e) => {
  const basemap = e.target.value;
  setBasemap(basemap);
});

document.querySelector(".help-toggle").addEventListener("click", (e) => {
  e.stopPropagation();
  document.querySelector(".help__content").classList.toggle("hidden");
});

document.querySelector("#map").addEventListener("click", (e) => {
  e.stopPropagation();
});

init();
