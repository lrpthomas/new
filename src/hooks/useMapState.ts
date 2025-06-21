import { useState, useCallback } from 'react';
import { MapViewState } from '../types';

const DEFAULT_CENTER: { lat: number; lng: number } = { lat: 0, lng: 0 };
const DEFAULT_ZOOM = 2;

export const useMapState = () => {
  const [mapState, setMapState] = useState<MapViewState>({
    center: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
  });

  const updateMapState = useCallback((newState: Partial<MapViewState>) => {
    setMapState(prev => ({
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
