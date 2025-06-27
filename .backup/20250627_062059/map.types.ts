// Unified type definitions - resolving auto agent conflicts
export interface Position {
  lat: number;
  lng: number;
}

export type LatLng = Position;

export interface MapPoint {
  id: string;
  name?: string;
  description?: string;
  status?: 'active' | 'pending' | 'completed' | 'delayed' | 'inactive';
  group?: string;
  position: Position;
  latlng: LatLng; // For backward compatibility
  properties: Record<string, any>;
  createdAt?: number;
  updatedAt?: number;
  selected?: boolean;
  color?: string;
}

export interface MapMarker extends MapPoint {
  title: string;
}

export interface GeoJSONFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: Record<string, any>;
}

export interface CSVRow {
  [key: string]: string;
}

export interface MapError {
  message: string;
  code: string;
  details?: any;
}

export interface DataProcessingResult<T> {
  data: T;
  warnings: string[];
  errors: MapError[];
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface MapViewState {
  center: Position;
  zoom: number;
}

export interface MapState {
  points: MapPoint[];
  selectedPoint: MapPoint | null;
  center: Position;
  zoom: number;
  isLoading: boolean;
  error: string | null;
}
