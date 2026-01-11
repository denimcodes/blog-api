import { Request, Response } from 'express';
import Blog from '@/models/blog';
import User from '@/models/user';

interface QueryType {
  status?: 'published' | 'draft';
}

const getBlogsByUser = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const currentUserId = req.userId;
  const query: QueryType = {};

  const currentUser = await User.findById(currentUserId)
    .select('role')
    .lean()
    .exec();

  if (currentUser?.role === 'user') {
    query.status = 'published'
  }

  const total = await Blog.countDocuments({author: userId, ...query});
  try {
    const blogs = await Blog.find({ author: userId, query });
    if (blogs.length === 0) {
      return res.sendStatus(204);
    }

    return res.json({ blogs });
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'InternalServerError',
      error: err,
    });
  }
};

export default getBlogsByUser;
