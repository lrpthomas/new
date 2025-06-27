export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description: string;
  color?: string;
  properties?: Record<string, any>;
}

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
  latlng: LatLng; // For backward compatibility
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

export interface GeoJSONFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
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

export interface PointAction {
  type: 'add' | 'edit' | 'delete';
  point: MapPoint;
  oldPoint?: MapPoint;
  newPoint?: MapPoint;
  timestamp: number;
}

export interface FilterOptions {
  status?: PointStatus;
  group?: string;
  searchQuery?: string;
  sortBy?: 'name' | 'status' | 'group' | 'date';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchResult {
  points: MapPoint[];
  total: number;
  pagination: PaginationOptions;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  validationErrors?: ValidationError[];
}

export interface BulkOperation {
  type: 'update' | 'delete';
  pointIds: string[];
  updates?: Partial<MapPoint>;
}

export interface ExportOptions {
  format: 'csv' | 'json' | 'geojson';
  includeFields: (keyof MapPoint)[];
  filter?: FilterOptions;
}

export interface ImportResult {
  success: boolean;
  imported: number;
  failed: number;
  errors: ValidationError[];
}

export interface UndoRedoState {
  canUndo: boolean;
  canRedo: boolean;
  lastAction?: PointAction;
}

export interface MapConfig {
  defaultCenter: LatLng;
  defaultZoom: number;
  maxZoom: number;
  minZoom: number;
  tileLayer: string;
  attribution: string;
}

export interface CacheConfig {
  ttl: number;
  maxSize: number;
  strategy: 'lru' | 'fifo';
}

export interface RateLimitConfig {
  maxRequests: number;
  timeWindow: number;
  strategy: 'sliding' | 'fixed';
}

export interface AppConfig {
  map: MapConfig;
  cache: CacheConfig;
  rateLimit: RateLimitConfig;
  pagination: {
    defaultItemsPerPage: number;
    maxItemsPerPage: number;
  };
  validation: {
    maxNameLength: number;
    maxDescriptionLength: number;
    maxGroupLength: number;
    maxCustomFields: number;
  };
}

export const ErrorSeverity = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
} as const;

export const ErrorCategory = {
  VALIDATION: 'validation',
  NETWORK: 'network',
  STORAGE: 'storage',
  RENDERING: 'rendering',
  USER_INPUT: 'user_input'
} as const;

export type ErrorSeverity = typeof ErrorSeverity[keyof typeof ErrorSeverity];
export type ErrorCategory = typeof ErrorCategory[keyof typeof ErrorCategory];

export interface ApplicationError extends MapError {
  category: ErrorCategory;
  severity: ErrorSeverity;
  timestamp: number;
  context?: Record<string, any>;
}

export interface RequiredMapPoint extends Omit<MapPoint, 'name' | 'description' | 'status' | 'group'> {
  name: string;
  description: string;
  status: PointStatus;
}

export interface CreateMapPointInput {
  position: Position;
  properties?: Record<string, any>;
  name?: string;
  description?: string;
  status?: PointStatus;
  group?: string;
  customFields?: Record<string, string>;
}

export interface UpdateMapPointInput extends Partial<CreateMapPointInput> {
  id?: never;
}

export interface CacheItem<T> {
  value: T;
  timestamp: number;
  ttl: number;
}

export interface MapComponentProps {
  points: MapPoint[];
  onPointSelect?: (point: MapPoint) => void;
  onPointUpdate?: (point: MapPoint) => void;
  onPointCreate?: (position: Position) => void;
  onPointDelete?: (pointId: string) => void;
  center?: Position;
  zoom?: number;
  className?: string;
}

export interface DataTableProps {
  points: MapPoint[];
  onPointSelect?: (point: MapPoint) => void;
  onPointDelete?: (pointId: string) => void;
  onPointUpdate?: (point: MapPoint) => void;
  pagination?: PaginationOptions;
  filters?: FilterOptions;
}

export interface MapClickEvent {
  latlng: LatLng;
  containerPoint: [number, number];
  originalEvent: MouseEvent;
}

export interface MarkerDragEvent {
  target: any;
  oldLatLng: LatLng;
  latlng: LatLng;
}
