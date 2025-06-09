import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { DataExport } from '../components/controls/data-export';
import { MapPoint } from '../types/map.types';

describe('DataExport CSV export', () => {
  it('preserves 0 and false values when exporting CSV', async () => {
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

    const createObjectURL = jest.fn(() => 'blob:url');
    const revokeObjectURL = jest.fn();
    // @ts-ignore - assign to readonly property for test
    global.URL.createObjectURL = createObjectURL;
    // @ts-ignore - assign to readonly property for test
    global.URL.revokeObjectURL = revokeObjectURL;

    const { getByTitle } = render(<DataExport points={points} />);
    fireEvent.click(getByTitle('Export as CSV'));

    const blob = createObjectURL.mock.calls[0][0] as Blob;
    const csvContent = await blob.text();

    expect(csvContent).toContain('zeroValue,falseValue');
    expect(csvContent.trim().split('\n')[1]).toBe('1,10,20,0,false');
  });
});
