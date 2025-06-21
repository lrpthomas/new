/* eslint-disable @typescript-eslint/no-unused-vars */
import L from 'leaflet';
import { store } from './store';
import { showPointForm } from './ui-handlers';

let map: L.Map;
let markers = (L as any).markerClusterGroup ? (L as any).markerClusterGroup() : L.layerGroup();
let currentLayer = 'osm';

export function initMap(): L.Map {
  map = L.map('map').setView([0, 0], 2);

  const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  });
  const satelliteLayer = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    { attribution: '© Esri' }
  );
  const terrainLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  });

  osmLayer.addTo(map);

  (window as any).mapLayers = { osm: osmLayer, satellite: satelliteLayer, terrain: terrainLayer };

  map.addLayer(markers);

  map.on('click', e => {
    if (store.isAddingPoint) {
      showPointForm((e as L.LeafletMouseEvent).latlng);
    }
  });

  return map;
}

export function toggleLayer(layerName: string): void {
  if (currentLayer === layerName) return;
  map.removeLayer((window as any).mapLayers[currentLayer]);
  map.addLayer((window as any).mapLayers[layerName]);
  currentLayer = layerName;
  const radio = document.querySelector(`input[name="basemap"][value="${layerName}"]`);
  if (radio instanceof HTMLInputElement) radio.checked = true;
}

export function getCurrentLayer(): string {
  return currentLayer;
}

export function addMarker(latlng: L.LatLngExpression, data: any): L.Marker {
  const marker = L.marker(latlng, { icon: createCustomIcon(data.status) });
  marker.bindPopup(createPopupContent(data));
  markers.addLayer(marker);
  return marker;
}

function createCustomIcon(status: string): L.DivIcon {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div class="marker-dot ${status}"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

function createPopupContent(data: any): string {
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

export function toggleCluster(): void {
  const clusterToggle = document.getElementById('clusterToggle') as HTMLInputElement | null;
  if (!clusterToggle) return;
  if (clusterToggle.checked) {
    if (!map.hasLayer(markers)) {
      map.addLayer(markers);
    }
  } else if (map.hasLayer(markers)) {
    map.removeLayer(markers);
  }
}
