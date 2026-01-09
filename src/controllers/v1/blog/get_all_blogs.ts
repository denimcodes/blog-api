import { Request, Response } from 'express';
import { logger } from '@/lib/winston';
import Blog from '@/models/blog';
import User from '@/models/user';
import config from '@/config';

const getAllBlogs = async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string) || config.defaultQueryLimit;
        const offset = parseInt(req.query.offset as string) || config.defaultQueryOffset;
        const total = await Blog.countDocuments();

        const userId = req.userId;

        const user = await User.findById(userId).select('role').lean().exec();
        if (!user) {
            res.status(403).json({
                code: 'NotFound',
                message: 'Not found',
            });
            return;
        }

        // if user role is user, then only get blogs that are published
        type BlogStatus = 'draft' | 'published';

        const status: BlogStatus = user.role === 'user' ? 'draft' : 'published';
        const blogs = await Blog.find({ status })
            .select('-__v')
            .limit(limit)
            .skip(offset)
            .lean()
            .exec();

        res.json({ limit, offset, total, blogs });
    } catch (err) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal server error',
            error: err,
        });

        logger.error('Error when getting all blogs', err);
    }
};

export default getAllBlogs;