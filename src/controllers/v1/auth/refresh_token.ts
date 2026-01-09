/**
 * @copyright 2026 Denimsun Basumatary
 * @license Apache-2.0
 */

import { Request, Response } from 'express';
import Token from '@/models/token';
import { generateAccessToken, verifyRefreshToken } from '@/lib/jwt';
import { Types } from 'mongoose';
import { logger } from '@/lib/winston';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken as string;

  try {
    const tokenExists = await Token.exists({ token: refreshToken });
    if (!tokenExists) {
      res.status(401).json({
        code: 'AuthenticationError',
        error: 'Invalid refresh token',
      });
      return;
    }

    const jwtPayload = verifyRefreshToken(refreshToken) as {
      userId: Types.ObjectId;
    };
    const accessToken = generateAccessToken(jwtPayload.userId);

    res.json({
      accessToken,
    });
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'Refresh token expired, please login again',
      });
      return;
    }

    if (err instanceof JsonWebTokenError) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'Invalid refresh token',
      });
      return;
    }

    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });

    logger.error('Failed to refresh token', err);
  }
};

export default refreshToken;
