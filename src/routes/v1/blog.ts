import { Router } from 'express';
import multer from 'multer';

import createBlog from '@/controllers/v1/blog/create_blog';
import authenticate from '@/middlewares/authenticate';
import authorize from '@/middlewares/authorize';
import uploadBannerImage from '@/middlewares/upload_banner_image';
import { body, param, query } from 'express-validator';
import validationError from '@/middlewares/validation_error';
import getAllBlogs from '@/controllers/v1/blog/get_all_blogs';
import getBlog from '@/controllers/v1/blog/get_blog';
import deleteBlog from '@/controllers/v1/blog/delete_blog';
import getBlogsByUser from '@/controllers/v1/blog/get_blogs_by_user';

const router = Router();

const upload = multer();

router.post(
  '/',
  authenticate,
  authorize(['admin']),
  upload.single('banner_image'),
  uploadBannerImage('post'),
  // body('banner_image').notEmpty().withMessage('Banner image is required'),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 180 })
    .withMessage('Title must be less than 180 characters'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be one of the value, status or published'),
  validationError,
  createBlog,
);

router.get(
  '/',
  authenticate,
  authorize(['admin', 'user']),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 to 50'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Query must be a positive integer'),
  validationError,
  getAllBlogs,
);

router.get(
  '/:blogId',
  authenticate,
  authorize(['admin']),
  param('blogId')
    .notEmpty()
    .withMessage('Blog id is required')
    .isMongoId()
    .withMessage('Invalid blog id'),
  validationError,
  getBlog,
);

router.delete(
  '/:blogId',
  authenticate,
  authorize(['admin']),
  param('blogId')
    .notEmpty()
    .withMessage('Blog id is required')
    .isMongoId()
    .withMessage('Invalid blog id'),
  validationError,
  deleteBlog,
);

router.get(
  '/user/:userId',
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
  param('userId')
    .notEmpty()
    .withMessage('User id is required')
    .isMongoId()
    .withMessage('Invalid user id'),
  validationError,
  getBlogsByUser,
);

export default router;
