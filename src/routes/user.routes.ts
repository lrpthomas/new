import { Router, Request, Response } from 'express';

const router = Router();

// GET /users - list all users
router.get('/', (req: Request, res: Response) => {
  // TODO: fetch users from database
  res.status(501).json({ message: 'Not implemented' });
});

// GET /users/:id - get a single user
router.get('/:id', (req: Request, res: Response) => {
  // TODO: fetch user by id
  res.status(501).json({ message: 'Not implemented' });
});

// POST /users - create a new user
router.post('/', (req: Request, res: Response) => {
  // TODO: create user
  res.status(501).json({ message: 'Not implemented' });
});

// PUT /users/:id - update an existing user
router.put('/:id', (req: Request, res: Response) => {
  // TODO: update user by id
  res.status(501).json({ message: 'Not implemented' });
});

// DELETE /users/:id - delete a user
router.delete('/:id', (req: Request, res: Response) => {
  // TODO: delete user by id
  res.status(501).json({ message: 'Not implemented' });
});

export const userRoutes = router;
