// UI event handlers and state management
import { addMarker } from './map-init.js';
import {
    debounce,
    sanitizeInput,
    Pagination,
    UndoRedoManager,
    Validator,
    PerformanceMonitor
} from './utils.js';

/** @type {Array<MapPoint>} */
let points = [];
let currentFilter = 'all';
let currentGroupFilter = null;
let pagination = new Pagination([]);
let undoRedoManager = new UndoRedoManager();
let performanceMonitor = new PerformanceMonitor();

// Initialize UI handlers
export function initUIHandlers() {
    try {
        performanceMonitor.start('initUIHandlers');

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

        // Search input with debouncing
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', debounce((e) => {
                const query = sanitizeInput(e.target.value.toLowerCase());
                searchPoints(query);
            }, 300));
        }

        // Sort select
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                sortPoints(e.target.value);
            });
        }

        // Pagination controls
        const prevPageBtn = document.getElementById('prevPageBtn');
        const nextPageBtn = document.getElementById('nextPageBtn');
        if (prevPageBtn && nextPageBtn) {
            prevPageBtn.addEventListener('click', () => {
                pagination.setPage(pagination.currentPage - 1);
                updatePointsList();
            });
            nextPageBtn.addEventListener('click', () => {
                pagination.setPage(pagination.currentPage + 1);
                updatePointsList();
            });
        }

        // Undo/Redo buttons
        const undoBtn = document.getElementById('undoBtn');
        const redoBtn = document.getElementById('redoBtn');
        if (undoBtn && redoBtn) {
            undoBtn.addEventListener('click', handleUndo);
            redoBtn.addEventListener('click', handleRedo);
        }

        // Form submission
        const pointDataForm = document.getElementById('pointDataForm');
        if (pointDataForm) {
            pointDataForm.addEventListener('submit', handlePointSubmit);
        }

        // Initialize offline detection
        initOfflineDetection();

        const duration = performanceMonitor.end('initUIHandlers');
        console.debug(`UI Handlers initialized in ${duration}ms`);
    } catch (error) {
        console.error('Error initializing UI handlers:', error);
        showToast('Error initializing UI handlers');
    }
}

// Handle point form submission
async function handlePointSubmit(e) {
    e.preventDefault();
    performanceMonitor.start('handlePointSubmit');

    try {
        const formData = {
            id: document.getElementById('pointId').value || Date.now().toString(),
            name: document.getElementById('pointName').value,
            status: document.getElementById('pointStatus').value,
            description: document.getElementById('pointDescription').value,
            group: document.getElementById('pointGroup').value,
            latlng: window.currentLatLng,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        // Validate point data
        const errors = Validator.validatePoint(formData);
        if (errors.length > 0) {
            errors.forEach(error => {
                showToast(`${error.field}: ${error.message}`, 5000);
            });
            return;
        }

        // Add custom fields
        const customFields = {};
        document.querySelectorAll('#customFieldsContainer input').forEach(input => {
            customFields[input.name] = input.value;
        });
        formData.customFields = customFields;

        // Begin undo group for the save operation
        undoRedoManager.beginGroup();

        // Save point
        const success = await savePoint(formData);
        if (success) {
            // End undo group
            undoRedoManager.endGroup();

            // Update UI
            hidePointForm();
            updatePointsList();
            updateStatistics();
            showToast('Point saved successfully');
        }
    } catch (error) {
        console.error('Error saving point:', error);
        showToast('Error saving point: ' + error.message);
    } finally {
        const duration = performanceMonitor.end('handlePointSubmit');
        console.debug(`Point submission handled in ${duration}ms`);
    }
}

// Search points with performance monitoring
function searchPoints(query) {
    performanceMonitor.start('searchPoints');
    try {
        const filteredPoints = points.filter(point =>
            point.name.toLowerCase().includes(query) ||
            point.description.toLowerCase().includes(query) ||
            point.group.toLowerCase().includes(query)
        );

        pagination.setItems(filteredPoints);
        updatePointsList();
    } catch (error) {
        console.error('Error searching points:', error);
        showToast('Error searching points');
    } finally {
        const duration = performanceMonitor.end('searchPoints');
        console.debug(`Search completed in ${duration}ms`);
    }
}

// Sort points with performance monitoring
function sortPoints(sortBy) {
    performanceMonitor.start('sortPoints');
    try {
        const sortedPoints = [...points].sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'status':
                    return a.status.localeCompare(b.status);
                case 'group':
                    return (a.group || '').localeCompare(b.group || '');
                case 'date':
                    return b.createdAt - a.createdAt;
                default:
                    return 0;
            }
        });

        pagination.setItems(sortedPoints);
        updatePointsList();
    } catch (error) {
        console.error('Error sorting points:', error);
        showToast('Error sorting points');
    } finally {
        const duration = performanceMonitor.end('sortPoints');
        console.debug(`Sort completed in ${duration}ms`);
    }
}

