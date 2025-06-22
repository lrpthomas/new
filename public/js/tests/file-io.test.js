import { importFromCSV, importFromGeoJSON, importFromJSON } from '../file-io.js';
import { showToast, updatePointsList, updateStatistics } from '../ui-handlers.js';
import { clearMarkers } from '../map-init.js';
import { store } from '../store.js';

jest.mock('../ui-handlers.js', () => ({
  showToast: jest.fn(),
  updatePointsList: jest.fn(),
  updateStatistics: jest.fn(),
}));

jest.mock('../map-init.js', () => ({
  addMarker: jest.fn(),
  clearMarkers: jest.fn(),
}));

describe('File IO error handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls showToast when CSV parsing fails', () => {
    global.Papa = {
      parse: (_file, options) => {
        options.complete({ data: [], errors: [{ message: 'bad' }] });
      },
    };

    const file = new File(['name,lat,lng\n'], 'points.csv', { type: 'text/csv' });
    importFromCSV(file);
    expect(showToast).toHaveBeenCalledWith(expect.stringContaining('Error importing CSV'));
  });

  it('calls showToast when GeoJSON parsing fails', done => {
    const blob = new Blob(['invalid'], { type: 'application/json' });
    const file = new File([blob], 'points.geojson', { type: 'application/json' });
    importFromGeoJSON(file);
    setTimeout(() => {
      expect(showToast).toHaveBeenCalledWith(expect.stringContaining('Error importing GeoJSON'));
      done();
    }, 0);
  });

  it('calls showToast when JSON parsing fails', done => {
    const blob = new Blob(['invalid'], { type: 'application/json' });
    const file = new File([blob], 'points.json', { type: 'application/json' });
    importFromJSON(file);
    setTimeout(() => {
      expect(showToast).toHaveBeenCalled();
      done();
    }, 0);
  });
});

describe('File IO success updates', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.L = { latLng: (lat, lng) => ({ lat, lng }) };
    store.points = [];
  });

  it('invokes UI updates on CSV import confirm', () => {
    document.body.innerHTML = `
      <div id="csvPreviewModal"></div>
      <div id="csvPreviewTable"></div>
      <select id="latField"></select>
      <select id="lngField"></select>
      <select id="labelField"></select>
      <button id="confirmCsvImportBtn"></button>
    `;

    global.Papa = {
      parse: (_file, options) => {
        options.complete({
          data: [{ latitude: '1', longitude: '2', name: 'test' }],
          errors: [],
        });
      },
    };

    const file = new File(['latitude,longitude,name\n1,2,test'], 'points.csv', { type: 'text/csv' });
    importFromCSV(file);

    document.getElementById('latField').value = 'latitude';
    document.getElementById('lngField').value = 'longitude';
    document.getElementById('labelField').value = 'name';

    document.getElementById('confirmCsvImportBtn').onclick();

    expect(updatePointsList).toHaveBeenCalled();
    expect(updateStatistics).toHaveBeenCalled();
  });

  it('invokes UI updates on JSON import', () => {
    global.FileReader = class {
      readAsText() {
        this.onload({ target: { result: JSON.stringify([{ id: '1', latlng: { lat: 0, lng: 0 } }]) } });
      }
    };

    const blob = new Blob(['[]'], { type: 'application/json' });
    const file = new File([blob], 'points.json', { type: 'application/json' });
    importFromJSON(file);

    expect(clearMarkers).toHaveBeenCalled();
    expect(updatePointsList).toHaveBeenCalled();
    expect(updateStatistics).toHaveBeenCalled();
  });
});
