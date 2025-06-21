import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { DataExport } from '../components/controls/data-export';
import { MapPoint } from '../types/map.types';

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
          properties: {
            zeroValue: 0,
            falseValue: false,
          },
        },
      ];

      const captured: string[] = [];

      // Mock Blob to intercept CSV data
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

      // @ts-expect-error: MockBlob used for testing
      global.Blob = MockBlob as unknown as typeof Blob;
      // @ts-expect-error override for readonly property during test
      global.URL.createObjectURL = createObjectURL;
      // @ts-expect-error revokeObjectURL mocked for test
      global.URL.revokeObjectURL = revokeObjectURL;

      const { getByTitle } = render(<DataExport points={points} />);
      fireEvent.click(getByTitle('Export as CSV'));

      const csvContent = captured[0];

      // Verify CSV header and row values
      expect(csvContent).toContain('id,latitude,longitude,zeroValue,falseValue');
      const dataRow = csvContent.trim().split('\n')[1];
      expect(dataRow).toBe('1,10,20,0,false');
    } finally {
      global.Blob = originalBlob;
      // @ts-expect-error restore original after test
      global.URL.createObjectURL = originalCreateObjectURL;
      // @ts-expect-error restore original after test
      global.URL.revokeObjectURL = originalRevokeObjectURL;
    }
  });
});
