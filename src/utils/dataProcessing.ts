import { MapPoint, GeoJSONFeature, CSVRow } from '../types/map.types';

/**
 * Validates and processes CSV data
 * @throws {Error} If data is invalid or processing fails
 */
export const processCSVData = (data: string): CSVRow[] => {
  try {
    const lines = data.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      throw new Error('CSV must contain at least a header row and one data row');
    }

    const headers = lines[0].split(',').map(h => h.trim());
    if (!headers.includes('latitude') || !headers.includes('longitude')) {
      throw new Error('CSV must contain latitude and longitude columns');
    }

    return lines.slice(1).map((line, index) => {
      const values = line.split(',').map(v => v.trim());
      if (values.length !== headers.length) {
        throw new Error(`Row ${index + 2} has incorrect number of columns`);
      }

      const row: CSVRow = {};
      headers.forEach((header, i) => {
        row[header] = values[i];
      });

      // Validate coordinates
      const lat = parseFloat(row.latitude);
      const lng = parseFloat(row.longitude);
      if (isNaN(lat) || isNaN(lng)) {
        throw new Error(`Invalid coordinates in row ${index + 2}`);
      }
      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        throw new Error(`Coordinates out of range in row ${index + 2}`);
      }

      return row;
    });
  } catch (error) {
    throw new Error(`CSV processing failed: ${error.message}`);
  }
};

/**
 * Converts CSV data to GeoJSON format
 * @throws {Error} If conversion fails
 */
export const csvToGeoJSON = (csvData: CSVRow[]): GeoJSONFeature[] => {
  try {
    return csvData.map((row, index) => {
      const lat = parseFloat(row.latitude);
      const lng = parseFloat(row.longitude);
      
      const properties = { ...row };
      delete properties.latitude;
      delete properties.longitude;

      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [lng, lat]
        },
        properties
      };
    });
  } catch (error) {
    throw new Error(`GeoJSON conversion failed: ${error.message}`);
  }
};

/**
 * Validates and processes GeoJSON data
 * @throws {Error} If data is invalid or processing fails
 */
export const processGeoJSONData = (data: string): GeoJSONFeature[] => {
  try {
    const parsed = JSON.parse(data);
    if (!parsed.features || !Array.isArray(parsed.features)) {
      throw new Error('Invalid GeoJSON: missing features array');
    }

    return parsed.features.map((feature: any, index: number) => {
      if (!feature.geometry || !feature.geometry.coordinates) {
        throw new Error(`Invalid feature at index ${index}: missing geometry or coordinates`);
      }

      if (feature.geometry.type !== 'Point') {
        throw new Error(`Feature at index ${index} is not a Point geometry`);
      }

      const [lng, lat] = feature.geometry.coordinates;
      if (typeof lng !== 'number' || typeof lat !== 'number') {
        throw new Error(`Invalid coordinates in feature at index ${index}`);
      }

      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        throw new Error(`Coordinates out of range in feature at index ${index}`);
      }

      return feature;
    });
  } catch (error) {
    throw new Error(`GeoJSON processing failed: ${error.message}`);
  }
};

/**
 * Converts GeoJSON features to map points
 * @throws {Error} If conversion fails
 */
export const geoJSONToMapPoints = (features: GeoJSONFeature[]): MapPoint[] => {
  try {
    return features.map((feature, index) => {
      const [lng, lat] = feature.geometry.coordinates;
      return {
        id: `point-${index}`,
        position: { lat, lng },
        properties: feature.properties
      };
    });
  } catch (error) {
    throw new Error(`Map point conversion failed: ${error.message}`);
  }
};

/**
 * Validates a map point
 * @throws {Error} If point is invalid
 */
export const validateMapPoint = (point: MapPoint): void => {
  if (!point.position) {
    throw new Error('Point missing position');
  }

  const { lat, lng } = point.position;
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    throw new Error('Invalid coordinate types');
  }

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    throw new Error('Coordinates out of range');
  }
};

/**
 * Generates a unique ID for a map point
 */
export const generatePointId = (): string => {
  return `point-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}; 