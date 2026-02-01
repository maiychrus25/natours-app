/* eslint-disable */
export const displayMap = (locations) => {
  mapboxgl.accessToken = 'pk.eyJ1IjoiaGlqaWFuZ3RhbyIsImEiOiJjampxcjFnb3E2NTB5M3BvM253ZHV5YjhjIn0.WneUon5qFigfJRJ3oaZ3Ow';
  const map = new mapboxgl.Map({
    container: 'map',
    // center: [105.8342, 21.0278],
    // zoom: 9,
    // interactive: false
    // scrollZoom: false
    style: 'mapbox://styles/mapbox/light-v11',
     
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((location) => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    }).setLngLat(location.coordinates).addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30,
    }).setLngLat(location.coordinates).setHTML(`
      <p>Day ${location.day}: ${location.description}</p>
    `).addTo(map);

    // Extend map bounds to include current location
    bounds.extend(location.coordinates);
  });

  const coordsString = locations.map(c => `${c.coordinates[0]},${c.coordinates[1]}`).join(";");

  map.on("load", () => {
  fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${coordsString}?geometries=geojson&overview=full&access_token=${mapboxgl.accessToken}`)
    .then(res => res.json())
    .then(data => {
      const route = data.routes[0].geometry;

      map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: route
        }
      });

      map.addLayer({
        id: "route-outline",
        type: "line",
        source: "route",
        paint: {
          "line-color": "#1db954",
          "line-width": 7,
          "line-opacity": 0.8
        }
      });
    });
  });
  
  map.fitBounds(bounds, { 
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  });
}
