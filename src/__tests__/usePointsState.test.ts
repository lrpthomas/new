import { renderHook, act } from '@testing-library/react';
import usePointsState from '../hooks/use-points-state';
import { MapPoint } from '../types/map.types';

describe('usePointsState', () => {
  it('adds and removes points', () => {
    const { result } = renderHook(() => usePointsState());
    const point: MapPoint = { id: '1', position: { lat: 0, lng: 0 }, properties: {} };

    act(() => {
      result.current.addPoint(point);
    });

    expect(result.current.points).toHaveLength(1);

    act(() => {
      result.current.removePoint('1');
    });

    expect(result.current.points).toHaveLength(0);
  });
});
