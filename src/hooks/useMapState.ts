import { useState, useCallback } from 'react';
import { MapState } from '../types/map.types';

const DEFAULT_CENTER: [number, number] = [0, 0];
const DEFAULT_ZOOM = 2;

export const useMapState = () => {
  const [mapState, setMapState] = useState<MapState>({
    center: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
  });

  const updateMapState = useCallback((newState: Partial<MapState>) => {
    setMapState((prev) => ({
      ...prev,
      ...newState,
    }));
  }, []);

  return {
    center: mapState.center,
    zoom: mapState.zoom,
    setMapState: updateMapState,
  };
}; 