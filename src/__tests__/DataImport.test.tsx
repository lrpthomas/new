import React from 'react';
import { render } from '@testing-library/react';
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
