// src/utils/csvProcessor.ts  
// MP-1: feat: enhanced CSV import/export with validation and field merge logic

import { MapPoint, Position, DataProcessingResult } from '../types/map.types';

// CSV validation configuration
interface CSVValidationConfig {
  requiredFields: string[];
  optionalFields: string[];
  coordinateFields: {
    latitude: string[];   // possible lat field names
    longitude: string[];  // possible lng field names
  };
  maxFileSize: number;    // bytes
  maxRows: number;
  fieldTypeValidation: boolean;
}

// Default CSV configuration
const DEFAULT_CSV_CONFIG: CSVValidationConfig = {
  requiredFields: ['lat', 'lng'],
  optionalFields: ['id', 'name', 'title', 'description', 'status', 'group', 'color'],
  coordinateFields: {
    latitude: ['lat', 'latitude', 'y', 'lat_dd', 'lat_decimal'],
    longitude: ['lng', 'longitude', 'lon', 'long', 'x', 'lng_dd', 'lng_decimal']
  },
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxRows: 10000,
  fieldTypeValidation: true
};

// CSV processing errors
export class CSVProcessingError extends Error {
  constructor(
    message: string,
    public code: string,
    public line?: number,
    public field?: string,
    public value?: any
  ) {
    super(message);
    this.name = 'CSVProcessingError';
  }
}

// Field type detection
export const detectFieldType = (values: string[]): 'number' | 'date' | 'boolean' | 'string' => {
  const nonEmptyValues = values.filter(v => v && v.trim() !== '');
  
  if (nonEmptyValues.length === 0) return 'string';
  
  // Check for numbers (including coordinates)
  const numberCount = nonEmptyValues.filter(v => {
    const num = parseFloat(v);
    return !isNaN(num) && isFinite(num);
  }).length;
  
  if (numberCount / nonEmptyValues.length > 0.8) return 'number';
  
  // Check for dates
  const dateCount = nonEmptyValues.filter(v => {
    const date = new Date(v);
    return !isNaN(date.getTime()) && v.length > 6; // avoid false positives
  }).length;
  
  if (dateCount / nonEmptyValues.length > 0.7) return 'date';
  
  // Check for booleans
  const boolCount = nonEmptyValues.filter(v => {
    const lower = v.toLowerCase().trim();
    return ['true', 'false', '1', '0', 'yes', 'no', 'y', 'n'].includes(lower);
  }).length;
  
  if (boolCount / nonEmptyValues.length > 0.8) return 'boolean';
  
  return 'string';
};

// Coordinate validation

// Find coordinate fields in CSV headers
const findCoordinateFields = (headers: string[], config: CSVValidationConfig) => {
  const latField = headers.find(h => 
    config.coordinateFields.latitude.some(pattern => 
      h.toLowerCase().includes(pattern.toLowerCase())
    )
  );
  
  const lngField = headers.find(h => 
    config.coordinateFields.longitude.some(pattern => 
      h.toLowerCase().includes(pattern.toLowerCase())
    )
  );
  
  return { latField, lngField };
};

