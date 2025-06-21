import { store } from './store.js';
import { PerformanceMonitor } from './utils.js';

const performanceMonitor = new PerformanceMonitor();

export { performanceMonitor, store };
