// Utility functions

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @returns {Function} - The debounced function
 */
export function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Sanitize user input to prevent XSS attacks
 * @param {string} str - The string to sanitize
 * @returns {string} - The sanitized string
 */
export function sanitizeInput(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Simple cache implementation
 */
export class Cache {
    constructor(ttl = 5 * 60 * 1000) { // 5 minutes default TTL
        this.cache = new Map();
        this.ttl = ttl;
    }

    set(key, value) {
        this.cache.set(key, {
            value,
            timestamp: Date.now()
        });
    }

    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;

        if (Date.now() - item.timestamp > this.ttl) {
            this.cache.delete(key);
            return null;
        }

        return item.value;
    }

    clear() {
        this.cache.clear();
    }
}

/**
 * Rate limiter implementation
 */
export class RateLimiter {
    constructor(maxRequests = 10, timeWindow = 60000) { // 10 requests per minute default
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
}

/**
 * Pagination helper
 */
export class Pagination {
    constructor(items, itemsPerPage = 10) {
        this.items = items;
        this.itemsPerPage = itemsPerPage;
        this.currentPage = 1;
    }

    getCurrentPage() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.items.slice(start, end);
    }

    getTotalPages() {
        return Math.ceil(this.items.length / this.itemsPerPage);
    }

    setPage(page) {
        if (page < 1) page = 1;
        if (page > this.getTotalPages()) page = this.getTotalPages();
        this.currentPage = page;
    }
}

/**
 * Undo/Redo manager
 */
export class UndoRedoManager {
    constructor() {
        this.undoStack = [];
        this.redoStack = [];
        this.maxStackSize = 50;
    }

    push(action) {
        this.undoStack.push(action);
        this.redoStack = []; // Clear redo stack when new action is performed

        if (this.undoStack.length > this.maxStackSize) {
            this.undoStack.shift();
        }
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
}