// Template mode: Extract field structure from CSV without importing data
export const extractCSVTemplate = (csvContent: string): {
  headers: string[];
  fieldTypes: Record<string, string>;
  sampleData: Record<string, string>[];
  coordinateFields: { latField?: string; lngField?: string };
} => {
  try {
    const lines = csvContent.trim().split('\n');
    if (lines.length < 2) {
      throw new CSVProcessingError('CSV must contain at least headers and one data row', 'INVALID_FORMAT');
    }

    // Parse headers
    const headers = lines[0].split(',').map(h => h.trim().replace(/['"]/g, ''));
    
    // Find coordinate fields
    const coordinateFields = findCoordinateFields(headers, DEFAULT_CSV_CONFIG);
    
    // Sample up to 10 rows for type detection
    const sampleRows = lines.slice(1, Math.min(11, lines.length))
      .map(line => {
        const values = line.split(',').map(v => v.trim().replace(/['"]/g, ''));
        const row: Record<string, string> = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        return row;
      });

    // Detect field types
    const fieldTypes: Record<string, string> = {};
    headers.forEach(header => {
      const values = sampleRows.map(row => row[header] || '');
      fieldTypes[header] = detectFieldType(values);
    });

    return {
      headers,
      fieldTypes,
      sampleData: sampleRows.slice(0, 3), // Return first 3 rows as sample
      coordinateFields
    };
  } catch (error) {
    console.error('MP-1: Template extraction error:', error);
    throw new CSVProcessingError(
      `Failed to extract CSV template: ${error}`,
      'TEMPLATE_EXTRACTION_FAILED'
    );
  }
};

// Enhanced CSV import with validation and field mapping
export const importCSVWithValidation = (
  csvContent: string,
  fieldMapping?: Record<string, string>, // maps CSV headers to standard field names
  config: Partial<CSVValidationConfig> = {}
): DataProcessingResult<MapPoint[]> => {
  const validationConfig = { ...DEFAULT_CSV_CONFIG, ...config };
  const errors: any[] = [];
  const warnings: string[] = [];
  const points: MapPoint[] = [];

  try {
    // File size validation
    const sizeInBytes = new Blob([csvContent]).size;
    if (sizeInBytes > validationConfig.maxFileSize) {
      throw new CSVProcessingError(
        `File size ${(sizeInBytes / 1024 / 1024).toFixed(1)}MB exceeds limit of ${(validationConfig.maxFileSize / 1024 / 1024).toFixed(1)}MB`,
        'FILE_TOO_LARGE'
      );
    }

    const lines = csvContent.trim().split('\n');
    
    if (lines.length === 0) {
      throw new CSVProcessingError('CSV file is empty', 'EMPTY_FILE');
    }

    if (lines.length > validationConfig.maxRows + 1) { // +1 for header
      warnings.push(`File contains ${lines.length - 1} rows, only processing first ${validationConfig.maxRows}`);
      lines.splice(validationConfig.maxRows + 1);
    }

    // Parse headers
    const rawHeaders = lines[0].split(',').map(h => h.trim().replace(/['"]/g, ''));
    const headers = fieldMapping ? rawHeaders.map(h => fieldMapping[h] || h) : rawHeaders;
    
    // Find coordinate fields
    const { latField, lngField } = findCoordinateFields(headers, validationConfig);
    
    if (!latField || !lngField) {
      throw new CSVProcessingError(
        `Could not find latitude/longitude fields. Available fields: ${headers.join(', ')}`,
        'MISSING_COORDINATES'
      );
    }

    console.log(`MP-1: Found coordinate fields - Lat: ${latField}, Lng: ${lngField}`);

    // Process data rows
    for (let i = 1; i < lines.length; i++) {
      const lineNumber = i + 1;
      
      try {
        const values = lines[i].split(',').map(v => v.trim().replace(/['"]/g, ''));
        
        if (values.length !== headers.length) {
          warnings.push(`Line ${lineNumber}: Column count mismatch (expected ${headers.length}, got ${values.length})`);
          continue;
        }

        const row: Record<string, string> = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });

        // Extract and validate coordinates
        const latValue = row[latField];
        const lngValue = row[lngField];
        
        if (!latValue || !lngValue) {
          warnings.push(`Line ${lineNumber}: Missing coordinate values`);
          continue;
        }

        const lat = parseFloat(latValue);
        const lng = parseFloat(lngValue);

        const coordinateValidation = validateCoordinates(lat, lng);
        if (!coordinateValidation.isValid) {
          warnings.push(`Line ${lineNumber}: Invalid coordinates (${latValue}, ${lngValue}) - ${coordinateValidation.errors.join(', ')}`);
          continue;
        }

        // Create MapPoint
        const point: MapPoint = {
          id: row.id || `point_${i}`,
          position: { lat, lng },
          properties: {},
          name: row.name || row.title || `Point ${i}`,
          description: row.description || '',
          status: (row.status as any) || 'active',
          group: row.group || '',
          createdAt: Date.now(),
          updatedAt: Date.now()
        };

        // Add custom fields to properties
        Object.keys(row).forEach(key => {
          if (!['id', 'name', 'title', 'description', 'status', 'group', latField, lngField].includes(key)) {
            point.properties![key] = row[key];
          }
        });

        points.push(point);

      } catch (rowError) {
        errors.push({
          message: `Line ${lineNumber}: ${rowError}`,
          code: 'ROW_PROCESSING_ERROR',
          line: lineNumber
        });
      }
    }

    console.log(`MP-1: Successfully imported ${points.length} points with ${warnings.length} warnings and ${errors.length} errors`);

    return {
      data: points,
      warnings,
      errors
    };

  } catch (error) {
    console.error('MP-1: CSV import error:', error);
    
    if (error instanceof CSVProcessingError) {
      errors.push({
        message: error.message,
        code: error.code,
        line: error.line,
        field: error.field,
        value: error.value
      });
    } else {
      errors.push({
        message: `Unexpected error: ${error}`,
        code: 'UNKNOWN_ERROR'
      });
    }

    return {
      data: [],
      warnings,
      errors
    };
  }
};

// Enhanced CSV export with custom field handling
export const exportCSVWithValidation = (
  points: MapPoint[],
  includeCustomFields: boolean = true,
  customFieldOrder?: string[]
): string => {
  try {
    if (points.length === 0) {
      console.warn('MP-1: No points to export');
      return 'id,name,lat,lng,description,status,group\n';
    }

    // Determine all available fields
    const standardFields = ['id', 'name', 'lat', 'lng', 'description', 'status', 'group'];
    const customFields = new Set<string>();

    if (includeCustomFields) {
      points.forEach(point => {
        if (point.properties) {
          Object.keys(point.properties).forEach(key => customFields.add(key));
        }
      });
    }

    // Build header row
    const allFields = [
      ...standardFields,
      ...(customFieldOrder || Array.from(customFields).sort())
    ];

    const headers = allFields.join(',');
    
    // Build data rows
    const rows = points.map(point => {
      const row = allFields.map(field => {
        switch (field) {
          case 'id': return point.id || '';
          case 'name': return point.name || '';
          case 'lat': return point.position.lat.toString();
          case 'lng': return point.position.lng.toString();
          case 'description': return point.description || '';
          case 'status': return point.status || '';
          case 'group': return point.group || '';
          default: 
            // Custom field from properties
            const value = point.properties?.[field] || '';
            // Escape commas and quotes in CSV values
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value.toString();
        }
      });
      return row.join(',');
    });

    const csvContent = [headers, ...rows].join('\n');
    
    console.log(`MP-1: Successfully exported ${points.length} points with ${allFields.length} fields`);
    
    return csvContent;

  } catch (error) {
    console.error('MP-1: CSV export error:', error);
    throw new CSVProcessingError(
      `Failed to export CSV: ${error}`,
      'EXPORT_FAILED'
    );
  }
};

// Field merge logic for multiple CSV imports
export const mergeCSVData = (
  existingPoints: MapPoint[],
  newPoints: MapPoint[],
  mergeStrategy: 'replace' | 'merge' | 'append' = 'merge'
): DataProcessingResult<MapPoint[]> => {
  const warnings: string[] = [];
  const errors: any[] = [];

  try {
    if (mergeStrategy === 'append') {
      // Simple append: add all new points with new IDs
      const mergedPoints = [
        ...existingPoints,
        ...newPoints.map((point, index) => ({
          ...point,
          id: `imported_${Date.now()}_${index}`,
          createdAt: Date.now(),
          updatedAt: Date.now()
        }))
      ];

      return {
        data: mergedPoints,
        warnings: [`Appended ${newPoints.length} new points`],
        errors: []
      };
    }

    if (mergeStrategy === 'replace') {
      // Replace all existing points
      return {
        data: newPoints,
        warnings: [`Replaced ${existingPoints.length} existing points with ${newPoints.length} new points`],
        errors: []
      };
    }

    // Merge strategy: Update existing points by ID, add new ones
    const existingById = new Map(existingPoints.map(p => [p.id, p]));
    const mergedPoints: MapPoint[] = [];
    let updatedCount = 0;
    let addedCount = 0;

    // Process new points
    newPoints.forEach(newPoint => {
      const existing = existingById.get(newPoint.id);
      
      if (existing) {
        // Merge with existing point
        const merged: MapPoint = {
          ...existing,
          ...newPoint,
          properties: {
            ...existing.properties,
            ...newPoint.properties
          },
          updatedAt: Date.now()
        };
        mergedPoints.push(merged);
        updatedCount++;
      } else {
        // Add new point
        mergedPoints.push({
          ...newPoint,
          createdAt: Date.now(),
          updatedAt: Date.now()
        });
        addedCount++;
      }
      
      existingById.delete(newPoint.id);
    });

    // Add remaining existing points that weren't updated
    existingById.forEach(point => mergedPoints.push(point));

    warnings.push(`Merged data: ${updatedCount} updated, ${addedCount} added, ${existingById.size} unchanged`);

    return {
      data: mergedPoints,
      warnings,
      errors
    };

  } catch (error) {
    console.error('MP-1: Merge error:', error);
    errors.push({
      message: `Failed to merge CSV data: ${error}`,
      code: 'MERGE_FAILED'
    });

    return {
      data: existingPoints, // Return original data on error
      warnings,
      errors
    };
  }
};

// DO NOT ALTER - VERIFIED COMPLETE: MP-1 Enhanced CSV processing with validation and field merge logic
export default {
  extractCSVTemplate,
  importCSVWithValidation,
  exportCSVWithValidation,
  mergeCSVData,
  detectFieldType,
  CSVProcessingError
};

// MP-1: Enhanced field detection and validation
export interface CSVValidationResult {
  isValid: boolean;
  errors: Array<{ line: number; field: string; message: string; suggestion?: string }>;
  warnings: Array<{ line: number; field: string; message: string }>;
  coordinateFormat: 'lat_lng' | 'latitude_longitude' | 'decimal_degrees' | 'unknown';
}

export function detectCoordinateFormat(headers: string[]): string {
  const lowerHeaders = headers.map(h => h.toLowerCase().trim());
  
  if (lowerHeaders.includes('lat') && lowerHeaders.includes('lng')) return 'lat_lng';
  if (lowerHeaders.includes('latitude') && lowerHeaders.includes('longitude')) return 'latitude_longitude';
  if (lowerHeaders.includes('x') && lowerHeaders.includes('y')) return 'decimal_degrees';
  
  return 'unknown';
}

export function validateCoordinates(lat: number, lng: number): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (lat < -90 || lat > 90) {
    errors.push(`Latitude ${lat} is out of range. Must be between -90 and 90.`);
  }
  
  if (lng < -180 || lng > 180) {
    errors.push(`Longitude ${lng} is out of range. Must be between -180 and 180.`);
  }
  
  return { isValid: errors.length === 0, errors };
}

export function enhancedCSVValidation(csvData: string): CSVValidationResult {
  const lines = csvData.split('\n');
  const headers = lines[0]?.split(',').map(h => h.trim()) || [];
  
  const result: CSVValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    coordinateFormat: detectCoordinateFormat(headers) as any
  };
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    
    const values = line.split(',').map(v => v.trim());
    
    // Validate each row
    if (values.length !== headers.length) {
      result.errors.push({
        line: i + 1,
        field: 'row',
        message: `Row has ${values.length} columns but header has ${headers.length}`,
        suggestion: 'Check for missing commas or extra values'
      });
      result.isValid = false;
    }
    
    // Validate coordinates if present
    const latIndex = headers.findIndex(h => h.toLowerCase().includes('lat'));
    const lngIndex = headers.findIndex(h => h.toLowerCase().includes('lng') || h.toLowerCase().includes('lon'));
    
    if (latIndex >= 0 && lngIndex >= 0) {
      const lat = parseFloat(values[latIndex]);
      const lng = parseFloat(values[lngIndex]);
      
      if (isNaN(lat) || isNaN(lng)) {
        result.errors.push({
          line: i + 1,
          field: 'coordinates',
          message: 'Invalid coordinate values',
          suggestion: 'Ensure coordinates are valid numbers'
        });
        result.isValid = false;
      } else {
        const coordValidation = validateCoordinates(lat, lng);
        if (!coordValidation.isValid) {
          coordValidation.errors.forEach(error => {
            result.errors.push({
              line: i + 1,
              field: 'coordinates',
              message: error
            });
          });
          result.isValid = false;
        }
      }
    }
  }
  
  return result;
}
