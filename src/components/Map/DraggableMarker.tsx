import React, { useCallback } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { useDraggableMarker } from '../../hooks/useDraggableMarker';
import { MapPoint, DraggableMarkerProps } from '../../../public/js/types';

export const DraggableMarker: React.FC<DraggableMarkerProps> = ({
  point,
  onDragEnd,
  onDragStart
}) => {
  const { isDragging, handleDragStart, handleDragEnd } = useDraggableMarker(
    point,
    onDragEnd
  );

  // Custom icon with drag state
  const markerIcon = new Icon({
    iconUrl: isDragging ? '/marker-active.png' : '/marker.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    className: isDragging ? 'marker-dragging' : ''
  });

  // Keyboard navigation handler
  const handleKeyboardNavigation = useCallback((e: KeyboardEvent) => {
    const MOVE_AMOUNT = 0.0001; // Adjust for desired movement size
    
    switch(e.key) {
      case 'ArrowUp':
        e.preventDefault();
        onDragEnd(point.id, point.lat + MOVE_AMOUNT, point.lng);
        break;
      case 'ArrowDown':
        e.preventDefault();
        onDragEnd(point.id, point.lat - MOVE_AMOUNT, point.lng);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        onDragEnd(point.id, point.lat, point.lng - MOVE_AMOUNT);
        break;
      case 'ArrowRight':
        e.preventDefault();
        onDragEnd(point.id, point.lat, point.lng + MOVE_AMOUNT);
        break;
    }
  }, [point, onDragEnd]);

  return (
    <Marker
      position={[point.lat, point.lng]}
      draggable={true}
      icon={markerIcon}
      eventHandlers={{
        dragstart: handleDragStart,
        dragend: handleDragEnd,
        keydown: handleKeyboardNavigation,
      }}
      // @ts-ignore - React-Leaflet doesn't have these props in types
      aria-label={`Marker for ${point.name}`}
      role="button"
      tabIndex={0}
    >
      <Popup>{point.name}</Popup>
    </Marker>
  );
};
