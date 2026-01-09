/**
 * @copyright 2026 Denimsun Basumatary
 * @license Apache-2.0
 */

import { NextFunction, Request, Response } from 'express';
import uploadToCloudinary from '@/lib/cloudinary';
import { logger } from '@/lib/winston';
import { UploadApiErrorResponse } from 'cloudinary';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

const uploadBannerImage = (method: 'put' | 'post') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (method === 'put' && !req.file) {
      return next();
    }
    if (!req.file) {
      return res.status(400).json({
        code: 'ValidationError',
        message: 'Banner image is required',
      });
    }

    if (req.file.size > MAX_FILE_SIZE) {
      return res.status(413).json({
        code: 'ValidationError',
        message: 'File size must be less than 2MB',
      });
    }

    try {
      const { blogId } = req.params;
      // const blog = await Blog.findById(blogId).select('banner.publicId').exec();

      const data = await uploadToCloudinary(
        req.file.buffer,
        // blog?.banner.publicId.replace('/blog-api', '')
      );
      if (!data) {
        res.status(500).json({
          code: 'ServerError',
          message: 'Internal server error',
        });

        logger.error('Error while uploading banner image to cloudinary', {
          blogId,
          // publicId: blog?.banner.publicId
        });

        return;
      }

      const newBanner = {
        publicId: data.public_id,
        url: data.secure_url,
        width: data.width,
        height: data.width,
      };
      logger.info('Blog banner uploaded to cloudinary', {
        banner: newBanner,
      });

      req.body.banner = newBanner;

      next();
    } catch (err: UploadApiErrorResponse | any) {
      res.status(err.http_code).json({
        code: err.http_code < 500 ? 'ValidationError' : err.name,
        message: err.message,
      });

      logger.error('Error while uploading banner image to Cloudinary', err);
    }
  };
};

export default uploadBannerImage;
