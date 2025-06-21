import React, { useCallback } from 'react';
import { MapPoint, GeoJSONFeature } from '../../types';
import styles from '../../styles/components/data-export.module.scss';

interface DataExportProps {
  points: MapPoint[];
  onExportStart?: () => void;
  onExportComplete?: () => void;
  onExportError?: (error: Error) => void;
}

export const DataExport: React.FC<DataExportProps> = ({
  points,
  onExportStart,
  onExportComplete,
  onExportError,
}) => {
  const convertToGeoJSON = useCallback((points: MapPoint[]): GeoJSONFeature[] => {
    return points.map(point => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [point.position.lng, point.position.lat],
      },
      properties: {
        id: point.id,
        ...point.properties,
      },
    }));
  }, []);

  const convertToCSV = useCallback((points: MapPoint[]): string => {
    if (points.length === 0) return '';

    // Get all unique property keys
    const allProperties = new Set<string>();
    points.forEach(point => {
      Object.keys(point.properties).forEach(key => allProperties.add(key));
    });

    // Create header row
    const headers = ['id', 'latitude', 'longitude', ...Array.from(allProperties)];
    const headerRow = headers.join(',');

    // Create data rows
    const rows = points.map(point => {
      const values = [
        point.id,
        point.position.lat,
        point.position.lng,
        ...Array.from(allProperties).map(prop => {
          const value = point.properties[prop];
          // Escape commas and quotes in CSV
          return typeof value === 'string' && (value.includes(',') || value.includes('"'))
            ? `"${value.replace(/"/g, '""')}"`
            : (value ?? '');
        }),
      ];
      return values.join(',');
    });

    return [headerRow, ...rows].join('\n');
  }, []);

  const handleExport = useCallback(
    async (format: 'csv' | 'geojson') => {
      try {
        onExportStart?.();

        let content: string;
        let filename: string;
        let mimeType: string;

        if (format === 'csv') {
          content = convertToCSV(points);
          filename = 'map-points.csv';
          mimeType = 'text/csv';
        } else {
          const features = convertToGeoJSON(points);
          content = JSON.stringify(
            {
              type: 'FeatureCollection',
              features,
            },
            null,
            2
          );
          filename = 'map-points.geojson';
          mimeType = 'application/json';
        }

        // Create and trigger download
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        onExportComplete?.();
      } catch (error) {
        onExportError?.(error as Error);
      }
    },
    [points, convertToCSV, convertToGeoJSON, onExportStart, onExportComplete, onExportError]
  );

  return (
    <div className={styles.container}>
      <div className={styles.buttonGroup}>
        <button
          onClick={() => handleExport('csv')}
          className={styles.exportButton}
          disabled={points.length === 0}
          title="Export as CSV"
        >
          <span className={styles.icon}>📊</span>
          <span className={styles.text}>Export CSV</span>
        </button>
        <button
          onClick={() => handleExport('geojson')}
          className={styles.exportButton}
          disabled={points.length === 0}
          title="Export as GeoJSON"
        >
          <span className={styles.icon}>🗺️</span>
          <span className={styles.text}>Export GeoJSON</span>
        </button>
      </div>
      {points.length === 0 && (
        <div className={styles.emptyState}>No points available to export</div>
      )}
    </div>
  );
};
