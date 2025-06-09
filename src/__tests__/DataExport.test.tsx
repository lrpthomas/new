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

    let csvContent = '';
    let readerPromise: Promise<void> | null = null;
    const createObjectURL = jest.fn((blob: Blob) => {
      readerPromise = new Promise<void>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          csvContent = reader.result as string;
          resolve();
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsText(blob);
      });
      return 'blob:url';
    });
    const revokeObjectURL = jest.fn();
    // @ts-ignore - assign to readonly property for test
    global.URL.createObjectURL = createObjectURL;
    // @ts-ignore - assign to readonly property for test
    global.URL.revokeObjectURL = revokeObjectURL;

    const { getByTitle } = render(<DataExport points={points} />);
    fireEvent.click(getByTitle('Export as CSV'));

    await readerPromise;

    expect(csvContent).toContain('zeroValue,falseValue');
    expect(csvContent.trim().split('\n')[1]).toBe('1,10,20,0,false');
  });
});
