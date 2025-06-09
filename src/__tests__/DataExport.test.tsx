import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { DataExport } from '../components/controls/data-export';
import { MapPoint } from '../types/map.types';

describe('DataExport CSV export', () => {
  it('preserves 0 and false values when exporting CSV', () => {
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

    // @ts-expect-error: MockBlob is used for testing purposes to mimic Blob functionality
    global.Blob = MockBlob as unknown as typeof Blob;
    // @ts-ignore: overriding readonly property
    global.URL.createObjectURL = createObjectURL;
    // @ts-ignore: overriding readonly property
    global.URL.revokeObjectURL = revokeObjectURL;

    const { getByTitle } = render(<DataExport points={points} />);
    fireEvent.click(getByTitle('Export as CSV'));

    const csvContent = captured[0];

    // Validate headers and values
    expect(csvContent).toContain('id,lat,lng,zeroValue,falseValue');
    const dataRow = csvContent.trim().split('\n')[1];
    expect(dataRow).toBe('1,10,20,0,false');
  });
});
