// Type definitions for the application

export interface MapPoint {
    id: string;
    name: string;
    status: PointStatus;
    description?: string;
    group?: string;
    latlng: LatLng;
    customFields?: Record<string, string>;
    createdAt: number;
    updatedAt: number;
    selected?: boolean;
}

export type PointStatus = 'active' | 'pending' | 'completed' | 'delayed' | 'inactive';

export interface LatLng {
    lat: number;
    lng: number;
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

export interface PaginationOptions {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
}

export interface CacheItem<T> {
    value: T;
    timestamp: number;
    ttl: number;
}

export interface SearchResult {
    points: MapPoint[];
    total: number;
    pagination: PaginationOptions;
}

export interface MapState {
    center: LatLng;
    zoom: number;
    bounds?: LatLngBounds;
    selectedPoint?: MapPoint;
}

export interface LatLngBounds {
    north: number;
    south: number;
    east: number;
    west: number;
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