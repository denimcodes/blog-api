/**
 * @copyright 2026 Denimsun Basumatary
 * @license Apache-2.0
 */

import { Request, Response } from 'express';

import { logger } from '@/lib/winston';
import User from '@/models/user';

const getUser = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  if (!userId) {
    return res.status(404).json({
      code: 'UserNotFound',
      message: 'User not found',
    });
  }
  
  try {
    const user = await User.findById(userId).select('-__v').lean().exec();
    res.json({ user });
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });

    logger.error('Error when getting a user', err);
  }
};

export default getUser;
