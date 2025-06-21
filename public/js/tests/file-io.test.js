import { importFromCSV, importFromGeoJSON, importFromJSON } from '../file-io.js';
import { showToast } from '../ui-handlers.js';

jest.mock('../ui-handlers.js', () => ({
  showToast: jest.fn(),
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
