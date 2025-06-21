import { useCallback, useRef } from 'react';
import L, { LatLngExpression, Map as LeafletMap, Marker } from 'leaflet';

interface MarkerData {
  id: string;
  name: string;
  status: string;
  description?: string;
  group?: string;
}

const createCustomIcon = (status: string): L.DivIcon => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div class="marker-dot ${status}"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

const createPopupContent = (data: MarkerData): string => {
  return `
        <div class="popup-content">
            <h3>${data.name}</h3>
            <p>Status: ${data.status}</p>
            ${data.description ? `<p>${data.description}</p>` : ''}
            ${data.group ? `<p>Group: ${data.group}</p>` : ''}
            <button onclick="editPoint('${data.id}')">Edit</button>
        </div>
    `;
};

export const useMapActions = (
  mapRef: React.RefObject<LeafletMap>,
  layers: Record<string, L.TileLayer>
) => {
  const currentLayer = useRef<string>('osm');

  const addMarker = useCallback(
    (latlng: LatLngExpression, data: MarkerData): Marker | null => {
      if (!mapRef.current) return null;
      const marker = L.marker(latlng, { icon: createCustomIcon(data.status) });
      marker.bindPopup(createPopupContent(data));
      marker.addTo(mapRef.current);
      return marker;
    },
    [mapRef]
  );

  const toggleLayer = useCallback(
    (layerName: string) => {
      if (!mapRef.current) return;
      if (currentLayer.current === layerName) return;
      const map = mapRef.current;
      map.removeLayer(layers[currentLayer.current]);
      map.addLayer(layers[layerName]);
      currentLayer.current = layerName;
    },
    [mapRef, layers]
  );

  return { addMarker, toggleLayer, currentLayer };
};
