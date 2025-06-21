import { useState } from 'react';
import { MapPoint } from '../types/map.types';

export const usePointState = () => {
  const [points, setPoints] = useState<MapPoint[]>([]);
  const [currentFilter, setCurrentFilter] = useState<string>('all');
  const [currentGroupFilter, setCurrentGroupFilter] = useState<string | null>(null);

  const addPoint = (point: MapPoint): void => {
    setPoints(prev => [...prev, point]);
  };

  const removePoint = (id: string): void => {
    setPoints(prev => prev.filter(p => p.id !== id));
  };

  return {
    points,
    addPoint,
    removePoint,
    setPoints,
    currentFilter,
    setCurrentFilter,
    currentGroupFilter,
    setCurrentGroupFilter,
  };
};
