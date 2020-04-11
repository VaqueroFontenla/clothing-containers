const data = require('../data/containers.json');
const fs = require('fs');

// Construcción del archivo .geoJson para poder servirlo desde nuestro ordenador
const fromArrayToGeoJSON = (arr) => {
    const geoJSON = {
        'type': 'FeatureCollection',
        'features': []
    };
    const geoJsonFeatures = geoJSON.features;
    arr.map((el) => {
        geoJsonFeatures.push({
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [el.Lon, el.Lat]
            },
            'properties': el
        })
    });
    return geoJSON;
}

fs.writeFile('../data/clothing-containers.geojson', JSON.stringify(fromArrayToGeoJSON(data)), (err) => {
    if (err) console.log(err);
    console.log('Housting: Successfully Written to File.');
});