import { logger } from '@/lib/winston';
import { Request, Response } from 'express';
import Blog from '@/models/blog';

const getBlogBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;
  
  try {
    const blog = await Blog.findOne({ slug });
    if (!blog) {
      return res.status(404).json({ code: 'NotFound', error: 'Blog not found' });
    }
    res.json(blog);
  } catch (err) {
    res
      .status(500)
      .json({ code: 'ServerError', error: 'Internal Server Error' });
    
    logger.error('Error while getting blog by slug', err);
  }
};

export default getBlogBySlug;
