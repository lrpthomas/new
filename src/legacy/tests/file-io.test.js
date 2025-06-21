import { importFromCSV, importFromGeoJSON } from '../file-io';
import { showToast } from '../ui-handlers';

jest.mock('../ui-handlers', () => ({
  showToast: jest.fn()
}));

describe('File IO error handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls showToast when CSV parsing fails', () => {
    global.Papa = {
      parse: (_file, options) => {
        options.complete({ data: [], errors: [{ message: 'bad' }] });
      }
    };

    const file = new File(['name,lat,lng\n'], 'points.csv', { type: 'text/csv' });
    importFromCSV(file);
    expect(showToast).toHaveBeenCalled();
  });

  it('calls showToast when GeoJSON parsing fails', (done) => {
    const blob = new Blob(['invalid'], { type: 'application/json' });
    const file = new File([blob], 'points.geojson', { type: 'application/json' });
    importFromGeoJSON(file);
    setTimeout(() => {
      expect(showToast).toHaveBeenCalled();
      done();
    }, 0);
  });
});
