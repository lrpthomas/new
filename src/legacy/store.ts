import { Pagination, UndoRedoManager } from './utils';
import type { MapPoint, LatLng } from '../types/legacy.types';

let points: MapPoint[] = [];
let currentFilter = 'all';
let currentGroupFilter = null;
const pagination = new Pagination([] as MapPoint[]);
const undoRedoManager = new UndoRedoManager();

let isAddingPoint = false;
let currentLatLng: LatLng | null = null;

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
  get points(): MapPoint[] {
    return points;
  },
  set points(value: MapPoint[]) {
    points = value;
  },
  addPoint(point: MapPoint) {
    points.push(point);
  },
  removePoint(id: string) {
    const index = points.findIndex(p => p.id === id);
    if (index >= 0) {
      points.splice(index, 1);
    }
  },
  get currentFilter(): string {
    return currentFilter;
  },
  set currentFilter(filter: string) {
    currentFilter = filter;
  },
  get currentGroupFilter(): string | null {
    return currentGroupFilter;
  },
  set currentGroupFilter(group: string | null) {
    currentGroupFilter = group;
  },
  pagination,
  undoRedoManager,
  get isAddingPoint(): boolean {
    return isAddingPoint;
  },
  set isAddingPoint(val: boolean) {
    isAddingPoint = val;
  },
  get currentLatLng(): LatLng | null {
    return currentLatLng;
  },
  set currentLatLng(val: LatLng | null) {
    currentLatLng = val;
  },
};
