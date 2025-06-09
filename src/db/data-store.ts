import { MapPoint } from '../types/map.types';
import { User } from '../types/user.types';

let users: User[] = [];
let maps: MapPoint[] = [];

export const dataStore = {
  async listUsers(): Promise<User[]> {
    return users;
  },
  async getUser(id: string): Promise<User | undefined> {
    return users.find(u => u.id === id);
  },
  async createUser(user: User): Promise<User> {
    users.push(user);
    return user;
  },
  async updateUser(id: string, data: Partial<User>): Promise<User | undefined> {
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return undefined;
    users[index] = { ...users[index], ...data };
    return users[index];
  },
  async deleteUser(id: string): Promise<boolean> {
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return false;
    users.splice(index, 1);
    return true;
  },
  async listMaps(): Promise<MapPoint[]> {
    return maps;
  },
  async getMap(id: string): Promise<MapPoint | undefined> {
    return maps.find(m => m.id === id);
  },
  async createMap(point: MapPoint): Promise<MapPoint> {
    maps.push(point);
    return point;
  },
  async updateMap(id: string, data: Partial<MapPoint>): Promise<MapPoint | undefined> {
    const index = maps.findIndex(m => m.id === id);
    if (index === -1) return undefined;
    maps[index] = { ...maps[index], ...data };
    return maps[index];
  },
  async deleteMap(id: string): Promise<boolean> {
    const index = maps.findIndex(m => m.id === id);
    if (index === -1) return false;
    maps.splice(index, 1);
    return true;
  },
  reset() {
    users = [];
    maps = [];
  },
};

export default dataStore;
