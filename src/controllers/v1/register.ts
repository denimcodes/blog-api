/**
 * @copyright 2026 Denimsun Basumatary
 * @license Apache-2.0
 */

import { logger } from '@/lib/winston';

import type { Request, Response } from 'express';

import type { IUser } from '@/models/user';
import User from '@/models/user';
import Token from '@/models/token';
import { genUsername } from '@/utils';
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import config from '@/config';

type UserData = Pick<IUser, 'email' | 'password' | 'role'>;

const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, role } = req.body as UserData;

  const username = genUsername();
  try {
    const newUser = await User.create({
      username,
      email,
      password,
      role,
    });

    // Generate access token and refresh token for new user
    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);
    
    // Store refresh token in db
    await Token.create({ token: refreshToken, userId: newUser._id });
    logger.info('Refresh token created for user', {
      userId: newUser._id,
      token: refreshToken
    })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(201).json({
      user: {
        username,
        email,
        role,
      },
      accessToken
    });
    
    logger.info('User registered successfully', newUser);
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });

    logger.error('Error during registration', err);
  }
};

export default register;
