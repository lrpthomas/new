// src/components/Map/DraggableMarker.tsx
// MP-0: fix: remove unused imports and update ts-ignore

// biome-ignore format: preserve existing style
import type { LatLngExpression, Marker as LeafletMarker } from 'leaflet';
import React from 'react';
import { Marker } from 'react-leaflet';

interface DraggableMarkerProps {
  position: LatLngExpression;
  onDragEnd: (position: LatLngExpression) => void;
  children?: React.ReactNode;
}

const DraggableMarker: React.FC<DraggableMarkerProps> = ({ 
  position, 
  onDragEnd, 
  children 
}) => {
  const markerRef = React.useRef<LeafletMarker | null>(null);

  const eventHandlers = React.useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const newPosition = marker.getLatLng();
          onDragEnd([newPosition.lat, newPosition.lng]);
        }
      },
    }),
    [onDragEnd]
  );

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    >
      {children}
    </Marker>
  );
};

export default DraggableMarker;