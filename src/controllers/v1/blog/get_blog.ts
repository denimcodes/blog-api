import { Request, Response } from 'express';
import { logger } from '@/lib/winston';
import Blog from '@/models/blog';

const getBlog = async (req: Request, res: Response) => {
  const blogId = req.params.blogId;

  try {
    const blog = await Blog.findById(blogId).select('-__v').lean().exec();
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
