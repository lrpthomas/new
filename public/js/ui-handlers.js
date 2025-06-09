// UI event handlers and state management
import { addMarker } from './map-init.js';

let points = [];
let currentFilter = 'all';
let currentGroupFilter = null;

// Initialize UI handlers
export function initUIHandlers() {
    // Add point button
    const addPointBtn = document.getElementById('addPointBtn');
    if (addPointBtn) {
        addPointBtn.addEventListener('click', () => {
            window.isAddingPoint = true;
            showToast('Click on the map to add a point');
        });
    }

    // Status filter buttons
    document.querySelectorAll('.status-filter button').forEach(button => {
        button.addEventListener('click', (e) => {
            const status = e.target.dataset.status || 'all';
            filterPoints(status);
        });
    });

    // Form submission
    const pointDataForm = document.getElementById('pointDataForm');
    if (pointDataForm) {
        pointDataForm.addEventListener('submit', handlePointSubmit);
    }

    // Initialize offline detection
    initOfflineDetection();
}

// Show/hide point form
export function showPointForm(latlng = null) {
    const form = document.getElementById('pointForm');
    const title = document.getElementById('pointFormTitle');

    if (latlng) {
        title.textContent = 'Add Point';
        document.getElementById('pointId').value = '';
        document.getElementById('pointDataForm').reset();
        window.currentLatLng = latlng;
    }

    form.style.display = 'block';
}

export function hidePointForm() {
    document.getElementById('pointForm').style.display = 'none';
    window.isAddingPoint = false;
    window.currentLatLng = null;
}

// Handle point form submission
async function handlePointSubmit(e) {
    e.preventDefault();

    const formData = {
        id: document.getElementById('pointId').value || Date.now().toString(),
        name: document.getElementById('pointName').value,
        status: document.getElementById('pointStatus').value,
        description: document.getElementById('pointDescription').value,
        group: document.getElementById('pointGroup').value,
        latlng: window.currentLatLng
    };

    // Add custom fields
    const customFields = {};
    document.querySelectorAll('#customFieldsContainer input').forEach(input => {
        customFields[input.name] = input.value;
    });
    formData.customFields = customFields;

    // Save point
    await savePoint(formData);

    // Update UI
    hidePointForm();
    updatePointsList();
    updateStatistics();
    showToast('Point saved successfully');
}

// Filter points by status
export function filterPoints(status) {
    currentFilter = status;

    // Update active button
    document.querySelectorAll('.status-filter button').forEach(button => {
        button.classList.toggle('active',
            button.getAttribute('onclick').includes(status));
    });

    // Filter markers
    markers.clearLayers();
    points.filter(point => {
        if (status === 'all') return true;
        if (currentGroupFilter) return point.group === currentGroupFilter;
        return point.status === status;
    }).forEach(point => {
        addMarker(point.latlng, point);
    });
}

// Show toast message
export function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.display = 'block';

    setTimeout(() => {
        toast.style.display = 'none';
    }, duration);
}

// Initialize offline detection
function initOfflineDetection() {
    const banner = document.getElementById('offlineBanner');

    window.addEventListener('online', () => {
        banner.style.display = 'none';
        showToast('Back online');
    });

    window.addEventListener('offline', () => {
        banner.style.display = 'block';
        showToast('You are offline. Changes saved locally.');
    });
}

// Update points list
export function updatePointsList() {
    const container = document.getElementById('pointsListContent');
    container.innerHTML = points.map(point => `
        <div class="point-item">
            <h4>${point.name}</h4>
            <p>Status: ${point.status}</p>
            ${point.group ? `<p>Group: ${point.group}</p>` : ''}
            <button onclick="editPoint('${point.id}')">Edit</button>
            <button onclick="deletePoint('${point.id}')">Delete</button>
        </div>
    `).join('');
}

// Update statistics
export function updateStatistics() {
    const stats = {
        total: points.length,
        active: points.filter(p => p.status === 'active').length,
        pending: points.filter(p => p.status === 'pending').length,
        completed: points.filter(p => p.status === 'completed').length,
        delayed: points.filter(p => p.status === 'delayed').length,
        inactive: points.filter(p => p.status === 'inactive').length,
        groups: new Set(points.map(p => p.group).filter(Boolean)).size
    };
    
    Object.entries(stats).forEach(([key, value]) => {
        const element = document.getElementById(`${key}Points`);
        if (element) element.textContent = value;
    });
}