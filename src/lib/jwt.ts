/**
 * @copyright 2026 Denimsun Basumatary
 * @license Apache-2.0
 */

import config from '@/config';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

export const generateAccessToken = (userId: Types.ObjectId) => {
  return jwt.sign({ userId }, config.JWT_ACCESS_SECRET, {
    expiresIn: config.ACCESS_TOKEN_EXPIRY,
    subject: 'accessApi'
  })
}

export const generateRefreshToken = (userId: Types.ObjectId) => {
  return jwt.sign({ userId }, config.JWT_REFRESH_SECRET, {
    expiresIn: config.REFRESH_TOKEN_EXPIRY,
    subject: 'accessToken'
  })
}

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, config.JWT_ACCESS_SECRET);
}

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, config.JWT_REFRESH_SECRET);
}