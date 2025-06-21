import { useRef } from 'react';
import L, { Map as LeafletMap, Layer, LatLngExpression, LayerGroup } from 'leaflet';

export interface MarkerData {
  id: string;
  name: string;
  status?: string;
  description?: string;
  group?: string;
}

export const useMapLayers = (mapRef: React.RefObject<LeafletMap>) => {
  const markersRef = useRef<LayerGroup>(new L.LayerGroup());
  const currentLayerRef = useRef<string>('osm');

  const addMarker = (
    latlng: LatLngExpression,
    data: MarkerData
  ): L.Marker | null => {
    if (!mapRef.current) return null;
    const marker = L.marker(latlng, {
      icon: L.divIcon({
        className: 'custom-marker',
        html: `<div class="marker-dot ${data.status || ''}"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      })
    });

    marker.bindPopup(`
      <div class="popup-content">
        <h3>${data.name}</h3>
        ${data.description ? `<p>${data.description}</p>` : ''}
        ${data.group ? `<p>Group: ${data.group}</p>` : ''}
      </div>
    `);

    markersRef.current.addLayer(marker);
    return marker;
  };

  const toggleLayer = (layerName: string, layers: Record<string, Layer>) => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    if (currentLayerRef.current === layerName) return;

    const prevLayer = layers[currentLayerRef.current];
    if (prevLayer) {
      map.removeLayer(prevLayer);
    }

    const newLayer = layers[layerName];
    if (newLayer) {
      map.addLayer(newLayer);
      currentLayerRef.current = layerName;
    }
  };

  return {
    markers: markersRef.current,
    currentLayer: currentLayerRef.current,
    addMarker,
    toggleLayer
  };
};

export default useMapLayers;
