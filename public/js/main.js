// Main application entry point
import { initMap, toggleLayer, addMarker } from './map-init.js';
import { initUIHandlers, showToast, updatePointsList, updateStatistics } from './ui-handlers.js';
import { exportToGeoJSON, importFromGeoJSON, exportToJSON, importFromJSON } from './file-io.js';
import {
  togglePointsList,
  toggleLayerControls,
  import { togglePointsList, toggleLayerControls, showGroupFilter, closeGroupFilter, toggleBulkEdit, applyBulkEdit } from './modals.js';
  showGroupFilter,
  import { togglePointsList, toggleLayerControls, toggleStatistics, showGroupFilter, toggleBulkEdit, applyBulkEdit } from './modals.js';
  toggleBulkEdit,
  applyBulkEdit,
} from './modals.js';
import { points, addPoint, removePoint } from './state.js';

let map;

document.getElementById('layerToggleBtn')?.addEventListener('click', handleLayerToggle); document.getElementById('addPointBtn')?.addEventListener('click', () => { window.isAddingPoint = true; showToast('Point addition started.'); });
  try {
    map = await initMap({ enableTileCache: true });
    initUIHandlers(map);

    restoreState();

    document.getElementById('layerToggleBtn')?.addEventListener('click', handleLayerToggle);
    document.getElementById('addPointBtn')?.addEventListener('click', () => {
      window.isAddingPoint = true;
      showToast('Point addition started.');
    });

    document.getElementById('csvFile')?.addEventListener('change', e => {
      if (e.target.files.length) importFromCSV(e.target.files[0]);
    });
    document.getElementById('exportGeoJsonBtn')?.addEventListener('click', exportToGeoJSON);
    document.getElementById('exportJsonBtn')?.addEventListener('click', exportToJSON);
    document.getElementById('importGeoJsonBtn')?.addEventListener('click', promptGeoJSONImport);
    document.getElementById('importJsonBtn')?.addEventListener('click', promptJSONImport);

    document.getElementById('bulkEditBtn')?.addEventListener('click', toggleBulkEdit);
    document.getElementById('applyBulkEditBtn')?.addEventListener('click', applyBulkEdit);
    document.getElementById('clearDataBtn')?.addEventListener('click', clearAllData);

    registerServiceWorker();
  } catch (err) {
    console.error('Failed to initialize app:', err);
    showToast('Application failed to start');
  }
}

function restoreState() {
  const savedLayer = localStorage.getItem('activeLayerId');
  if (savedLayer) toggleLayer(map, savedLayer);
  loadSavedPoints();
  setupLayerRadios();
}

function loadSavedPoints() {
  try {
    const saved = localStorage.getItem('mapPoints');
    if (saved) {
      const savedPoints = JSON.parse(saved);
      savedPoints.forEach(point => {
        addPoint(point);
        addMarker(point.latlng, point);
      });
      updatePointsList();
      updateStatistics();
    }
  } catch {
    console.error('Error loading saved points');
    showToast('Error loading saved points');
  }
}

function setupLayerRadios() {
  document.querySelectorAll('input[name="basemap"]').forEach(radio =>
    radio.addEventListener('change', e => {
      if (e.target.checked) toggleLayer(map, e.target.value);
    })
  );
}

function handleLayerToggle() {
  try {
    const id = 'myLayerId';
    toggleLayer(map, id);
    localStorage.setItem('activeLayerId', id);
    showToast('Layer toggled');
  } catch (err) {
    console.error('Error toggling layer:', err);
    showToast('Failed to toggle layer');
  }
}

function promptGeoJSONImport() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.geojson';
  input.onchange = e => e.target.files[0] && importFromGeoJSON(e.target.files[0]);
  input.click();
}

function promptJSONImport() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = e => e.target.files[0] && importFromJSON(e.target.files[0]);
  input.click();
}

function clearAllData() {
  if (confirm('Clear all data? This cannot be undone.')) {
    while (points.length) {
      removePoint(points[0].id);
    }
    markers && markers.clearLayers();
    updatePointsList();
    updateStatistics();
    showToast('All data cleared');
  }
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker
    .register('/service-worker.js')
    .then(reg => {
      reg.addEventListener('updatefound', () => {
        const w = reg.installing;
        w?.addEventListener('statechange', () => {
          if (w.state === 'installed' && navigator.serviceWorker.controller)
            showToast('New version available. Refresh to update.');
        });
      });
    })
    .catch(err => console.error('ServiceWorker registration failed:', err));
}

document.addEventListener('DOMContentLoaded', initApp);
