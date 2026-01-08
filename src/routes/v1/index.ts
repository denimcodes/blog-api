/**
 * @copyright 2026 Denimsun Basumatary
 * @license Apache-2.0
 */

import { Router } from 'express';

import authRoutes from './auth';
import userRoutes from './user';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API is live',
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;
