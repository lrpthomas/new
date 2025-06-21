import { DataStore, MapPoint, User } from './data-store';

// Placeholder implementation for future persistent storage
export const fileStore: DataStore = {
  async listUsers(): Promise<User[]> {
    throw new Error('FileStore not implemented');
  },
  async getUser(id: string): Promise<User | undefined> {
    throw new Error('FileStore not implemented');
  },
  async createUser(_user: User): Promise<User> {
    throw new Error('FileStore not implemented');
  },
  async updateUser(id: string, _data: Partial<User>): Promise<User | undefined> {
    throw new Error('FileStore not implemented');
  },
  async deleteUser(_id: string): Promise<boolean> {
    throw new Error('FileStore not implemented');
  },
  async listMaps(): Promise<MapPoint[]> {
    throw new Error('FileStore not implemented');
  },
  async getMap(_id: string): Promise<MapPoint | undefined> {
    throw new Error('FileStore not implemented');
  },
  async createMap(point: MapPoint): Promise<MapPoint> {
    throw new Error('FileStore not implemented');
  },
  async updateMap(_id: string, _data: Partial<MapPoint>): Promise<MapPoint | undefined> {
    throw new Error('FileStore not implemented');
  },
  async deleteMap(_id: string): Promise<boolean> {
    throw new Error('FileStore not implemented');
  },
  reset() {
    // no-op for placeholder
  },
};

export default fileStore;
