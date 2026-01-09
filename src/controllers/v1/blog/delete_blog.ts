import { Request, Response } from 'express';
import { logger } from '@/lib/winston';
import Blog from '@/models/blog';

const deleteBlog = async (req: Request, res: Response) => {
  const blogId = req.params.blogId;

  try {
    await Blog.deleteOne({ _id: blogId });
    logger.info('A blog has been deleted', {
      blogId,
    });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });

    logger.error('Error when deleting a blog', err);
  }
};

export default deleteBlog;
