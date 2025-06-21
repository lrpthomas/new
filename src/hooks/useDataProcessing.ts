import { useState, useCallback } from 'react';
import {
  processCSVData,
  processGeoJSONData,
  csvToGeoJSON,
  geoJSONToMapPoints,
  validateMapPoint,
  generatePointId,
} from '../utils/dataProcessing';
import { MapPoint, DataProcessingResult, MapError } from '../types/map.types';

interface UseDataProcessingResult {
  processCSV: (data: string) => Promise<DataProcessingResult<MapPoint[]>>;
  processGeoJSON: (data: string) => Promise<DataProcessingResult<MapPoint[]>>;
  addPoint: (position: { lat: number; lng: number }, properties?: Record<string, any>) => MapPoint;
  updatePoint: (id: string, updates: Partial<MapPoint>) => MapPoint;
  deletePoint: (id: string) => void;
  points: MapPoint[];
  errors: MapError[];
  warnings: string[];
  isLoading: boolean;
}

export const useDataProcessing = (initialPoints: MapPoint[] = []): UseDataProcessingResult => {
  const [points, setPoints] = useState<MapPoint[]>(initialPoints);
  const [errors, setErrors] = useState<MapError[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const processCSV = useCallback(
    async (data: string): Promise<DataProcessingResult<MapPoint[]>> => {
      setIsLoading(true);
      setErrors([]);
      setWarnings([]);

      try {
        const csvRows = processCSVData(data);
        const geoJSONFeatures = csvToGeoJSON(csvRows);
        const newPoints = geoJSONToMapPoints(geoJSONFeatures);

        setPoints(prevPoints => [...prevPoints, ...newPoints]);
        return { data: newPoints, warnings, errors };
      } catch (error) {
        const mapError: MapError = {
          message: (error as Error).message,
          code: 'CSV_PROCESSING_ERROR',
          details: error,
        };
        setErrors(prev => [...prev, mapError]);
        return { data: [], warnings, errors: [mapError] };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const processGeoJSON = useCallback(
    async (data: string): Promise<DataProcessingResult<MapPoint[]>> => {
      setIsLoading(true);
      setErrors([]);
      setWarnings([]);

      try {
        const features = processGeoJSONData(data);
        const newPoints = geoJSONToMapPoints(features);

        setPoints(prevPoints => [...prevPoints, ...newPoints]);
        return { data: newPoints, warnings, errors };
      } catch (error) {
        const mapError: MapError = {
          message: (error as Error).message,
          code: 'GEOJSON_PROCESSING_ERROR',
          details: error,
        };
        setErrors(prev => [...prev, mapError]);
        return { data: [], warnings, errors: [mapError] };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const addPoint = useCallback(
    (position: { lat: number; lng: number }, properties: Record<string, any> = {}) => {
      const newPoint: MapPoint = {
        id: generatePointId(),
        position,
        properties,
      };

      try {
        validateMapPoint(newPoint);
        setPoints(prevPoints => [...prevPoints, newPoint]);
        return newPoint;
      } catch (error) {
        const mapError: MapError = {
          message: (error as Error).message,
          code: 'POINT_VALIDATION_ERROR',
          details: error,
        };
        setErrors(prev => [...prev, mapError]);
        throw error;
      }
    },
    []
  );

  const updatePoint = useCallback(
    (id: string, updates: Partial<MapPoint>): MapPoint => {
      let updatedPoint!: MapPoint;
      setPoints(prevPoints => {
        const pointIndex = prevPoints.findIndex(p => p.id === id);
        if (pointIndex === -1) {
          throw new Error(`Point with id ${id} not found`);
        }

        updatedPoint = {
          ...prevPoints[pointIndex],
          ...updates,
        };

        try {
          validateMapPoint(updatedPoint);
          const newPoints = [...prevPoints];
          newPoints[pointIndex] = updatedPoint;
          return newPoints;
        } catch (error) {
          const mapError: MapError = {
            message: (error as Error).message,
            code: 'POINT_UPDATE_ERROR',
            details: error,
          };
          setErrors(prev => [...prev, mapError]);
          throw error;
        }
      });

      // updatedPoint is set synchronously inside setPoints
      return updatedPoint;
    },
    []
  );

  const deletePoint = useCallback((id: string) => {
    setPoints(prevPoints => prevPoints.filter(p => p.id !== id));
  }, []);

  return {
    processCSV,
    processGeoJSON,
    addPoint,
    updatePoint,
    deletePoint,
    points,
    errors,
    warnings,
    isLoading,
  };
};
