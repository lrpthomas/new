import { store } from './store.js';
import { PerformanceMonitor } from './utils.js';

/**
 * Single instance used across modules for performance measurements.
 * Other state is now managed via store.js
 */
export const performanceMonitor = new PerformanceMonitor();
