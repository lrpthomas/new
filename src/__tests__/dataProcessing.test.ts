import fs from 'fs';
import path from 'path';
import { renderHook, act } from '@testing-library/react';
import { processCSVData, processGeoJSONData } from '../utils/dataProcessing';
import { useDataProcessing } from '../hooks/useDataProcessing';

describe('processCSVData', () => {
  const validCsv = fs.readFileSync(path.join(__dirname, 'fixtures/valid.csv'), 'utf8');
  const invalidCsv = fs.readFileSync(path.join(__dirname, 'fixtures/invalid.csv'), 'utf8');

  it('parses valid CSV string', () => {
    const rows = processCSVData(validCsv);
    expect(rows).toEqual([
      { latitude: '10', longitude: '20', name: 'Location A' },
      { latitude: '30', longitude: '40', name: 'Location B' },
    ]);
  });

  it('throws for missing latitude/longitude columns', () => {
    expect(() => processCSVData(invalidCsv)).toThrow();
  });
});

describe('processGeoJSONData', () => {
  const validGeo = fs.readFileSync(path.join(__dirname, 'fixtures/valid.geojson'), 'utf8');
  const invalidGeo = fs.readFileSync(path.join(__dirname, 'fixtures/invalid.geojson'), 'utf8');

  it('parses valid GeoJSON string', () => {
    const features = processGeoJSONData(validGeo);
    expect(features).toHaveLength(2);
    expect(features[0].geometry.coordinates).toEqual([20, 10]);
  });

  it('throws for invalid GeoJSON data', () => {
    expect(() => processGeoJSONData(invalidGeo)).toThrow();
  });
});

describe('useDataProcessing hook', () => {
  const validCsv = fs.readFileSync(path.join(__dirname, 'fixtures/valid.csv'), 'utf8');
  const invalidCsv = fs.readFileSync(path.join(__dirname, 'fixtures/invalid.csv'), 'utf8');
  const validGeo = fs.readFileSync(path.join(__dirname, 'fixtures/valid.geojson'), 'utf8');
  const invalidGeo = fs.readFileSync(path.join(__dirname, 'fixtures/invalid.geojson'), 'utf8');

  it('processCSV adds points', async () => {
    const { result } = renderHook(() => useDataProcessing());

    await act(async () => {
      const res = await result.current.processCSV(validCsv);
      expect(res.data).toHaveLength(2);
      expect(res.errors).toHaveLength(0);
    });
    expect(result.current.points).toHaveLength(2);
  });

  it('records error for invalid CSV', async () => {
    const { result } = renderHook(() => useDataProcessing());

    await act(async () => {
      const res = await result.current.processCSV(invalidCsv);
      expect(res.errors.length).toBeGreaterThan(0);
    });
    expect(result.current.errors.length).toBeGreaterThan(0);
    expect(result.current.points).toHaveLength(0);
  });

  it('processGeoJSON adds points', async () => {
    const { result } = renderHook(() => useDataProcessing());

    await act(async () => {
      const res = await result.current.processGeoJSON(validGeo);
      expect(res.data).toHaveLength(2);
      expect(res.errors).toHaveLength(0);
    });
    expect(result.current.points).toHaveLength(2);
  });

  it('records error for invalid GeoJSON', async () => {
    const { result } = renderHook(() => useDataProcessing());

    await act(async () => {
      const res = await result.current.processGeoJSON(invalidGeo);
      expect(res.errors.length).toBeGreaterThan(0);
    });
    expect(result.current.errors.length).toBeGreaterThan(0);
    expect(result.current.points).toHaveLength(0);
  });
});
