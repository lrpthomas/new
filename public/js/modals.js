// Modal dialog management
import { showToast } from './ui-handlers.js';
import { store } from './store.js';

// Toggle modal visibility
export function toggleModal(modalId, show = true) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = show ? 'block' : 'none';

    // Handle focus management
    if (show) {
      const firstFocusable = modal.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (firstFocusable) firstFocusable.focus();
    }
  }
}

// Toggle points list modal
export function togglePointsList() {
  const modal = document.getElementById('pointsList');
  toggleModal('pointsList', modal.style.display !== 'block');
}

// Toggle layer controls
export function toggleLayerControls() {
  const controls = document.getElementById('layerControls');
  const button = document.getElementById('toggleLayersButton');

  if (controls.classList.contains('hidden')) {
    controls.classList.remove('hidden');
    button.setAttribute('aria-expanded', 'true');
  } else {
    controls.classList.add('hidden');
    button.setAttribute('aria-expanded', 'false');
  }
}

// Toggle statistics panel
export function toggleStatistics() {
  const panel = document.getElementById('statisticsPanel');
  panel.classList.toggle('hidden');
}

// Show group filter modal
export function showGroupFilter() {
  const modal = document.getElementById('groupFilterModal');
  const container = document.getElementById('groupFilterList');

  // Get unique groups
  const groups = [...new Set(store.points.map(p => p.group).filter(Boolean))];

  // Create group buttons
  container.innerHTML = groups
    .map(
      group => `
        <button class="button secondary" onclick="applyGroupFilter('${group}')">
            ${group}
        </button>
    `
    )
    .join('');

  toggleModal('groupFilterModal', true);
}

// Close group filter modal
export function closeGroupFilter() {
  toggleModal('groupFilterModal', false);
}

// Apply group filter
export function applyGroupFilter(group) {
  store.currentGroupFilter = group;
  filterPoints(store.currentFilter);
  closeGroupFilter();
  showToast(`Filtered by group: ${group}`);
}

// Toggle advanced search modal
export function toggleAdvancedSearch() {
  toggleModal('advancedSearch');
}

// Apply advanced search
export function applyAdvancedSearch() {
  const name = document.getElementById('searchName').value.toLowerCase();
  const status = document.getElementById('searchStatus').value;
  const group = document.getElementById('searchGroup').value.toLowerCase();

  const filteredPoints = store.points.filter(point => {
    const nameMatch = !name || point.name.toLowerCase().includes(name);
    const statusMatch = !status || point.status === status;
    const groupMatch = !group || (point.group && point.group.toLowerCase().includes(group));
    return nameMatch && statusMatch && groupMatch;
  });

  // Update markers
  markers.clearLayers();
  filteredPoints.forEach(point => addMarker(point.latlng, point));

  toggleAdvancedSearch();
  showToast(`Found ${filteredPoints.length} matching points`);
}

// Reset advanced search
export function resetAdvancedSearch() {
  document.getElementById('searchName').value = '';
  document.getElementById('searchStatus').value = '';
  document.getElementById('searchGroup').value = '';
  filterPoints('all');
  toggleAdvancedSearch();
}

// Toggle bulk edit modal
export function toggleBulkEdit() {
  const modal = document.getElementById('bulkEditModal');
  const form = document.getElementById('bulkEditForm');

  // Create form fields
  form.innerHTML = `
        <div class="form-group">
            <label>Status</label>
            <select id="bulkStatus">
                <option value="">No Change</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="delayed">Delayed</option>
            </select>
        </div>
        <div class="form-group">
            <label>Group</label>
            <input type="text" id="bulkGroup" placeholder="Leave empty for no change">
        </div>
    `;

  toggleModal('bulkEditModal', true);
}

// Apply bulk edit
export function applyBulkEdit() {
  const status = document.getElementById('bulkStatus').value;
  const group = document.getElementById('bulkGroup').value;

  // Get selected points
  const selectedPoints = store.points.filter(p => p.selected);

  // Update points
  selectedPoints.forEach(point => {
    if (status) point.status = status;
    if (group) point.group = group;
    point.selected = false;
  });

  // Update UI
  filterPoints(store.currentFilter);
  updatePointsList();
  updateStatistics();
  toggleModal('bulkEditModal', false);
  showToast(`Updated ${selectedPoints.length} points`);
}
