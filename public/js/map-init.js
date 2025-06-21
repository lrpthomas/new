// Map initialization and configuration
import { store } from './store.js';
let map;
let markers = L.markerClusterGroup();
let currentLayer = 'osm';

// Initialize the map
export function initMap() {
  map = L.map('map').setView([0, 0], 2);

  // Add base layers
  const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  });

  import L from 'leaflet';
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    {
      attribution: '© Esri',
    }
  );

  const terrainLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  });

  // Add default layer
  osmLayer.addTo(map);

  // Store layers for toggling
  window.mapLayers = {
    osm: osmLayer,
    satellite: satelliteLayer,
    terrain: terrainLayer,
  };

  // Add marker cluster group
  map.addLayer(markers);

  // Add click handler for adding points
  map.on('click', function (e) {
    if (store.isAddingPoint) {
      showPointForm(e.latlng);
    }
  });
}

// Toggle map layers
export function toggleLayer(layerName) {
  if (currentLayer === layerName) return;

  map.removeLayer(window.mapLayers[currentLayer]);
  map.addLayer(window.mapLayers[layerName]);
  currentLayer = layerName;

  const radio = document.querySelector(`input[name="basemap"][value="${layerName}"]`);
  if (radio) radio.checked = true;
}

export function getCurrentLayer() {
  return currentLayer;
}

// Add marker to map
export function addMarker(latlng, data) {
  const marker = L.marker(latlng, {
    icon: createCustomIcon(data.status),
  });

  marker.bindPopup(createPopupContent(data));
  markers.addLayer(marker);
  return marker;
}

// Create custom icon based on status
function createCustomIcon(status) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div class="marker-dot ${status}"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

// Create popup content
function createPopupContent(data) {
  return `
        <div class="popup-content">
            <h3>${data.name}</h3>
            <p>Status: ${data.status}</p>
            ${data.description ? `<p>${data.description}</p>` : ''}
            ${data.group ? `<p>Group: ${data.group}</p>` : ''}
            <button onclick="editPoint('${data.id}')">Edit</button>
        </div>
    `;
}

// Add this function to allow toggling clustering from the UI
export function toggleCluster() {
  const clusterToggle = document.getElementById('clusterToggle');
  if (!clusterToggle) return;
  if (clusterToggle.checked) {
    if (!map.hasLayer(markers)) {
      map.addLayer(markers);
    }
  } else {
    if (map.hasLayer(markers)) {
      map.removeLayer(markers);
    }
  }
}
