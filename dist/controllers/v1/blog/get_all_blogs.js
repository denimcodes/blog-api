"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("../../../lib/winston");
const blog_1 = __importDefault(require("../../../models/blog"));
const user_1 = __importDefault(require("../../../models/user"));
const config_1 = __importDefault(require("../../../config"));
const getAllBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const limit = parseInt(req.query.limit) || config_1.default.defaultQueryLimit;
        const offset = parseInt(req.query.offset) || config_1.default.defaultQueryOffset;
        const userId = req.userId;
        const user = yield user_1.default.findById(userId).select('role').lean().exec();
        if (!user) {
            res.status(403).json({
                code: 'NotFound',
                message: 'Not found',
            });
            return;
        }
        let blogQuery = {};
        if (user.role === 'user') {
            blogQuery.status = 'published';
        }
        const total = yield blog_1.default.countDocuments({ blogQuery });
        const blogs = yield blog_1.default.find(blogQuery)
            .select('-__v -banner.publicId')
            .populate('author', '-createdAt -updatedAt -__v')
            .limit(limit)
            .skip(offset)
            .sort({ createdAt: -1 })
            .lean()
            .exec();
        res.json({ limit, offset, total, blogs });
    }
    catch (err) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal server error',
            error: err,
        });
        winston_1.logger.error('Error when getting all blogs', err);
    }
});
exports.default = getAllBlogs;
