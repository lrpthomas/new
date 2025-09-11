// biome-ignore format: preserve existing style
import type { LeafletEvent, Marker as LeafletMarker } from 'leaflet';
import { debounce } from 'lodash';
import { useCallback, useState } from 'react';
import type { MapPoint } from "../types";

export const useDraggableMarker = (
  point: MapPoint,
  onUpdate: (id: string, lat: number, lng: number) => void
) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const debouncedUpdate = useCallback(
    debounce((id: string, lat: number, lng: number) => {
      onUpdate(id, lat, lng);
    }, 100),
    []
  );
  
  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);
  
  const handleDragEnd = useCallback((event: LeafletEvent) => {
    const { lat, lng } = (event.target as LeafletMarker).getLatLng();
    setIsDragging(false);
    debouncedUpdate(point.id, lat, lng);
  }, [point.id, debouncedUpdate]);
  
  return {
    isDragging,
    handleDragStart,
    handleDragEnd
  };
};
