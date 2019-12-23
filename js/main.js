
	var mymap = L.map('mapId').setView([42.2354, -8.7267], 13);

	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
			'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox/streets-v11'
    }).addTo(mymap);
	
	var baseballIcon = L.icon({
		iconUrl: '../trash.png',
		iconSize: [32, 37],
		iconAnchor: [16, 37],
		popupAnchor: [0, -28]
	});

	function onEachFeature(feature, layer) {

		if (feature.properties) {
			var popupContent = 
			` <span> Nombre del sitio: </span> <span> ${feature.properties.Lugar} </span>
			  <span> Dirección: </span> <span> ${feature.properties.Dirección} </span>
			  <span> Barrio: </span> <span> ${feature.properties.Barrio} </span>
			`;
		}

		layer.bindPopup(popupContent);
	}

		// LLamada a la API

	function addDataToMap(containers) {
		L.geoJSON(containers, {
			onEachFeature: onEachFeature
		}).addTo(mymap);
			
	}

	fetch('../data/clothing-containers.geojson')
		.then((response) => {
			return response.json();
			})
		.then((data) => {
			const containers = data;
			addDataToMap(containers);
	});

