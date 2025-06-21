import { Pagination, UndoRedoManager, PerformanceMonitor } from './utils';
import type { MapPoint } from '../types/legacy.types';

let points: MapPoint[] = [];
let currentFilter = 'all';
let currentGroupFilter = null;
let pagination = new Pagination([] as MapPoint[]);
let undoRedoManager = new UndoRedoManager();
let performanceMonitor = new PerformanceMonitor();

export function addPoint(point: MapPoint): void {
  points.push(point);
}

export function removePoint(id: string): void {
  const index = points.findIndex(p => p.id === id);
  if (index !== -1) {
    points.splice(index, 1);
  }
}

export function setPoints(newPoints: MapPoint[]): void {
  points = newPoints;
}

export function setCurrentFilter(filter: string): void {
  currentFilter = filter;
}

export function setCurrentGroupFilter(group: string | null): void {
  currentGroupFilter = group;
}

export {
  points,
  addPoint,
  removePoint,
  setPoints,
  currentFilter,
  currentGroupFilter,
  pagination,
  undoRedoManager,
  performanceMonitor,
};