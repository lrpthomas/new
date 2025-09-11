import { MapPoint } from "../types";
import { useCallback, useState } from 'react';
import { debounce } from '../utils/helpers';

export const useDraggableMarker = (
  point: MapPoint,
  onUpdate: (id: string, lat: number, lng: number) => void
) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const debouncedUpdate = useCallback(
    debounce(((id: string, lat: number, lng: number) => {
      onUpdate(id, lat, lng);
    }) as (...args: unknown[]) => void, 100),
    [onUpdate]
  );
  
  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);
  
  const handleDragEnd = useCallback((event: any) => {
    const { lat, lng } = event.target.getLatLng();
    setIsDragging(false);
    debouncedUpdate(point.id, lat, lng);
  }, [point.id, debouncedUpdate]);
  
  return {
    isDragging,
    handleDragStart,
    handleDragEnd
  };
};
