/**
 * @copyright 2026 Denimsun Basumatary
 * @license Apache-2.0
 */

import { Router } from 'express';
import { body, param, query } from 'express-validator';

import authenticate from '@/middlewares/authenticate';
import authorize from '@/middlewares/authorize';
import getCurrentUser from '@/controllers/v1/user/get_current_user';
import updateCurrentUser from '@/controllers/v1/user/update_current_user';
import User from '@/models/user';
import validationError from '@/middlewares/validation_error';
import deleteCurrentUser from '@/controllers/v1/user/delete_current_user';
import getAllUsers from '@/controllers/v1/user/get_all_users';
import getUser from '@/controllers/v1/user/get_user';
import deleteUser from '@/controllers/v1/user/delete_user';

const router = Router();

router.get(
  '/current',
  authenticate,
  authorize(['admin', 'user']),
  getCurrentUser,
);
router.put(
  '/current',
  authenticate,
  authorize(['admin', 'user']),
  body('username')
    .optional()
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage('Username must be between 2 and 20 characters')
    .custom(async (value) => {
      const exists = await User.exists({ username: value });
      if (exists) {
        throw new Error('This username is already in use');
      }
    }),
  body('email')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Email must be less than 50 characters')
    .isEmail()
    .withMessage('Invalid email address')
    .custom(async (value) => {
      const exists = await User.exists({ email: value });
      if (exists) {
        throw new Error('This email is already in use');
      }
    }),
  body('password')
    .optional()
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password must be atleast 6 characters long'),
  body('firstName')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('First name must be less than 20 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Last name must be less than 20 characters'),
  body(['website, facebook, instagram, youtube, x, linkedin'])
    .optional()
    .trim()
    .isURL()
    .withMessage('Invalid URL')
    .isLength({ max: 1000 })
    .withMessage('Url must be less than 1000 characters'),
  validationError,
  updateCurrentUser,
);
router.delete(
  '/current',
  authenticate,
  authorize(['admin', 'user']),
  deleteCurrentUser,
);

router.get(
  '/',
  authenticate,
  authorize(['admin']),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 to 50'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Query must be a positive integer'),
  validationError,
  getAllUsers,
);

router.get(
  '/:userId',
  authenticate,
  authorize(['admin']),
  param('userId').notEmpty().isMongoId().withMessage('Invalid user id'),
  getUser
)

router.delete(
  '/:userId',
  authenticate,
  authorize(['admin']),
  param('userId').notEmpty().isMongoId().withMessage('Invalid user id'),
  deleteUser
)

export default router;
