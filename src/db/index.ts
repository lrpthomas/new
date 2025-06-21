import memoryStore from './memory-store';
import fileStore from './file-store';
export type { DataStore } from './data-store';

// Select data store based on environment
export const dataStore =
  process.env.DATA_STORE === 'file' ? fileStore : memoryStore;

export default dataStore;
