import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DataImport } from '../components/controls/data-import';

jest.mock('../hooks/useDataProcessing');

import { useDataProcessing } from '../hooks/useDataProcessing';

const mockedUseDataProcessing = useDataProcessing as jest.MockedFunction<typeof useDataProcessing>;

describe('DataImport warnings display', () => {
  it('renders warnings when provided', () => {
    mockedUseDataProcessing.mockReturnValue({
      processCSV: jest.fn(),
      processGeoJSON: jest.fn(),
      addPoint: jest.fn(),
      updatePoint: jest.fn(),
      deletePoint: jest.fn(),
      points: [],
      errors: [],
      warnings: ['Sample warning'],
      isLoading: false,
    });

    const { getByText } = render(<DataImport />);
    expect(getByText('Sample warning')).toBeInTheDocument();
  });
});

describe('DataImport error handling', () => {
  it('calls onError when CSV processing returns errors', async () => {
    const mockProcessCSV = jest.fn().mockResolvedValue({
      data: [],
      warnings: [],
      errors: [{ message: 'bad csv', code: 'CSV_ERROR' }],
    });
    mockedUseDataProcessing.mockReturnValue({
      processCSV: mockProcessCSV,
      processGeoJSON: jest.fn(),
      addPoint: jest.fn(),
      updatePoint: jest.fn(),
      deletePoint: jest.fn(),
      points: [],
      errors: [],
      warnings: [],
      isLoading: false,
    });

    const onError = jest.fn();
    const { getByLabelText } = render(<DataImport onError={onError} />);
    const input = getByLabelText(/drop your file/i) as HTMLInputElement;
    const file = new File(['id,name\n1,a'], 'points.csv', { type: 'text/csv' });
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(expect.objectContaining({ message: 'bad csv' }));
    });
  });

  it('calls onError for unsupported file types', async () => {
    mockedUseDataProcessing.mockReturnValue({
      processCSV: jest.fn(),
      processGeoJSON: jest.fn(),
      addPoint: jest.fn(),
      updatePoint: jest.fn(),
      deletePoint: jest.fn(),
      points: [],
      errors: [],
      warnings: [],
      isLoading: false,
    });

    const onError = jest.fn();
    const { getByLabelText } = render(<DataImport onError={onError} />);
    const input = getByLabelText(/drop your file/i) as HTMLInputElement;
    const file = new File(['test'], 'data.txt', { type: 'text/plain' });
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(onError).toHaveBeenCalled();
    });
  });
});
