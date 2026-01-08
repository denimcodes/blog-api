import { Request, Response } from 'express';

import User from '@/models/user';
import { logger } from '@/lib/winston';

const getCurrentUser = async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId).select('-__v').lean().exec();

    if (!user) {
      res.status(403).json({
        code: 'NotFound',
        message: 'Not found',
      });
      return;
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });

    logger.error('Error while getting current user', err);
  }
};

export default getCurrentUser;
