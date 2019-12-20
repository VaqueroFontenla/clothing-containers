
	var mymap = L.map('mapId').setView([42.2354, -8.7267], 13);

	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
			'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox/streets-v11'
    }).addTo(mymap);
    
		// LLamada a la API

	function addDataToMap(containers) {
		L.geoJSON(containers, {

			pointToLayer: function (feature, latlng) {
				return L.marker(latlng);
			},
	
			onEachFeature: onEachFeature
		}).addTo(map);
			
		
		containers.features.map(container => {
			L.marker([container.geometry.coordinates[0], container.geometry.coordinates[1]]).addTo(mymap)
			.bindPopup(container.properties)
		});
	}

	var coorsLayer = L.geoJSON(coorsField, {

		pointToLayer: function (feature, latlng) {
			return L.marker(latlng, {icon: baseballIcon});
		},

		onEachFeature: onEachFeature
	}).addTo(map);


	fetch('../data/clothing-containers.geojson')
		.then((response) => {
			return response.json();
			})
		.then((data) => {
			const containers = data;
			addDataToMap(containers);
	});


	function onMapClick(e) {
		debugger;
		popup
			.setLatLng(e.latlng)
			.setContent("You clicked the map at " + e.latlng.toString())
			.openOn(mymap);
	}

	mymap.on('click', onMapClick);