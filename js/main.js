
	var mapContainer = L.map('map').setView([42.2354, -8.7267], 13);
	var tiles = L.esri.basemapLayer("Streets").addTo(mapContainer);

	// create the geocoding control and add it to the map
    var searchControl = L.esri.Geocoding.geosearch().addTo(mapContainer);

    // create an empty layer group to store the results and add it to the map
	var results = L.layerGroup().addTo(mapContainer);
	
	// Container Icon
	var baseballIcon = L.icon({
		iconUrl: '../images/trash.png',
		iconSize: [32, 37],
		iconAnchor: [16, 37],
		popupAnchor: [0, -28]
	});


	function onEachFeature(feature, layer) {

		if (feature.properties) {
			var popupContent = 
			` <span> ${feature.properties.Lugar} </span>
			  <hr>
			  <span> Dirección: </span> <span> ${feature.properties.Dirección} </span> <br />
			  <span> Barrio: </span> <span> ${feature.properties.Barrio} </span>
			`;
		}

		layer.bindPopup(popupContent);
	}

		// LLamada a la API

	function addDataToMap(containers) {
		L.geoJSON(containers, {
			pointToLayer: function (feature, latlng) {
				return L.marker(latlng, {icon: baseballIcon});
			},
	
			onEachFeature: onEachFeature
		}).addTo(mapContainer);
			
	}

	fetch('../data/clothing-containers.geojson')
		.then((response) => {
			return response.json();
			})
		.then((data) => {
			const containers = data;
			addDataToMap(containers);
	});

	 // listen for the results event and add every result to the map
	 searchControl.on("results", function(data) {
        results.clearLayers();
        for (var i = data.results.length - 1; i >= 0; i--) {
            results.addLayer(L.marker(data.results[i].latlng));
        }
    });

