import { useEffect } from 'react';
import { MapPoint } from '../types';
import {
  getQueuedOperations,
  clearQueuedOperations,
  OfflineOperation,
} from '../services/storage/indexed-db';

async function pushOperations(ops: OfflineOperation[]): Promise<void> {
  await Promise.all(
    ops.map(op => {
      if (op.type === 'update') {
        const point = op.payload as MapPoint;
        return fetch(`/api/maps/${point.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(point),
        });
      }
      return fetch(`/api/maps/${(op.payload as { id: string }).id}`, {
        method: 'DELETE',
      });
    })
  );
}

export const useOfflineSync = (): void => {
  useEffect(() => {
    const sync = async (): Promise<void> => {
      const ops = await getQueuedOperations();
      if (ops.length === 0) return;
      try {
        await pushOperations(ops);
        await clearQueuedOperations();
      } catch (err) {
        console.error('Failed to sync offline operations', err);
      }
    };

    window.addEventListener('online', sync);
    return () => {
      window.removeEventListener('online', sync);
    };
  }, []);
};

export default useOfflineSync;