// Update UI elements with performance monitoring
function updateUI() {
    performanceMonitor.start('updateUI');
    try {
        updatePointsList();
        updateStatistics();
        updateMapMarkers();

        // Update undo/redo buttons
        const undoBtn = document.getElementById('undoBtn');
        const redoBtn = document.getElementById('redoBtn');
        if (undoBtn) undoBtn.disabled = !undoRedoManager.canUndo();
        if (redoBtn) redoBtn.disabled = !undoRedoManager.canRedo();
    } catch (error) {
        console.error('Error updating UI:', error);
        showToast('Error updating UI');
    } finally {
        const duration = performanceMonitor.end('updateUI');
        console.debug(`UI updated in ${duration}ms`);
    }
}

// Update points list with pagination and performance monitoring
export function updatePointsList() {
    performanceMonitor.start('updatePointsList');
    try {
        const container = document.getElementById('pointsListContent');
        const currentPoints = pagination.getCurrentPage();
        const pageInfo = pagination.getPageInfo();

        container.innerHTML = currentPoints.map(point => `
            <div class="point-item" data-id="${point.id}">
                <h4>${sanitizeInput(point.name)}</h4>
                <p>Status: ${sanitizeInput(point.status)}</p>
                ${point.group ? `<p>Group: ${sanitizeInput(point.group)}</p>` : ''}
                <p>Created: ${new Date(point.createdAt).toLocaleString()}</p>
                <button onclick="editPoint('${point.id}')">Edit</button>
                <button onclick="deletePoint('${point.id}')">Delete</button>
            </div>
        `).join('');

        // Update pagination controls
        const pageInfoElement = document.getElementById('pageInfo');
        if (pageInfoElement) {
            pageInfoElement.textContent = `Page ${pageInfo.currentPage} of ${pageInfo.totalPages}`;
        }

        // Update pagination buttons
        const prevPageBtn = document.getElementById('prevPageBtn');
        const nextPageBtn = document.getElementById('nextPageBtn');
        if (prevPageBtn) prevPageBtn.disabled = !pageInfo.hasPreviousPage;
        if (nextPageBtn) nextPageBtn.disabled = !pageInfo.hasNextPage;
    } catch (error) {
        console.error('Error updating points list:', error);
        showToast('Error updating points list');
    } finally {
        const duration = performanceMonitor.end('updatePointsList');
        console.debug(`Points list updated in ${duration}ms`);
    }
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

// Save point to storage
async function savePoint(pointData) {
    try {
        // Validate required fields
        if (!pointData.name || !pointData.latlng) {
            throw new Error('Name and location are required');
        }

        // Check if point exists
        const existingIndex = points.findIndex(p => p.id === pointData.id);
        
        if (existingIndex >= 0) {
            // Update existing point
            points[existingIndex] = pointData;
        } else {
            // Add new point
            points.push(pointData);
        }

        // Save to localStorage
        localStorage.setItem('mapPoints', JSON.stringify(points));

        // Update map
        markers.clearLayers();
        points.forEach(point => addMarker(point.latlng, point));

        return true;
    } catch (error) {
        console.error('Error saving point:', error);
        showToast('Error saving point: ' + error.message);
        return false;
    }
}

// Edit existing point
export function editPoint(pointId) {
    const point = points.find(p => p.id === pointId);
    if (!point) {
        showToast('Point not found');
        return;
    }

    // Populate form
    document.getElementById('pointId').value = point.id;
    document.getElementById('pointName').value = point.name;
    document.getElementById('pointStatus').value = point.status;
    document.getElementById('pointDescription').value = point.description || '';
    document.getElementById('pointGroup').value = point.group || '';
    window.currentLatLng = point.latlng;

    // Show form
    showPointForm();
}

// Delete point
export function deletePoint(pointId) {
    if (!confirm('Are you sure you want to delete this point?')) {
        return;
    }

    try {
        const index = points.findIndex(p => p.id === pointId);
        if (index >= 0) {
            points.splice(index, 1);
            localStorage.setItem('mapPoints', JSON.stringify(points));
            
            // Update UI
            markers.clearLayers();
            points.forEach(point => addMarker(point.latlng, point));
            updatePointsList();
            updateStatistics();
            showToast('Point deleted successfully');
        }
    } catch (error) {
        console.error('Error deleting point:', error);
        showToast('Error deleting point');
    }
}
