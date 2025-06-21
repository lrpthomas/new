import memoryStore from './memory-store';
export type { DataStore } from './data-store';

// In the future this could switch based on config
export const dataStore = memoryStore;

export default dataStore;
