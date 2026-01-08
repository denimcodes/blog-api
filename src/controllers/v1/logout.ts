/**
 * @copyright 2026 Denimsun Basumatary
 * @license Apache-2.0
 */


import { logger } from '@/lib/winston';
import type { Request, Response } from 'express';
import Token from '@/models/token'
import config from '@/config';

const logout = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const refreshToken = req.cookies.refreshToken;
    
    if (refreshToken) {
      await Token.deleteOne({userId})
      
      logger.info('User refresh token deleted successfully', {
        userId,
        token: refreshToken
      })
    }
    
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict'
    })
    logger.info('User logged out successfully', {
      userId,
      token: refreshToken
    })
    res.sendStatus(204)
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });

    logger.error('Error during logout', err);
  }
};

export default logout;