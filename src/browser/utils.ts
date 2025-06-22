// Utility functions
/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @param {boolean} immediate - Whether to call the function immediately
 * @returns {Function} - The debounced function
 */
export function debounce(
  func: (...args: unknown[]) => void,
  wait: number = 300,
  immediate: boolean = false
): (...args: any[]) => void {
  let timeout: ReturnType<typeof setTimeout> | null;
  return function executedFunction(...args: any[]) {
    const context = this;
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

/**
 * Sanitize user input to prevent XSS attacks
 * @param {string} str - The string to sanitize
 * @returns {string} - The sanitized string
 */
export function sanitizeInput(str: string | null | undefined): string {
  if (str == null) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Trap focus within a modal and handle Escape key
 * @param {HTMLElement} modalElement
 * @returns {Function} cleanup
 */
export function trapFocus(modalElement: HTMLElement) {
  if (!modalElement) return () => {};

  const focusableSelectors =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const focusableElements = Array.from(modalElement.querySelectorAll(focusableSelectors)).filter(
    el => !el.disabled
  );
  const first = focusableElements[0];
  const last = focusableElements[focusableElements.length - 1];
  const previouslyFocused = document.activeElement;

  function handleKeydown(e) {
    if (e.key === 'Tab') {
      if (focusableElements.length === 0) {
        e.preventDefault();
        return;
      }
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    if (e.key === 'Escape') {
      const closeBtn = modalElement.querySelector('.close-modal');
      if (closeBtn) closeBtn.click();
    }
  }

  modalElement.addEventListener('keydown', handleKeydown);
  if (first) first.focus();

  return function cleanup() {
    modalElement.removeEventListener('keydown', handleKeydown);
    if (previouslyFocused && previouslyFocused.focus) previouslyFocused.focus();
  };
}

/**
 * Enhanced cache implementation with LRU strategy
 */
export class Cache {
  constructor(ttl = 5 * 60 * 1000, maxSize = 1000) {
    this.cache = new Map();
    this.ttl = ttl;
    this.maxSize = maxSize;
    this.accessOrder = [];
  }

  set(key, value) {
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.accessOrder.shift();
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
    });
    this.updateAccessOrder(key);
  }

  get(key) {
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

  updateAccessOrder(key) {
    this.accessOrder = this.accessOrder.filter(k => k !== key);
    this.accessOrder.push(key);
  }

  clear() {
    this.cache.clear();
    this.accessOrder = [];
  }

  getSize() {
    return this.cache.size;
  }

  getKeys() {
    return Array.from(this.cache.keys());
  }
}

/**
 * Enhanced rate limiter with sliding window
 */
export class RateLimiter {
  constructor(maxRequests = 10, timeWindow = 60000) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
    this.requests = new Map();
  }

  canMakeRequest(key) {
    const now = Date.now();
    const userRequests = this.requests.get(key) || [];

    // Remove old requests
    const recentRequests = userRequests.filter(time => now - time < this.timeWindow);

    if (recentRequests.length >= this.maxRequests) {
      return false;
    }

    recentRequests.push(now);
    this.requests.set(key, recentRequests);
    return true;
  }

  getRemainingRequests(key) {
    const now = Date.now();
    const userRequests = this.requests.get(key) || [];
    const recentRequests = userRequests.filter(time => now - time < this.timeWindow);
    return this.maxRequests - recentRequests.length;
  }

  reset(key) {
    this.requests.delete(key);
  }
}

/**
 * Enhanced pagination with sorting and filtering
 */
export class Pagination {
  constructor(items, itemsPerPage = 10) {
    this.items = items;
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.totalPages = Math.ceil(items.length / itemsPerPage);
  }

  getCurrentPage() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.items.slice(start, end);
  }

  getTotalPages() {
    return this.totalPages;
  }

  setPage(page) {
    if (page < 1) page = 1;
    if (page > this.totalPages) page = this.totalPages;
    this.currentPage = page;
  }

  setItems(items) {
    this.items = items;
    this.totalPages = Math.ceil(items.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
  }

  getPageInfo() {
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

/**
 * Enhanced undo/redo manager with action grouping
 */
export class UndoRedoManager {
  constructor() {
    this.undoStack = [];
    this.redoStack = [];
    this.maxStackSize = 50;
    this.currentGroup = null;
  }

  push(action) {
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

  beginGroup() {
    this.currentGroup = { actions: [] };
  }

  endGroup() {
    if (this.currentGroup && this.currentGroup.actions.length > 0) {
      this.undoStack.push(this.currentGroup);
      this.redoStack = [];

      if (this.undoStack.length > this.maxStackSize) {
        this.undoStack.shift();
      }
    }
    this.currentGroup = null;
  }

  undo() {
    if (this.undoStack.length === 0) return null;

    const action = this.undoStack.pop();
    this.redoStack.push(action);
    return action;
  }

  redo() {
    if (this.redoStack.length === 0) return null;

    const action = this.redoStack.pop();
    this.undoStack.push(action);
    return action;
  }

  canUndo() {
    return this.undoStack.length > 0;
  }

  canRedo() {
    return this.redoStack.length > 0;
  }

  clear() {
    this.undoStack = [];
    this.redoStack = [];
    this.currentGroup = null;
  }
}

/**
 * Validation helper
 */
export class Validator {
  static validatePoint(point) {
    const errors = [];

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

/**
 * Performance monitoring
 */
export class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
  }

  start(label) {
    this.metrics.set(label, performance.now());
  }

  end(label) {
    const startTime = this.metrics.get(label);
    if (startTime) {
      const duration = performance.now() - startTime;
      this.metrics.delete(label);
      return duration;
    }
    return null;
  }

  getMetrics() {
    return Object.fromEntries(this.metrics);
  }
}
