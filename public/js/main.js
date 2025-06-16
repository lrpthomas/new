// Main application entry point
import { initMap, toggleLayer } from './map-init.js';
import { initUIHandlers } from './ui-handlers.js';
import {
  exportToCSV,
  importFromCSV,
  exportToGeoJSON,
  importFromGeoJSON,
  exportToJSON,
  importFromJSON,
} from './file-io.js';
import {
  toggleModal,
  togglePointsList,
  toggleLayerControls,
  toggleStatistics,
  showGroupFilter,
  closeGroupFilter,
  applyGroupFilter,
  toggleAdvancedSearch,
  applyAdvancedSearch,
  toggleBulkEdit,
  applyBulkEdit,
} from './modals.js';

// Load saved points from localStorage
function loadSavedPoints() {
  try {
    const savedPoints = localStorage.getItem('mapPoints');
    if (savedPoints) {
      points = JSON.parse(savedPoints);
      points.forEach(point => addMarker(point.latlng, point));
    }
  } catch (error) {
    console.error('Error loading saved points:', error);
    showToast('Error loading saved points');
  }
}

function initLayerControls() {
  const radios = document.querySelectorAll('input[name="basemap"]');
  radios.forEach(radio => {
    radio.addEventListener('change', e => {
      if (e.target.checked) {
        toggleLayer(e.target.value);
      }
    });
  });
}

// Initialize application
function initApp() {
  try {
    // Initialize map
    initMap();

    // Initialize UI handlers
    initUIHandlers();

  // Load saved points
  loadSavedPoints();

  initLayerControls();

    // Set up event listeners
    document.getElementById('addPointBtn').addEventListener('click', () => {
      window.isAddingPoint = true;
      function showToast(message) { console.log(message); } showToast('Point addition started.');

    });

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(() => {})
        .catch(err => {
          console.error('ServiceWorker registration failed:', err);
        });
    }

    // Set up file input handlers
    document.getElementById('csvFile').addEventListener('change', e => {
      if (e.target.files.length) {
        importFromCSV(e.target.files[0]);
      }
    });

    // Set up export buttons
    document.getElementById('exportGeoJsonBtn').addEventListener('click', exportToGeoJSON);
    document.getElementById('exportJsonBtn').addEventListener('click', exportToJSON);

    // Set up import buttons
    document.getElementById('importGeoJsonBtn').addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.geojson';
      input.onchange = e => {
        if (e.target.files.length) {
          importFromGeoJSON(e.target.files[0]);
        }
      };
      input.click();
    });

    document.getElementById('importJsonBtn').addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = e => {
        if (e.target.files.length) {
          importFromJSON(e.target.files[0]);
        }
      };
      input.click();
    });

    // Set up bulk edit button
    document.getElementById('bulkEditBtn').addEventListener('click', toggleBulkEdit);
    document.getElementById('applyBulkEditBtn').addEventListener('click', applyBulkEdit);

    // Set up clear data button
    document.getElementById('clearDataBtn').addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
        let points = []; // or const points = []; depending on your use case
        markers.clearLayers();
        updatePointsList();
        updateStatistics();
        showToast('All data cleared');
      }
    });
  } catch (error) {
    console.error('Error initializing app:', error);
    if (typeof showToast === 'function') showToast('Error initializing app');
  }
}

document.addEventListener('DOMContentLoaded', initApp);
