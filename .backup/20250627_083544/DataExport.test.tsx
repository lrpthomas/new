import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DataExport } from '../components/controls/data-export';
import { MapPoint } from '../types';

describe('DataExport CSV export', () => {
  it('preserves 0 and false values when exporting CSV', () => {
    const originalBlob = global.Blob;
    const originalCreateObjectURL = global.URL.createObjectURL;
    const originalRevokeObjectURL = global.URL.revokeObjectURL;

    try {
      const points: MapPoint[] = [
        {
          id: '1',
          position: { lat: 10, lng: 20 },
          latlng: { lat: 10, lng: 20 },
          properties: {
            zeroValue: 0,
            falseValue: false,
          },
        },
      ];

      const captured: string[] = [];

      class MockBlob {
        private data: string;
        constructor(parts: string[]) {
          this.data = parts.join('');
          captured.push(this.data);
        }
        text() {
          return Promise.resolve(this.data);
        }
      }

      const createObjectURL = jest.fn(() => 'blob:url');
      const revokeObjectURL = jest.fn();

      global.Blob = MockBlob as unknown as typeof Blob;
      global.URL.createObjectURL = createObjectURL;
      global.URL.revokeObjectURL = revokeObjectURL;

      const { getByTitle } = render(<DataExport points={points} />);
      fireEvent.click(getByTitle('Export as CSV'));

      const csvContent = captured[0];
      expect(csvContent).toContain('id,latitude,longitude,zeroValue,falseValue');
      const dataRow = csvContent.trim().split('\n')[1];
      expect(dataRow).toBe('1,10,20,0,false');
    } finally {
      global.Blob = originalBlob;
      global.URL.createObjectURL = originalCreateObjectURL;
      global.URL.revokeObjectURL = originalRevokeObjectURL;
    }
  });

  it('should handle empty points array', () => {
    const points: MapPoint[] = [];
    const { getByTitle } = render(<DataExport points={points} />);
    const csvButton = getByTitle('Export as CSV');
    expect(csvButton).toBeDisabled();
  });

  it('should render all export buttons', () => {
    const points: MapPoint[] = [
      {
        id: '1',
        position: { lat: 10, lng: 20 },
        latlng: { lat: 10, lng: 20 },
        properties: { name: 'Test Point' },
      },
    ];

    const { getByTitle } = render(<DataExport points={points} />);
    expect(getByTitle('Export as CSV')).toBeInTheDocument();
    expect(getByTitle('Export as GeoJSON')).toBeInTheDocument();
    expect(getByTitle('Download CSV Template')).toBeInTheDocument();
  });
});
