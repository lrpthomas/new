// Integration tests for UI handlers
import {
  initUIHandlers,
  showPointForm,
  hidePointForm,
  filterPoints,
  togglePointSelection,
  updateMapMarkers,
} from '../ui-handlers.js';
import { addMarker, clearMarkers } from '../map-init.js';
import { toggleModal } from '../modals.js';
import { store } from '../store.js';

// Mock DOM elements
document.body.innerHTML = `
    <div id="addPointBtn"></div>
    <div class="status-filter">
        <button data-status="all"></button>
        <button data-status="active"></button>
    </div>
    <form id="pointDataForm">
        <input id="pointId" />
        <input id="pointName" />
        <input id="pointStatus" />
        <input id="pointDescription" />
        <input id="pointGroup" />
    </form>
    <div id="pointsListContent"></div>
    <div id="searchInput"></div>
    <select id="sortSelect"></select>
    <button id="prevPageBtn"></button>
    <button id="nextPageBtn"></button>
    <div id="pageInfo"></div>
    <button id="undoBtn"></button>
    <button id="redoBtn"></button>
`;

// Mock map functions
jest.mock('../map-init.js', () => ({
  addMarker: jest.fn(),
  clearMarkers: jest.fn(),
}));

describe('UI Handlers', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Reset DOM
    document.getElementById('pointDataForm').reset();
    document.getElementById('pointsListContent').innerHTML = '';
  });

  describe('initUIHandlers', () => {
    it('should initialize all event listeners', () => {
      const addPointBtn = document.getElementById('addPointBtn');
      const statusFilterBtn = document.querySelector('.status-filter button');
      const pointDataForm = document.getElementById('pointDataForm');

      initUIHandlers();

      // Test add point button
      addPointBtn.click();
      expect(window.isAddingPoint).toBe(true);

      // Test status filter
      statusFilterBtn.click();
      expect(store.currentFilter).toBe('all');

      // Test form submission
      const submitEvent = new Event('submit');
      pointDataForm.dispatchEvent(submitEvent);
    });
  });

  describe('showPointForm', () => {
    it('should show form with correct title', () => {
      const latlng = { lat: 0, lng: 0 };
      showPointForm(latlng);

      const form = document.getElementById('pointForm');
      const title = document.getElementById('pointFormTitle');

      expect(form.style.display).toBe('block');
      expect(title.textContent).toBe('Add Point');
      expect(window.currentLatLng).toBe(latlng);
    });
  });

  describe('hidePointForm', () => {
    it('should hide form and reset state', () => {
      window.isAddingPoint = true;
      window.currentLatLng = { lat: 0, lng: 0 };

      hidePointForm();

      const form = document.getElementById('pointForm');
      expect(form.style.display).toBe('none');
      expect(window.isAddingPoint).toBe(false);
      expect(window.currentLatLng).toBeNull();
    });
  });

  describe('filterPoints', () => {
    it('should filter points by status', () => {
      const points = [
        { id: 1, status: 'active', latlng: { lat: 0, lng: 0 } },
        { id: 2, status: 'pending', latlng: { lat: 1, lng: 1 } },
      ];

      filterPoints('active');

      expect(addMarker).toHaveBeenCalledTimes(1);
      expect(addMarker).toHaveBeenCalledWith(
        { lat: 0, lng: 0 },
        expect.objectContaining({ status: 'active' })
      );
    });

    it('should update active class on status buttons', () => {
      const allBtn = document.querySelector('[data-status="all"]');
      const activeBtn = document.querySelector('[data-status="active"]');

      filterPoints('active');

      expect(activeBtn.classList.contains('active')).toBe(true);
      expect(allBtn.classList.contains('active')).toBe(false);
    });
  });

  describe('searchPoints', () => {
    it('should filter points by search query', () => {
      const searchInput = document.getElementById('searchInput');
      searchInput.value = 'test';

      const inputEvent = new Event('input');
      searchInput.dispatchEvent(inputEvent);

      // Wait for debounce
      setTimeout(() => {
        const pointsList = document.getElementById('pointsListContent');
        expect(pointsList.children.length).toBe(0); // No matches
      }, 400);
    });
  });

  describe('sortPoints', () => {
    it('should sort points by selected criteria', () => {
      const sortSelect = document.getElementById('sortSelect');
      sortSelect.value = 'name';

      const changeEvent = new Event('change');
      sortSelect.dispatchEvent(changeEvent);

      const pointsList = document.getElementById('pointsListContent');
      expect(pointsList.children.length).toBe(0); // Empty list
    });
  });

  describe('pagination', () => {
    it('should handle page navigation', () => {
      const prevPageBtn = document.getElementById('prevPageBtn');
      const nextPageBtn = document.getElementById('nextPageBtn');

      nextPageBtn.click();
      expect(store.pagination.currentPage).toBe(2);

      prevPageBtn.click();
      expect(store.pagination.currentPage).toBe(1);
    });
  });

  describe('undo/redo', () => {
    it('should handle undo/redo operations', () => {
      const undoBtn = document.getElementById('undoBtn');
      const redoBtn = document.getElementById('redoBtn');

      // Add a point
      const point = { id: 1, name: 'Test Point' };
      store.addPoint(point);

      // Undo
      undoBtn.click();
      expect(store.points.length).toBe(0);

      // Redo
      redoBtn.click();
      expect(store.points.length).toBe(1);
    });
  });

  describe('togglePointSelection', () => {
    it('should set the selected property of the point', () => {
      const point = { id: 'id', name: 'Test Point', selected: false };
      store.points = [point];

      togglePointSelection('id', true);

      expect(point.selected).toBe(true);
    });
  });

  describe('modal focus management', () => {
    it('should focus first element on open and restore focus on close', () => {
      document.body.innerHTML += `
                <button id="beforeBtn">Before</button>
                <div id="testModal" class="modal" role="dialog" tabindex="-1">
                    <button id="firstBtn">First</button>
                    <button id="secondBtn">Second</button>
                </div>
            `;

      const beforeBtn = document.getElementById('beforeBtn');
      beforeBtn.focus();

      toggleModal('testModal', true);
      expect(document.activeElement).toBe(document.getElementById('firstBtn'));

      toggleModal('testModal', false);
      expect(document.activeElement).toBe(beforeBtn);
    });
  });

  describe('updateMapMarkers', () => {
    it('clears existing markers and adds markers for all points', () => {
      store.points = [
        { id: '1', latlng: { lat: 0, lng: 0 } },
        { id: '2', latlng: { lat: 1, lng: 1 } },
      ];

      updateMapMarkers();

      expect(clearMarkers).toHaveBeenCalled();
      expect(addMarker).toHaveBeenCalledTimes(2);
      expect(addMarker).toHaveBeenCalledWith({ lat: 0, lng: 0 }, store.points[0]);
      expect(addMarker).toHaveBeenCalledWith({ lat: 1, lng: 1 }, store.points[1]);
    });
  });
});
