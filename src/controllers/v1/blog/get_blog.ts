import { Request, Response } from 'express';
import { logger } from '@/lib/winston';
import Blog from '@/models/blog';

const getBlog = async (req: Request, res: Response) => {
  const blogId = req.params.blogId;

  try {
    const blog = await Blog.findById(blogId)
      .select('-__v -banner.publicId')
      .populate('author', '-createdAt -updatedAt -__v')
      .lean()
      .exec();
    if (!blog) {
      return res.status(404).json({
        code: 'BlogNotFound',
        message: 'Blog not found',
      });
    }
    res.json({ blog });
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });

    logger.error('Error when getting a blog', err);
  }
};

export default getBlog;
