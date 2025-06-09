import { Router } from 'express';

export const mapRoutes = Router();

// placeholder route
mapRoutes.get('/', (req, res) => res.status(200).json([]));
