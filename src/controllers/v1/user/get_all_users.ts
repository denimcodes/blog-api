/**
 * @copyright 2026 Denimsun Basumatary
 * @license Apache-2.0
 */

import { Request, Response } from 'express';
import { logger } from '@/lib/winston';
import User from '@/models/user';
import config from '@/config';

const getAllUsers = async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || config.defaultQueryLimit;
  const offset =
    parseInt(req.query.offset as string) || config.defaultQueryOffset;
  const total = await User.countDocuments();

  try {
    const users = await User.find()
      .select('-__v')
      .limit(limit)
      .skip(offset)
      .lean()
      .exec();

    res.json({
      limit,
      offset,
      total,
      users
    });
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'An error occurred while fetching all users',
      error: err,
    });

    logger.error('Error when getting all users', err);
  }
};

export default getAllUsers;
