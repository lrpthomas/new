import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MapPrintButton } from '../components/controls/map-print';

describe('MapPrintButton', () => {
  it('calls window.print on click', () => {
    const printSpy = jest.spyOn(window, 'print').mockImplementation(() => {});
    const { getByRole } = render(<MapPrintButton />);
    fireEvent.click(getByRole('button'));
    expect(printSpy).toHaveBeenCalled();
    printSpy.mockRestore();
  });
});
