import { Request, Response } from 'express';
import { logger } from '@/lib/winston';
import Blog from '@/models/blog';
import config from '@/config';

const getAllBlogs = async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string) || config.defaultQueryLimit;
        const offset = parseInt(req.query.offset as string) || config.defaultQueryOffset;
        const total = await Blog.countDocuments();

        const blogs = await Blog.find()
            .select('-__v')
            .limit(limit)
            .skip(offset)
            .lean()
            .exec();

        res.json({
            limit,
            offset,
            total,
            blogs,
        });
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