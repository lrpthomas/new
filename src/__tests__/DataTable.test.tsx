import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { DataTable } from '../components/controls/data-table';
import { createMapPoint } from '../types';

jest.mock('react-window', () => {
  return {
    FixedSizeList: ({
      height,
      itemCount,
      itemSize,
      children,
      outerElementType: Outer = 'div',
    }: any) => {
      const visibleCount = Math.floor(height / itemSize);
      const items = Array.from({ length: Math.min(itemCount, visibleCount) }, (_, index) =>
        children({ index, style: {} })
      );
      return React.createElement(Outer, null, items);
    },
  };
});

describe('DataTable filtering', () => {
  const points = [
    createMapPoint({ id: '1', position: { lat: 0, lng: 0 }, properties: { name: 'Alpha' } }),
    createMapPoint({ id: '2', position: { lat: 1, lng: 1 }, properties: { name: 'Beta' } }),
  ];

  it('filters rows based on text input', () => {
    const { getByPlaceholderText, queryByText } = render(<DataTable points={points} />);
    const input = getByPlaceholderText('Filter points...');
    fireEvent.change(input, { target: { value: 'beta' } });
    expect(queryByText('1')).not.toBeInTheDocument();
    expect(queryByText('2')).toBeInTheDocument();
  });
});

describe('DataTable sorting', () => {
  const points = [
    createMapPoint({ id: '1', position: { lat: 0, lng: 0 }, properties: { name: 'Charlie' } }),
    createMapPoint({ id: '2', position: { lat: 0, lng: 1 }, properties: { name: 'Alpha' } }),
    createMapPoint({ id: '3', position: { lat: 0, lng: 2 }, properties: { name: 'Bravo' } }),
  ];

  it('sorts rows by column when header clicked', () => {
    const { getAllByRole, getByText } = render(<DataTable points={points} />);
    const nameHeader = getByText('name');
    fireEvent.click(nameHeader);
    let rows = getAllByRole('row');
    expect(rows[1].textContent).toContain('2');
    fireEvent.click(nameHeader);
    rows = getAllByRole('row');
    expect(rows[1].textContent).toContain('1');
  });
});

describe('DataTable virtualization', () => {
  const points = Array.from({ length: 20 }, (_, i) => 
    createMapPoint({ id: String(i + 1), position: { lat: 0, lng: 0 }, properties: {} })
  );

  it('renders only visible rows', () => {
    const { getAllByRole } = render(<DataTable points={points} />);
    const rows = getAllByRole('row');
    expect(rows).toHaveLength(11); // 10 visible + header
  });
});
