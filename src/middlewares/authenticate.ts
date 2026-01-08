/**
 * @copyright 2026 Denimsun Basumatary
 * @license Apache-2.0
 */

import { verifyAccessToken } from '@/lib/jwt';
import { logger } from '@/lib/winston';
import { NextFunction, Request, Response } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { Types } from 'mongoose';

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({
      code: 'AuthenticationError',
      message: 'Access denied, no token provided',
    });
    return;
  }

  const [_, token] = authHeader.split(' ');
  try {
    const jwtPaylod = verifyAccessToken(token) as { userId: Types.ObjectId };
    req.userId = jwtPaylod.userId;
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'Token expired, please refresh the token',
      });
      return;
    }

    if (err instanceof JsonWebTokenError) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'Access token invalid',
      });
      return;
    }

    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });

    logger.error('Error during authentication', err);
  }

  next();
};

export default authenticate;
