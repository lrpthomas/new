import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useMapState } from '../../hooks/useMapState';
import { MapMarker } from '../../types/map.types';

interface MapComponentProps {
  markers: MapMarker[];
  onMarkerDragEnd?: (marker: MapMarker, newPosition: [number, number]) => void;
  onMapClick?: (position: [number, number]) => void;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  markers,
  onMarkerDragEnd,
  onMapClick,
}) => {
  const mapRef = useRef<L.Map>(null);
  const { center, zoom, setMapState } = useMapState();

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.on('click', (e: L.LeafletMouseEvent) => {
        onMapClick?.([e.latlng.lat, e.latlng.lng]);
      });
    }
  }, [onMapClick]);

  const handleMarkerDragEnd = (marker: MapMarker, e: L.DragEndEvent) => {
    const newPosition: [number, number] = [
      e.target.getLatLng().lat,
      e.target.getLatLng().lng,
    ];
    onMarkerDragEnd?.(marker, newPosition);
  };

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      ref={mapRef}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={[marker.lat, marker.lng]}
          draggable={true}
          eventHandlers={{
            dragend: (e) => handleMarkerDragEnd(marker, e),
          }}
        >
          <Popup>
            <div>
              <h3>{marker.title}</h3>
              <p>{marker.description}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}; 