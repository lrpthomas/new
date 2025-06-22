import { useCallback, useContext } from 'react';
import { MapPoint } from '../types/map.types';
import { MapStoreContext } from '../store';

export const usePointState = () => {
  const { state, dispatch } = useContext(MapStoreContext);

  const addPoint = useCallback(
    (point: MapPoint): void => {
      dispatch({ type: 'ADD_POINT', payload: point });
    },
    [dispatch]
  );

  const removePoint = useCallback(
    (id: string): void => {
      dispatch({ type: 'REMOVE_POINT', payload: id });
    },
    [dispatch]
  );

  const setPoints = useCallback(
    (points: MapPoint[]): void => {
      dispatch({ type: 'SET_POINTS', payload: points });
    },
    [dispatch]
  );

  const setCurrentFilter = useCallback(
    (filter: string): void => {
      dispatch({ type: 'SET_FILTER', payload: filter });
    },
    [dispatch]
  );

  const setCurrentGroupFilter = useCallback(
    (group: string | null): void => {
      dispatch({ type: 'SET_GROUP_FILTER', payload: group });
    },
    [dispatch]
  );

  return {
    points: state.points,
    addPoint,
    removePoint,
    setPoints,
    currentFilter: state.currentFilter,
    setCurrentFilter,
    currentGroupFilter: state.currentGroupFilter,
    setCurrentGroupFilter,
  };
};

