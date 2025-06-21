/** @jest-environment node */
import memoryStore from '../db/memory-store';
import { MapPoint } from '../types/map.types';
import { User } from '../types/user.types';

describe('memory store persistence', () => {
  beforeEach(() => {
    memoryStore.reset();
  });

  it('creates and retrieves a user', async () => {
    const user: User = { id: '1', name: 'Alice', email: 'a@example.com' };
    await memoryStore.createUser(user);
    const fetched = await memoryStore.getUser('1');
    expect(fetched).toEqual(user);
  });

  it('creates and lists map points', async () => {
    const point: MapPoint = { id: 'm1', position: { lat: 0, lng: 0 }, properties: {} };
    await memoryStore.createMap(point);
    const maps = await memoryStore.listMaps();
    expect(maps).toHaveLength(1);
    expect(maps[0]).toEqual(point);
  });
});
