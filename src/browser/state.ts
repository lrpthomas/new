import { PerformanceMonitor } from './utils';

/** @type {Array<MapPoint>} */
let points = [];
let currentFilter = 'all';
let currentGroupFilter = null;
let pagination = new Pagination([]);
let undoRedoManager = new UndoRedoManager();
let performanceMonitor = new PerformanceMonitor();

export function addPoint(point) {
  points.push(point);
}

export function removePoint(id) {
  const index = points.findIndex(p => p.id === id);
  if (index !== -1) {
    points.splice(index, 1);
  }
}

export function setPoints(newPoints) {
  points = newPoints;
}

export function setCurrentFilter(filter) {
  currentFilter = filter;
}

export function setCurrentGroupFilter(group) {
  currentGroupFilter = group;
}

export {
  points,
  currentFilter,
  currentGroupFilter,
  pagination,
  undoRedoManager,
  performanceMonitor,
};
