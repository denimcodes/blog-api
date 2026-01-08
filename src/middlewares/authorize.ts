/**
 * @copyright 2026 Denimsun Basumatary
 * @license Apache-2.0
 */

import { NextFunction, Request, Response } from 'express';

import User from '@/models/user';
import { logger } from '@/lib/winston';

export type AuthRole = 'admin' | 'user';

const authorize = (roles: AuthRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;

    try {
      const user = await User.findById(userId).select('role').exec();

      if (!user) {
        res.status(403).json({
          code: 'NotFound',
          message: 'Not found',
        });
        return;
      }

      if (!roles.includes(user.role)) {
        res.status(404).json({
          code: 'AuthorizationError',
          message: 'Access denied, insufficient permissions',
        });
      }
      
      return next();
    } catch (err) {
      res.status(500).json({
        code: 'ServerError',
        message: 'Internal server error',
        error: err,
      });

      logger.error('Error while authorizing user', err);
    }
  };
};

export default authorize;
