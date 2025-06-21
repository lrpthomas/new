export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description: string;
  /** Marker icon color in hex or CSS color name */
  color?: string;
  properties?: Record<string, any>;
}

export interface MapState {
  points: MapPoint[];
  selectedPoint: MapPoint | null;
  center: Position;
  zoom: number;
  isLoading: boolean;
  error: string | null;
}

export interface MapViewState {
  center: Position;
  zoom: number;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export type LatLngBounds = MapBounds;

export interface Position {
  lat: number;
  lng: number;
}

export type LatLng = Position;

export type PointStatus = 'active' | 'pending' | 'completed' | 'delayed' | 'inactive';

export interface PaginationOptions {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

export interface MapPoint {
  id: string;
  position: Position;
  properties: Record<string, any>;
  name?: string;
  status?: PointStatus;
  description?: string;
  group?: string;
  customFields?: Record<string, string>;
  createdAt?: number;
  updatedAt?: number;
  selected?: boolean;
}

export interface GeoJSONFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  properties: Record<string, any>;
}

export interface GeoJSONFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

export interface CSVRow {
  [key: string]: string;
}

export interface MapError {
  message: string;
  code: string;
  details?: any;
}

export interface MapValidationError extends MapError {
  field?: string;
  value?: any;
}

export interface DataProcessingResult<T> {
  data: T;
  warnings: string[];
  errors: MapError[];
}
