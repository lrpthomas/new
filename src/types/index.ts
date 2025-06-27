export * from './map.types';
export * from './user.types';

export type {
  MapPoint,
  Position,
  LatLng,
  PointStatus,
  MapBounds,
  LatLngBounds,
  PaginationOptions,
  GeoJSONFeature,
  GeoJSONFeatureCollection,
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

export function createMapPoint(data: Partial<MapPoint>): MapPoint {
  const now = Date.now();
  const id = data.id || `point-${now}-${Math.random().toString(36).substr(2, 9)}`;
  const position = data.position || { lat: 0, lng: 0 };
  
  return {
    id,
    position,
    latlng: position,
    properties: data.properties || {},
    name: data.name,
    description: data.description,
    status: data.status || 'active',
    group: data.group,
    customFields: data.customFields,
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now,
    selected: data.selected || false
  };
}
