import { Router, Request, Response } from 'express';
import dataStore from '../db';

export const mapRoutes = Router();

// GET /maps - list all map points
mapRoutes.get('/', async (_req: Request, res: Response) => {
  try {
    const maps = await dataStore.listMaps();
    res.status(200).json(maps);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch maps' });
  }
});

// GET /maps/:id - get a single map point
mapRoutes.get('/:id', async (req: Request, res: Response) => {
  try {
    const map = await dataStore.getMap(req.params.id);
    if (!map) {
      return res.status(404).json({ message: 'Map not found' });
    }
    res.status(200).json(map);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch map' });
  }
});

// POST /maps - create a new map point
mapRoutes.post('/', async (req: Request, res: Response) => {
  try {
    const map = await dataStore.createMap(req.body);
    res.status(201).json(map);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create map' });
  }
});

// PUT /maps/:id - update a map point
mapRoutes.put('/:id', async (req: Request, res: Response) => {
  try {
    const map = await dataStore.updateMap(req.params.id, req.body);
    if (!map) {
      return res.status(404).json({ message: 'Map not found' });
    }
    res.status(200).json(map);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update map' });
  }
});

// DELETE /maps/:id - delete a map point
mapRoutes.delete('/:id', async (req: Request, res: Response) => {
  try {
    const success = await dataStore.deleteMap(req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'Map not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete map' });
  }
});
