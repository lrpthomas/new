import { useState } from 'react';
import { MapPoint } from '../types/map.types';

export const usePointsState = (initial: MapPoint[] = []) => {
  const [points, setPoints] = useState<MapPoint[]>(initial);
  const [currentFilter, setCurrentFilter] = useState<string>('all');
  const [currentGroupFilter, setCurrentGroupFilter] = useState<string | null>(null);

  const addPoint = (point: MapPoint) => setPoints(prev => [...prev, point]);

  const removePoint = (id: string) => setPoints(prev => prev.filter(p => p.id !== id));

  return {
    points,
    setPoints,
    addPoint,
    removePoint,
    currentFilter,
    setCurrentFilter,
    currentGroupFilter,
    setCurrentGroupFilter
  };
};

export default usePointsState;
