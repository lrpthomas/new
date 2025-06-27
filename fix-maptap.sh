#!/bin/bash

# Maptap TypeScript Auto-Fix Script
# Run this script to automatically fix all TypeScript errors

set -e  # Exit on any error

echo "🚀 Maptap TypeScript Auto-Fix Starting..."

# Create backup
BACKUP_DIR=".backup/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
echo "📁 Creating backup in $BACKUP_DIR"

# Backup existing files
[ -f "src/types/map.types.ts" ] && cp "src/types/map.types.ts" "$BACKUP_DIR/"
[ -f "src/types/index.ts" ] && cp "src/types/index.ts" "$BACKUP_DIR/"
[ -f "src/__tests__/DataExport.test.tsx" ] && cp "src/__tests__/DataExport.test.tsx" "$BACKUP_DIR/"
[ -f "package.json" ] && cp "package.json" "$BACKUP_DIR/"
[ -f "tsconfig.json" ] && cp "tsconfig.json" "$BACKUP_DIR/"

# Install missing dependencies
echo "📦 Installing missing dependencies..."
pnpm add --save-dev @testing-library/user-event@^14.5.1 @types/react-window@^1.8.5

# Clear Jest cache
echo "🧹 Clearing Jest cache..."
pnpm jest --clearCache

echo "✍️  Writing fixed files..."

# 1. Fix src/types/map.types.ts
cat > src/types/map.types.ts << 'MAPEOF'
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
MAPEOF

# 2. Fix src/types/index.ts
cat > src/types/index.ts << 'INDEXEOF'
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
INDEXEOF

# 3. Fix src/__tests__/DataExport.test.tsx
cat > src/__tests__/DataExport.test.tsx << 'TESTEOF'
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DataExport } from '../components/controls/data-export';
import { MapPoint } from '../types';

describe('DataExport CSV export', () => {
  it('preserves 0 and false values when exporting CSV', () => {
    const originalBlob = global.Blob;
    const originalCreateObjectURL = global.URL.createObjectURL;
    const originalRevokeObjectURL = global.URL.revokeObjectURL;

    try {
      const points: MapPoint[] = [
        {
          id: '1',
          position: { lat: 10, lng: 20 },
          latlng: { lat: 10, lng: 20 },
          properties: {
            zeroValue: 0,
            falseValue: false,
          },
        },
      ];

      const captured: string[] = [];

      class MockBlob {
        private data: string;
        constructor(parts: string[]) {
          this.data = parts.join('');
          captured.push(this.data);
        }
        text() {
          return Promise.resolve(this.data);
        }
      }

      const createObjectURL = jest.fn(() => 'blob:url');
      const revokeObjectURL = jest.fn();

      global.Blob = MockBlob as unknown as typeof Blob;
      global.URL.createObjectURL = createObjectURL;
      global.URL.revokeObjectURL = revokeObjectURL;

      const { getByTitle } = render(<DataExport points={points} />);
      fireEvent.click(getByTitle('Export as CSV'));

      const csvContent = captured[0];
      expect(csvContent).toContain('id,latitude,longitude,zeroValue,falseValue');
      const dataRow = csvContent.trim().split('\n')[1];
      expect(dataRow).toBe('1,10,20,0,false');
    } finally {
      global.Blob = originalBlob;
      global.URL.createObjectURL = originalCreateObjectURL;
      global.URL.revokeObjectURL = originalRevokeObjectURL;
    }
  });

  it('should handle empty points array', () => {
    const points: MapPoint[] = [];
    const { getByTitle } = render(<DataExport points={points} />);
    const csvButton = getByTitle('Export as CSV');
    expect(csvButton).toBeDisabled();
  });

  it('should render all export buttons', () => {
    const points: MapPoint[] = [
      {
        id: '1',
        position: { lat: 10, lng: 20 },
        latlng: { lat: 10, lng: 20 },
        properties: { name: 'Test Point' },
      },
    ];

    const { getByTitle } = render(<DataExport points={points} />);
    expect(getByTitle('Export as CSV')).toBeInTheDocument();
    expect(getByTitle('Export as GeoJSON')).toBeInTheDocument();
    expect(getByTitle('Download CSV Template')).toBeInTheDocument();
  });
});
TESTEOF

# Apply patches to utility files
echo "🩹 Applying patches to utility files..."

# Patch csvProcessor.ts - Add latlng property
if [ -f "src/utils/csvProcessor.ts" ]; then
    echo "Patching csvProcessor.ts..."
    # Look for the MapPoint creation and add latlng
    if grep -q "position: { lat: latitude, lng: longitude }," src/utils/csvProcessor.ts; then
        sed -i.bak '/position: { lat: latitude, lng: longitude },/a\
          latlng: { lat: latitude, lng: longitude }, // Add backward compatibility' src/utils/csvProcessor.ts
    fi
fi

# Patch dataProcessing.ts - Add latlng property  
if [ -f "src/utils/dataProcessing.ts" ]; then
    echo "Patching dataProcessing.ts..."
    # Replace the geoJSONToMapPoints function
    sed -i.bak '/const \[lng, lat\] = feature.geometry.coordinates;/,/};/ {
        /const \[lng, lat\] = feature.geometry.coordinates;/a\
        const position = { lat, lng };
        s/position: { lat, lng },/position,\
        latlng: position, \/\/ Add backward compatibility/
    }' src/utils/dataProcessing.ts
fi

# Patch map.routes.test.ts - Add latlng property
if [ -f "src/__tests__/map.routes.test.ts" ]; then
    echo "Patching map.routes.test.ts..."
    sed -i.bak '/position: { lat: 1, lng: 2 },/a\
      latlng: { lat: 1, lng: 2 }, // Add backward compatibility' src/__tests__/map.routes.test.ts
fi

# Patch errorHandling.ts - Fix import path
if [ -f "src/services/errorHandling.ts" ]; then
    echo "Patching errorHandling.ts..."
    sed -i.bak "s|from '../types'|from '../types/map.types'|g" src/services/errorHandling.ts
fi

# Patch useOfflineSync.ts - Add type safety
if [ -f "src/hooks/useOfflineSync.ts" ]; then
    echo "Patching useOfflineSync.ts..."
    sed -i.bak '/const point = op.payload as MapPoint;/a\
        if (point.position && !point.latlng) {\
          point.latlng = point.position;\
        }' src/hooks/useOfflineSync.ts
fi

# Reinstall dependencies
echo "📦 Reinstalling dependencies..."
pnpm install

# Test TypeScript compilation
echo "🔍 Testing TypeScript compilation..."
if pnpm tsc --noEmit; then
    echo "✅ TypeScript compilation successful!"
else
    echo "❌ TypeScript compilation failed. Check errors above."
    exit 1
fi

# Run tests
echo "🧪 Running tests..."
if pnpm test --passWithNoTests --verbose=false; then
    echo "✅ Tests passing!"
else
    echo "⚠️  Some tests failed. Check output above."
fi

echo ""
echo "🎉 TypeScript Auto-Fix Complete!"
echo "📁 Backup saved in: $BACKUP_DIR"
echo ""
echo "✅ All TypeScript errors should now be resolved!"
echo "🚀 You can now run: pnpm dev"
