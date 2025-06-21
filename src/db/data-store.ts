import { MapPoint } from '../types/map.types';
import { User } from '../types/user.types';

export interface DataStore {
  listUsers(): Promise<User[]>;
  getUser(id: string): Promise<User | undefined>;
  createUser(user: User): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;
  listMaps(): Promise<MapPoint[]>;
  getMap(id: string): Promise<MapPoint | undefined>;
  createMap(point: MapPoint): Promise<MapPoint>;
  updateMap(id: string, data: Partial<MapPoint>): Promise<MapPoint | undefined>;
  deleteMap(id: string): Promise<boolean>;
  reset(): void;
}

export type { MapPoint, User };
