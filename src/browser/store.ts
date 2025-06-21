/* eslint-disable @typescript-eslint/no-unused-vars */
import { Pagination, UndoRedoManager } from './utils';

/** @type {import('./types').MapPoint[]} */
let points = [];
let currentFilter = 'all';
let currentGroupFilter = null;
const pagination = new Pagination([]);
const undoRedoManager = new UndoRedoManager();

let isAddingPoint = false;
let currentLatLng = null;

// expose globals for legacy usage
Object.defineProperty(window, 'isAddingPoint', {
  get: () => isAddingPoint,
  set: v => {
    isAddingPoint = v;
  },
});

Object.defineProperty(window, 'currentLatLng', {
  get: () => currentLatLng,
  set: v => {
    currentLatLng = v;
  },
});

export const store = {
  get points() {
    return points;
  },
  set points(value) {
    points = value;
  },
  addPoint(point) {
    points.push(point);
  },
  removePoint(id) {
    const index = points.findIndex(p => p.id === id);
    if (index >= 0) {
      points.splice(index, 1);
    }
  },
  get currentFilter() {
    return currentFilter;
  },
  set currentFilter(filter) {
    currentFilter = filter;
  },
  get currentGroupFilter() {
    return currentGroupFilter;
  },
  set currentGroupFilter(group) {
    currentGroupFilter = group;
  },
  pagination,
  undoRedoManager,
  get isAddingPoint() {
    return isAddingPoint;
  },
  set isAddingPoint(val) {
    isAddingPoint = val;
  },
  get currentLatLng() {
    return currentLatLng;
  },
  set currentLatLng(val) {
    currentLatLng = val;
  },
};
