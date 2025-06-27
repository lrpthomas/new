export interface CacheItem<T> {
  value: T;
  timestamp: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait = 300,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return function executedFunction(this: unknown, ...args: Parameters<T>): void {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };
    const callNow = immediate && !timeout;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(this, args);
  };
}

export function sanitizeInput(str: string | null | undefined): string {
  if (str == null) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export function trapFocus(modalElement: HTMLElement | null): () => void {
  if (!modalElement) return () => {};
  const focusableSelectors =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const focusableElements = Array.from(
    modalElement.querySelectorAll<HTMLElement>(focusableSelectors)
  ).filter((el: any) => !el.disabled);
  const first = focusableElements[0];
  const last = focusableElements[focusableElements.length - 1];
  const previouslyFocused = document.activeElement as HTMLElement | null;

  function handleKeydown(e: KeyboardEvent): void {
    if (e.key === 'Tab') {
      if (focusableElements.length === 0) {
        e.preventDefault();
        return;
      }
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }
    if (e.key === 'Escape') {
      const closeBtn = modalElement.querySelector<HTMLElement>('.close-modal');
      closeBtn?.click();
    }
  }

  modalElement.addEventListener('keydown', handleKeydown);
  first?.focus();

  return function cleanup() {
    modalElement.removeEventListener('keydown', handleKeydown);
    previouslyFocused?.focus();
  };
}

export class Cache<T> {
  private cache = new Map<string, CacheItem<T>>();
  private accessOrder: string[] = [];

  constructor(
    private ttl = 5 * 60 * 1000,
    private maxSize = 1000
  ) {}

  set(key: string, value: T): void {
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.accessOrder.shift();
      if (oldestKey) this.cache.delete(oldestKey);
    }
    this.cache.set(key, { value, timestamp: Date.now() });
    this.updateAccessOrder(key);
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      this.accessOrder = this.accessOrder.filter(k => k !== key);
      return null;
    }
    this.updateAccessOrder(key);
    return item.value;
  }

  private updateAccessOrder(key: string): void {
    this.accessOrder = this.accessOrder.filter(k => k !== key);
    this.accessOrder.push(key);
  }

  clear(): void {
    this.cache.clear();
    this.accessOrder = [];
  }

  getSize(): number {
    return this.cache.size;
  }

  getKeys(): string[] {
    return Array.from(this.cache.keys());
  }
}

export class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  constructor(
    private maxRequests = 10,
    private timeWindow = 60000
  ) {}

  canMakeRequest(key: string): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(key) || [];
    const recentRequests = userRequests.filter(time => now - time < this.timeWindow);
    if (recentRequests.length >= this.maxRequests) {
      return false;
    }
    recentRequests.push(now);
    this.requests.set(key, recentRequests);
    return true;
  }

  getRemainingRequests(key: string): number {
    const now = Date.now();
    const userRequests = this.requests.get(key) || [];
    const recentRequests = userRequests.filter(time => now - time < this.timeWindow);
    return this.maxRequests - recentRequests.length;
  }

  reset(key: string): void {
    this.requests.delete(key);
  }
}

export class Pagination<T> {
  private currentPage = 1;
  private totalPages: number;

  constructor(
    private items: T[],
    private itemsPerPage = 10
  ) {
    this.totalPages = Math.ceil(items.length / itemsPerPage);
  }

  getCurrentPage(): T[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.items.slice(start, end);
  }

  getTotalPages(): number {
    return this.totalPages;
  }

  setPage(page: number): void {
    if (page < 1) page = 1;
    if (page > this.totalPages) page = this.totalPages;
    this.currentPage = page;
  }

  setItems(items: T[]): void {
    this.items = items;
    this.totalPages = Math.ceil(items.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
  }

  getPageInfo(): {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } {
    return {
      currentPage: this.currentPage,
      totalPages: this.totalPages,
      totalItems: this.items.length,
      itemsPerPage: this.itemsPerPage,
      hasNextPage: this.currentPage < this.totalPages,
      hasPreviousPage: this.currentPage > 1,
    };
  }
}

export interface PointAction<T> {
  type: string;
  point: T;
  oldPoint?: T;
  newPoint?: T;
}

export class UndoRedoManager<T> {
  private undoStack: Array<T | { actions: T[] }> = [];
  private redoStack: Array<T | { actions: T[] }> = [];
  private currentGroup: { actions: T[] } | null = null;
  private maxStackSize = 50;

  push(action: T): void {
    if (this.currentGroup) {
      this.currentGroup.actions.push(action);
    } else {
      this.undoStack.push(action);
      this.redoStack = [];
      if (this.undoStack.length > this.maxStackSize) {
        this.undoStack.shift();
      }
    }
  }

  beginGroup(): void {
    this.currentGroup = { actions: [] };
  }

  endGroup(): void {
    if (this.currentGroup && this.currentGroup.actions.length > 0) {
      this.undoStack.push(this.currentGroup);
      this.redoStack = [];
      if (this.undoStack.length > this.maxStackSize) {
        this.undoStack.shift();
      }
    }
    this.currentGroup = null;
  }

  undo(): T | { actions: T[] } | null {
    if (this.undoStack.length === 0) return null;
    const action = this.undoStack.pop() as T | { actions: T[] };
    this.redoStack.push(action);
    return action;
  }

  redo(): T | { actions: T[] } | null {
    if (this.redoStack.length === 0) return null;
    const action = this.redoStack.pop() as T | { actions: T[] };
    this.undoStack.push(action);
    return action;
  }

  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  clear(): void {
    this.undoStack = [];
    this.redoStack = [];
    this.currentGroup = null;
  }
}

export class Validator {
  static validatePoint(point: {
    name?: string;
    latlng?: { lat: number; lng: number } | null;
  }): ValidationError[] {
    const errors: ValidationError[] = [];
    if (!point.name) {
      errors.push({ field: 'name', message: 'Name is required' });
    } else if (point.name.length > 100) {
      errors.push({ field: 'name', message: 'Name must be less than 100 characters' });
    }
    if (!point.latlng) {
      errors.push({ field: 'latlng', message: 'Location is required' });
    } else {
      if (point.latlng.lat < -90 || point.latlng.lat > 90) {
        errors.push({ field: 'latlng', message: 'Invalid latitude' });
      }
      if (point.latlng.lng < -180 || point.latlng.lng > 180) {
        errors.push({ field: 'latlng', message: 'Invalid longitude' });
      }
    }
    return errors;
  }
}

export class PerformanceMonitor {
  private metrics = new Map<string, number>();

  start(label: string): void {
    this.metrics.set(label, performance.now());
  }

  end(label: string): number | null {
    const startTime = this.metrics.get(label);
    if (startTime) {
      const duration = performance.now() - startTime;
      this.metrics.delete(label);
      return duration;
    }
    return null;
  }

  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }
}

export default {};
