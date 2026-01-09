import { Request, Response } from 'express';

import { logger } from '@/lib/winston';
import User from '@/models/user';

const deleteCurrentUser = async (req: Request, res: Response) => {
  const userId = req.userId;
  try {
    await User.deleteOne({ _id: userId });
    logger.info('A user account has been deleted', {
      userId,
    });
    return res.sendStatus(204);
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });

    logger.error('Error while deleting the user', err);
    return;
  }
};

export default deleteCurrentUser;
