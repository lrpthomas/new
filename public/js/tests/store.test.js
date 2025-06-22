import { store, performanceMonitor } from '../store.js';

describe('store module', () => {
  test('performanceMonitor is exported', () => {
    expect(performanceMonitor).toBeDefined();
    expect(typeof performanceMonitor.start).toBe('function');
  });

  test('store exposes performanceMonitor instance', () => {
    expect(store.performanceMonitor).toBeDefined();
  });
});
