/**
 * @copyright 2026 Denimsun Basumatary
 * @license Apache-2.0
 */

import { logger } from '@/lib/winston';
import { Request, Response } from 'express';
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';
import Blog, { IBlog } from '@/models/blog';

type BlogData = Pick<IBlog, 'content' | 'title' | 'status' | 'banner'>;

const window = new JSDOM('').window;
const purify = DOMPurify(window);

const createBlog = async (req: Request, res: Response) => {
  const { content, title, status, banner } = req.body as BlogData;
  const userId = req.userId;

  const cleanContent = purify.sanitize(content);
  try {
    const newBlog = await Blog.create({
      content: cleanContent,
      title,
      status,
      banner,
      author: userId,
    });
    return res.status(201).json({ blog: newBlog });
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });

    logger.error('Error when creating a blog', err);
  }
};

export default createBlog;
