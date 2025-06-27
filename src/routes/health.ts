// MP-5: Health check and monitoring endpoints
import express from 'express';

const router = express.Router();

interface HealthCheck {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
}

router.get('/health', (req, res) => {
  const healthCheck: HealthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  };
  
  res.status(200).json(healthCheck);
});

router.get('/ready', (req, res) => {
  // Add any readiness checks here (database connections, etc.)
  res.status(200).json({ status: 'ready' });
});

export default router;
