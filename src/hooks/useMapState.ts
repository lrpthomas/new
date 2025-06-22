import { useCallback, useContext } from 'react';
import { MapViewState } from '../types';
import { MapStoreContext } from '../store';

export const useMapState = () => {
  const { state, dispatch } = useContext(MapStoreContext);

  const updateMapState = useCallback(
    (newState: Partial<MapViewState>) => {
      dispatch({ type: 'SET_MAP_VIEW', payload: newState });
    },
    [dispatch]
  );

  return {
    center: state.mapView.center,
    zoom: state.mapView.zoom,
    setMapState: updateMapState,
  };
};

