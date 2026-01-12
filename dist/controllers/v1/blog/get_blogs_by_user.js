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
const blog_1 = __importDefault(require("../../../models/blog"));
const user_1 = __importDefault(require("../../../models/user"));
const getBlogsByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const currentUserId = req.userId;
    const query = {};
    const currentUser = yield user_1.default.findById(currentUserId)
        .select('role')
        .lean()
        .exec();
    if ((currentUser === null || currentUser === void 0 ? void 0 : currentUser.role) === 'user') {
        query.status = 'published';
    }
    const total = yield blog_1.default.countDocuments(Object.assign({ author: userId }, query));
    try {
        const blogs = yield blog_1.default.find({ author: userId, query });
        if (blogs.length === 0) {
            return res.sendStatus(204);
        }
        return res.json({ blogs });
    }
    catch (err) {
        res.status(500).json({
            code: 'ServerError',
            message: 'InternalServerError',
            error: err,
        });
    }
});
exports.default = getBlogsByUser;
