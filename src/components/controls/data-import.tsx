import React, { useState, useCallback } from 'react';
import { useDataProcessing } from '../../hooks/useDataProcessing';
import { MapPoint, MapError } from '../../types/map.types';
import styles from '../../styles/components/data-import.module.scss';

interface DataImportProps {
  onImportComplete?: (points: MapPoint[]) => void;
  onError?: (error: MapError) => void;
}

export const DataImport: React.FC<DataImportProps> = ({ onImportComplete, onError }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const { processCSV, processGeoJSON, isLoading, errors, warnings } = useDataProcessing();

  const handleFileSelect = useCallback(
    async (file: File) => {
      try {
        const content = await file.text();
        setFileName(file.name);

        let result;
        if (file.name.toLowerCase().endsWith('.csv')) {
          result = await processCSV(content);
        } else if (
          file.name.toLowerCase().endsWith('.geojson') ||
          file.name.toLowerCase().endsWith('.json')
        ) {
          result = await processGeoJSON(content);
        } else {
          throw new Error('Unsupported file format. Please use CSV or GeoJSON files.');
        }

        if (result.errors.length > 0) {
          result.errors.forEach(error => onError?.(error));
        } else {
          onImportComplete?.(result.data);
        }
      } catch (error) {
        onError?.({
          message: (error as Error).message,
          code: 'FILE_PROCESSING_ERROR',
          details: error,
        });
      }
    },
    [processCSV, processGeoJSON, onImportComplete, onError]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  return (
    <div className={styles.container}>
      <div
        className={`${styles.dropZone} ${isDragging ? styles.dragging : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="fileInput"
          className={styles.fileInput}
          accept=".csv,.geojson,.json"
          onChange={handleFileInput}
          disabled={isLoading}
        />
        <label htmlFor="fileInput" className={styles.fileLabel}>
          {isLoading ? (
            <div className={styles.loading}>
              <div className={styles.spinner} />
              <span>Processing...</span>
            </div>
          ) : (
            <>
              <div className={styles.icon}>📁</div>
              <div className={styles.text}>
                <span className={styles.primary}>
                  {fileName || 'Drop your file here or click to browse'}
                </span>
                <span className={styles.secondary}>Supports CSV and GeoJSON files</span>
              </div>
            </>
          )}
        </label>
      </div>

      {errors.length > 0 && (
        <div className={styles.errorContainer}>
          {errors.map((error, index) => (
            <div key={index} className={styles.error}>
              <span className={styles.errorIcon}>⚠️</span>
              <span className={styles.errorMessage}>{error.message}</span>
            </div>
          ))}
        </div>
      )}

      {warnings.length > 0 && (
        <div className={styles.warningContainer}>
          {warnings.map((warning, index) => (
            <div key={index} className={styles.warning}>
              <span className={styles.warningIcon}>⚠️</span>
              <span className={styles.warningMessage}>{warning}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
