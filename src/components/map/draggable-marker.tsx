// src/components/map/draggable-marker.tsx
// MP-0: fix: remove unused imports and update ts-ignore

import React from 'react';
import { Marker } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';

interface DraggableMarkerProps {
  position: LatLngExpression;
  onDragEnd: (position: LatLngExpression) => void;
  children?: React.ReactNode;
}

const DraggableMarker: React.FC<DraggableMarkerProps> = ({ position, onDragEnd, children }) => {
  const markerRef = React.useRef<L.Marker | null>(null);

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
    <Marker draggable={true} eventHandlers={eventHandlers} position={position} ref={markerRef}>
      {children}
    </Marker>
  );
};

export default DraggableMarker;
