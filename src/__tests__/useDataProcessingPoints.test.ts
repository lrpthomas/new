import { renderHook, act } from '@testing-library/react';
import { useDataProcessing } from '../hooks/useDataProcessing';

describe('useDataProcessing point mutations', () => {
  it('addPoint adds a point to state', () => {
    const { result } = renderHook(() => useDataProcessing());

    act(() => {
      result.current.addPoint({ lat: 10, lng: 20 }, { name: 'Test' });
    });

    expect(result.current.points).toHaveLength(1);
    expect(result.current.points[0].position).toEqual({ lat: 10, lng: 20 });
    expect(result.current.points[0].properties).toEqual({ name: 'Test' });
  });

  it('deletePoint removes a point from state', () => {
    const { result } = renderHook(() => useDataProcessing());

    let idToDelete = '';

    act(() => {
      const p1 = result.current.addPoint({ lat: 0, lng: 0 });
      idToDelete = p1.id;
      result.current.addPoint({ lat: 1, lng: 1 });
    });

    expect(result.current.points).toHaveLength(2);

    act(() => {
      result.current.deletePoint(idToDelete);
    });

    expect(result.current.points).toHaveLength(1);
    expect(result.current.points[0].id).not.toBe(idToDelete);
  });
});
