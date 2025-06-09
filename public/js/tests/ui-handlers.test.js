// Integration tests for UI handlers
import { initUIHandlers, showPointForm, hidePointForm, filterPoints } from '../ui-handlers.js';
import { addMarker } from '../map-init.js';

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
    addMarker: jest.fn()
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
            expect(currentFilter).toBe('all');

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
                { id: 2, status: 'pending', latlng: { lat: 1, lng: 1 } }
            ];

            filterPoints('active');

            expect(addMarker).toHaveBeenCalledTimes(1);
            expect(addMarker).toHaveBeenCalledWith({ lat: 0, lng: 0 },
                expect.objectContaining({ status: 'active' })
            );
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
            expect(pagination.currentPage).toBe(2);

            prevPageBtn.click();
            expect(pagination.currentPage).toBe(1);
        });
    });

    describe('undo/redo', () => {
        it('should handle undo/redo operations', () => {
            const undoBtn = document.getElementById('undoBtn');
            const redoBtn = document.getElementById('redoBtn');

            // Add a point
            const point = { id: 1, name: 'Test Point' };
            points.push(point);

            // Undo
            undoBtn.click();
            expect(points.length).toBe(0);

            // Redo
            redoBtn.click();
            expect(points.length).toBe(1);
        });
    });
});
