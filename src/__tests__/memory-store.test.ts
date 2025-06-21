/** @jest-environment node */
import memoryStore from '../db/memory-store';
import { MapPoint, User } from '../types';

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

  it('updates and deletes a user', async () => {
    const user: User = { id: '2', name: 'Bob', email: 'b@example.com' };
    await memoryStore.createUser(user);
    const updated = await memoryStore.updateUser('2', { name: 'Bobby' });
    expect(updated?.name).toBe('Bobby');
    const removed = await memoryStore.deleteUser('2');
    expect(removed).toBe(true);
    const missing = await memoryStore.getUser('2');
    expect(missing).toBeUndefined();
  });

  it('updates and deletes a map point', async () => {
    const point: MapPoint = { id: 'm2', position: { lat: 1, lng: 1 }, properties: {} };
    await memoryStore.createMap(point);
    const updated = await memoryStore.updateMap('m2', { position: { lat: 2, lng: 2 } });
    expect(updated?.position.lat).toBe(2);
    const removed = await memoryStore.deleteMap('m2');
    expect(removed).toBe(true);
    const missing = await memoryStore.getMap('m2');
    expect(missing).toBeUndefined();
  });
});
