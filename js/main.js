
	var map = L.map('map').setView([42.2354, -8.7267], 13);
	var layer = L.esri.basemapLayer("Streets").addTo(map);
	var layerLabels;

	// create the geocoding control and add it to the map
	var searchControl = L.esri.Geocoding.geosearch().addTo(map);

	// create geoservice
	var geocodeService = L.esri.Geocoding.geocodeService();

    // create an empty layer group to store the results and add it to the map
	var results = L.layerGroup().addTo(map);
	
	// Container Icon
	var baseballIcon = L.icon({
		iconUrl: '../images/trash.png',
		iconSize: [32, 37],
		iconAnchor: [16, 37],
		popupAnchor: [0, -28]
	});

	function setBasemap (basemap) {

		if (layer) {
			map.removeLayer(layer);
		}
	
		layer = L.esri.basemapLayer(basemap);
	
		map.addLayer(layer);
	
		if (layerLabels) {
		  map.removeLayer(layerLabels);
		}
	
		if (
		  basemap === 'Gray' ||
		  basemap === 'DarkGray'
		) {
		  layerLabels = L.esri.basemapLayer(basemap + 'Labels');
		  map.addLayer(layerLabels);
		}
	}
	
	document
	.querySelector('#basemaps')
	.addEventListener('change', function (e) {
		var basemap = e.target.value;
		setBasemap(basemap);
	});

	const onEachFeature = (feature, layer) => {

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

	const expandGeocoder = () => {
		let geocoder = document.querySelector(".geocoder-control");
		geocoder.classList.add('geocoder-control-expanded');
	}

	const addDataToMap = (containers) => {
		L.geoJSON(containers, {
			pointToLayer: function (feature, latlng) {
				return L.marker(latlng, {icon: baseballIcon});
			},
	
			onEachFeature: onEachFeature
		}).addTo(map);

		expandGeocoder();
			
	}

	const init = () => {
		fetch('../data/clothing-containers.geojson')
			.then((response) => {
				return response.json();
				})
			.then((data) => {
				const containers = data;
				addDataToMap(containers);
		});
	}

	// listen for the results event and add every result to the map
	searchControl.on("results", function(data) {
        results.clearLayers();
        for (var i = data.results.length - 1; i >= 0; i--) {
            results.addLayer(L.marker(data.results[i].latlng));
        }
	});
	
	// listen for to show the closest street address to the clicked point.
	map.on('click', function (e) {
		geocodeService.reverse().latlng(e.latlng).run(function (error, result) {
		  if (error) {
			return;
		  }
	
		  L.marker(result.latlng).addTo(map).bindPopup(result.address.Match_addr).openPopup();
		});
	});


	init();

