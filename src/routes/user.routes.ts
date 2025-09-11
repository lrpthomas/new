import { Router, Request, Response } from 'express';
import dataStore from '../db';

const router = Router();

// GET /users - list all users
router.get('/', async (_req: Request, res: Response) => {
  try {
    const users = await dataStore.listUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// GET /users/:id - get a single user
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const user = await dataStore.getUser(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

// POST /users - create a new user
router.post('/', async (req: Request, res: Response) => {
  try {
    const user = await dataStore.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create user' });
  }
});

// PUT /users/:id - update an existing user
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const user = await dataStore.updateUser(req.params.id, req.body);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user' });
  }
});

// DELETE /users/:id - delete a user
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const success = await dataStore.deleteUser(req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

export { router as userRoutes };
