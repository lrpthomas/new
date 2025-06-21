import React, { createContext, useReducer, ReactNode, Dispatch } from 'react';
import { MapViewState, MapPoint } from '../types/map.types';

interface MapStoreState {
  mapView: MapViewState;
  points: MapPoint[];
  currentFilter: string;
  currentGroupFilter: string | null;
}

type MapStoreAction =
  | { type: 'SET_MAP_VIEW'; payload: Partial<MapViewState> }
  | { type: 'ADD_POINT'; payload: MapPoint }
  | { type: 'REMOVE_POINT'; payload: string }
  | { type: 'SET_POINTS'; payload: MapPoint[] }
  | { type: 'SET_FILTER'; payload: string }
  | { type: 'SET_GROUP_FILTER'; payload: string | null };

const DEFAULT_CENTER = { lat: 0, lng: 0 };
const DEFAULT_ZOOM = 2;

const initialState: MapStoreState = {
  mapView: { center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM },
  points: [],
  currentFilter: 'all',
  currentGroupFilter: null,
};

const MapStoreContext = createContext<{
  state: MapStoreState;
  dispatch: Dispatch<MapStoreAction>;
}>({ state: initialState, dispatch: () => undefined });

function reducer(state: MapStoreState, action: MapStoreAction): MapStoreState {
  switch (action.type) {
    case 'SET_MAP_VIEW':
      return { ...state, mapView: { ...state.mapView, ...action.payload } };
    case 'ADD_POINT':
      return { ...state, points: [...state.points, action.payload] };
    case 'REMOVE_POINT':
      return { ...state, points: state.points.filter(p => p.id !== action.payload) };
    case 'SET_POINTS':
      return { ...state, points: action.payload };
    case 'SET_FILTER':
      return { ...state, currentFilter: action.payload };
    case 'SET_GROUP_FILTER':
      return { ...state, currentGroupFilter: action.payload };
    default:
      return state;
  }
}

interface MapStoreProviderProps {
  children: ReactNode;
}

function MapStoreProvider({ children }: MapStoreProviderProps): React.ReactElement {
  const [state, dispatch] = useReducer(reducer, initialState);
  return React.createElement(
    MapStoreContext.Provider,
    { value: { state, dispatch } },
    children
  );
}

export { MapStoreContext, MapStoreProvider, MapStoreState, MapStoreAction };

