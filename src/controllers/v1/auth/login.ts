/**
 * @copyright 2026 Denimsun Basumatary
 * @license Apache-2.0
 */

import User from '@/models/user';
import Token from '@/models/token';

import type { Request, Response } from 'express';
import type { IUser } from '@/models/user';
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import { logger } from '@/lib/winston';
import config from '@/config';

type UserData = Pick<IUser, 'email' | 'password'>;

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as UserData;

  try {
    const user = await User.findOne({
      email,
    })
    .select('username email password role')
    .lean()
    .exec();
    
    if (!user) {
      res.status(401).json({
        code: 'NotFound',
        message: 'User not found'
      })
      return;
    }

    // Generate access token and refresh token for new user
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store refresh token in db
    await Token.create({ token: refreshToken, userId: user._id });
    logger.info('Refresh token created for user', {
      userId: user._id,
      token: refreshToken,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(201).json({
      user: {
        username: user.username,
        email: user.email,
        role: user.role
      },
      accessToken,
    });

    logger.info('User logged in successfully', user);
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });

    logger.error('Error during login', err);
  }
};

export default login;