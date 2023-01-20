mapboxgl.accessToken = 'pk.eyJ1IjoiYXl1c2hqb3NoaTEzODAiLCJhIjoiY2xhajN2bjV0MDhuYTNzbGZ4eXY3aWV0YyJ9.-t8ccvCJhwwHcOdi435HrQ'
const map = new mapboxgl.Map({
    attributionControl: false,
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/dark-v10',  
    center: [-122.4443, 47.2529], // starting position
    zoom: 10 // starting zoom
}).addControl(new mapboxgl.AttributionControl({
    customAttribution: 'Pierce county <a href = "https://gisdata-piercecowa.opendata.arcgis.com/datasets/public-health-care-facilities/explore" target="_blank">Hospitals</a> & <a href = "https://gisdata-piercecowa.opendata.arcgis.com/datasets/libraries/explore" target="_blank">Libraries</a>',
    
}));

map.on('load', function() {
    map.addLayer({
      id: 'hospitals',
      type: 'symbol',
      source: {
        type: 'geojson',
        data: hospitalPoints
      },
      layout: {
        'icon-image': 'hospital-15',
        'icon-allow-overlap': true
      },
      paint: { }
    });
    map.addLayer({
      id: 'libraries',
      type: 'symbol',
      source: {
        type: 'geojson',
        data: libraryPoints
      },
      layout: {
        'icon-image': 'library-15',
        'icon-allow-overlap': true
      },
      paint: { }
    });
     
    map.addSource('nearest-hospital', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
          ]
        }
      });
  });

  var popup = new mapboxgl.Popup();
  map.on('click', 'hospitals', function(e) {
  var feature = e.features[0];
  popup.setLngLat(feature.geometry.coordinates)
    .setHTML("Name: " + feature.properties.NAME + "<br />" + "Address: "+ feature.properties.ADDRESS)
.addTo(map);
});

map.on('click', 'libraries', function(f) {
    var refLibrary = f.features[0];
    var nearestHospital = turf.nearest(refLibrary, hospitalPoints); 
    var options = {units: 'miles'};
    var distance = turf.distance(refLibrary, nearestHospital, options);

	map.getSource('nearest-hospital').setData({
        type: 'FeatureCollection',
        features: [
         nearestHospital
        ]
  });

    map.addLayer({
        id: 'nearestHospitalLayer',
        type: 'circle',
        source: 'nearest-hospital',
        paint: {
            'circle-radius': 12,
            'circle-color': '#486DE0'
    }
    }, 'hospitals');

    popup.setLngLat(refLibrary.geometry.coordinates)
    .setHTML('<b>' + refLibrary.properties.NAME + '</b><br>The nearest hospital is ' + nearestHospital.properties.NAME + ', located at ' + nearestHospital.properties.ADDRESS + '<br> Nearest hospital is ' + distance.toFixed(2) + ' miles away')
    .addTo(map);
});