import React, { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import styles from '../../styles/components/map.module.scss';
import { useMapState } from '../../hooks/useMapState';
import { MapMarker } from '../../types';

interface MapComponentProps {
  markers: MapMarker[];
  onMarkerDragEnd?: (marker: MapMarker, newPosition: [number, number]) => void;
  onMapClick?: (position: [number, number]) => void;
  enableClustering?: boolean;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  markers,
  onMarkerDragEnd,
  onMapClick,
  enableClustering = true,
}) => {
  const mapRef = useRef<L.Map>(null);
  const clickHandlerRef = useRef<(e: L.LeafletMouseEvent) => void>();
  const { center, zoom, setMapState } = useMapState();

  const createColoredIcon = useCallback((color?: string) => {
    if (!color) return undefined;
    return L.divIcon({
      className: styles.customIcon,
      html: `<span class="marker-icon" style="background:${color}"></span>`,
      iconSize: [20, 20],
      iconAnchor: [10, 20],
    });
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    const handler = (e: L.LeafletMouseEvent) => {
      onMapClick?.([e.latlng.lat, e.latlng.lng]);
    };

    clickHandlerRef.current = handler;
    mapRef.current.on('click', handler);

    return () => {
      if (mapRef.current && clickHandlerRef.current) {
        mapRef.current.off('click', clickHandlerRef.current);
      }
    };
  }, [onMapClick]);

  useEffect(() => {
    if (!mapRef.current) return;

    const mapInstance = mapRef.current;

    const moveHandler = () => {
      setMapState({
        center: mapInstance.getCenter(),
        zoom: mapInstance.getZoom(),
      });
    };

    mapInstance.on('moveend', moveHandler);

    return () => {
      mapInstance.off('moveend', moveHandler);
    };
  }, [setMapState]);

  const handleMarkerDragEnd = (marker: MapMarker, e: L.DragEndEvent) => {
    const newPosition: [number, number] = [e.target.getLatLng().lat, e.target.getLatLng().lng];
    onMarkerDragEnd?.(marker, newPosition);
  };

  return (
    <MapContainer center={center} zoom={zoom} className={styles.mapContainer} ref={mapRef}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {enableClustering ? (
        <MarkerClusterGroup>
          {markers.map(marker => (
            <Marker
              key={marker.id}
              position={[marker.lat, marker.lng]}
              icon={createColoredIcon(marker.color)}
              draggable={true}
              eventHandlers={{
                dragend: e => handleMarkerDragEnd(marker, e),
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
        </MarkerClusterGroup>
      ) : (
        <>
          {markers.map(marker => (
            <Marker
              key={marker.id}
              position={[marker.lat, marker.lng]}
              icon={createColoredIcon(marker.color)}
              draggable={true}
              eventHandlers={{
                dragend: e => handleMarkerDragEnd(marker, e),
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
        </>
      )}
    </MapContainer>
  );
};
