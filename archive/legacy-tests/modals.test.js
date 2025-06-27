jest.mock('../ui-handlers.js', () => ({
  filterPoints: jest.fn(),
  updatePointsList: jest.fn(),
  updateStatistics: jest.fn(),
  showToast: jest.fn(),
}));
jest.mock('../map-init.js', () => ({
  addMarker: jest.fn(),
  clearMarkers: jest.fn(),
}));

import { applyBulkEdit } from '../modals.js';
import { store } from '../store.js';

describe('applyBulkEdit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = `
      <select id="bulkStatus"></select>
      <input type="text" id="bulkGroup" />
      <div id="bulkEditModal"></div>
    `;
    store.points = [
      {
        id: '1',
        name: 'A',
        status: 'active',
        latlng: { lat: 0, lng: 0 },
        createdAt: 0,
        updatedAt: 0,
        selected: true,
      },
      {
        id: '2',
        name: 'B',
        status: 'pending',
        latlng: { lat: 0, lng: 1 },
        createdAt: 0,
        updatedAt: 0,
        selected: false,
      },
    ];
  });

  it('updates only selected points', () => {
    document.getElementById('bulkStatus').value = 'completed';
    document.getElementById('bulkGroup').value = 'GroupX';

    applyBulkEdit();

    expect(store.points[0].status).toBe('completed');
    expect(store.points[0].group).toBe('GroupX');
    expect(store.points[0].selected).toBe(false);

    expect(store.points[1].status).toBe('pending');
    expect(store.points[1].group).toBeUndefined();
    expect(store.points[1].selected).toBe(false);
  });
});
