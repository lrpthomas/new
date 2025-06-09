import { Router } from 'express';
import { mapRoutes } from './map.routes';
import { userRoutes } from './user.routes';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount route modules
router.use('/maps', mapRoutes);
router.use('/users', userRoutes);

export default router; 