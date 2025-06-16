import { Pagination, UndoRedoManager, PerformanceMonitor } from './utils.js';

/** @type {Array<MapPoint>} */
let points = [];
let currentFilter = 'all';
let currentGroupFilter = null;
let pagination = new Pagination([]);
let undoRedoManager = new UndoRedoManager();
let performanceMonitor = new PerformanceMonitor();

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
  performanceMonitor
};
