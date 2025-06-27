export interface Position {
  lat: number;
  lng: number;
}

export type LatLng = Position;
export type PointStatus = 'active' | 'pending' | 'completed' | 'delayed' | 'inactive';

export interface MapPoint {
  id: string;
  name: string;
  status: PointStatus;
  latlng: LatLng;
  position: Position;
  properties: Record<string, any>;
  description?: string;
  group?: string;
  customFields?: Record<string, string>;
  createdAt: number;
  updatedAt: number;
  selected?: boolean;
}

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

// Add all other types from the artifact above...
