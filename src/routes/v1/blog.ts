import { Router } from 'express';
import multer from 'multer';

import createBlog from '@/controllers/v1/blog/create_blog';
import authenticate from '@/middlewares/authenticate';
import authorize from '@/middlewares/authorize';
import uploadBannerImage from '@/middlewares/upload_banner_image';
import { body } from 'express-validator';
import validationError from '@/middlewares/validation_error';

const router = Router();

const upload = multer();

router.post(
  '/',
  authenticate,
  authorize(['admin']),
  upload.single('banner_image'),
  uploadBannerImage('post'),
  body('banner_image').notEmpty().withMessage('Banner image is required'),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 180 })
    .withMessage('Title must be less than 180 characters'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required'),
  body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be one of the value, status or published'),
  validationError,
  createBlog,
);

export default router;
