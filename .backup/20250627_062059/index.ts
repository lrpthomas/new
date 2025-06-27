// MP-AGENT: Complete unified type system - ALL exports in one place
export * from './map.types';

// Additional types for full compatibility
export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  createdAt?: number;
  updatedAt?: number;
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

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description: string;
  color?: string;
  properties?: Record<string, any>;
}

export interface MapViewState {
  center: Position;
  zoom: number;
}

// Re-export everything from map.types for full compatibility
export type {
  Position,
  LatLng,
  PointStatus,
  MapPoint,
  MapState,
  MapBounds,
  LatLngBounds,
  PaginationOptions,
  DataProcessingResult,
  PointAction,
  FilterOptions,
  SearchResult,
  ValidationError,
  ApiResponse,
  BulkOperation,
  ExportOptions,
  ImportResult,
  UndoRedoState,
  MapConfig,
  CacheConfig,
  RateLimitConfig,
  AppConfig,
  ErrorSeverity,
  ErrorCategory,
  ApplicationError,
  RequiredMapPoint,
  CreateMapPointInput,
  UpdateMapPointInput,
  CacheItem,
  MapComponentProps,
  DataTableProps,
  MapClickEvent,
  MarkerDragEvent
} from './map.types';

// Enhanced createMapPoint helper
export function createMapPoint(data: Partial<MapPoint>): MapPoint {
  const now = Date.now();
  const position = data.position || data.latlng || { lat: 0, lng: 0 };
  
  return {
    id: data.id || `point-${now}`,
    name: data.name || 'Unnamed Point',
    status: data.status || 'active',
    latlng: position,
    position: position,
    properties: data.properties || {},
    description: data.description || '',
    group: data.group || '',
    customFields: data.customFields || {},
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now,
    selected: data.selected || false
  };
}
