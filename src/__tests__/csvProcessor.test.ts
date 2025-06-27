// src/__tests__/csvProcessor.test.ts
// MP-1: test: comprehensive CSV processor validation tests

import {
  extractCSVTemplate,
  importCSVWithValidation,
  exportCSVWithValidation,
  mergeCSVData,
  detectFieldType,
  CSVProcessingError
} from '../utils/csvProcessor';
import { MapPoint } from '../types/map.types';

describe('MP-1: CSV Processor', () => {
  const validCSV = `id,name,lat,lng,description,status
1,Point A,47.6062,-122.3321,Seattle office,active
2,Point B,40.7128,-74.0060,New York office,pending`;

  describe('Field Type Detection', () => {
    it('should detect number fields correctly', () => {
      const numberValues = ['1.5', '2', '3.14', '-5'];
      expect(detectFieldType(numberValues)).toBe('number');
    });

    it('should detect string fields correctly', () => {
      const stringValues = ['Seattle', 'New York', 'Los Angeles'];
      expect(detectFieldType(stringValues)).toBe('string');
    });
  });

  describe('CSV Template Extraction', () => {
    it('should extract template from valid CSV', () => {
      const template = extractCSVTemplate(validCSV);
      
      expect(template.headers).toEqual(['id', 'name', 'lat', 'lng', 'description', 'status']);
      expect(template.fieldTypes.lat).toBe('number');
      expect(template.coordinateFields.latField).toBe('lat');
      expect(template.coordinateFields.lngField).toBe('lng');
    });
  });

  describe('CSV Import with Validation', () => {
    it('should import valid CSV successfully', () => {
      const result = importCSVWithValidation(validCSV);
      
      expect(result.data).toHaveLength(2);
      expect(result.errors).toHaveLength(0);
      
      const firstPoint = result.data[0];
      expect(firstPoint.id).toBe('1');
      expect(firstPoint.name).toBe('Point A');
      expect(firstPoint.position.lat).toBe(47.6062);
      expect(firstPoint.position.lng).toBe(-122.3321);
    });
  });
});
