"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const create_blog_1 = __importDefault(require("../../controllers/v1/blog/create_blog"));
const authenticate_1 = __importDefault(require("../../middlewares/authenticate"));
const authorize_1 = __importDefault(require("../../middlewares/authorize"));
const upload_banner_image_1 = __importDefault(require("../../middlewares/upload_banner_image"));
const express_validator_1 = require("express-validator");
const validation_error_1 = __importDefault(require("../../middlewares/validation_error"));
const get_all_blogs_1 = __importDefault(require("../../controllers/v1/blog/get_all_blogs"));
const get_blog_1 = __importDefault(require("../../controllers/v1/blog/get_blog"));
const delete_blog_1 = __importDefault(require("../../controllers/v1/blog/delete_blog"));
const get_blogs_by_user_1 = __importDefault(require("../../controllers/v1/blog/get_blogs_by_user"));
const get_blog_by_slug_1 = __importDefault(require("../../controllers/v1/blog/get_blog_by_slug"));
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)();
router.post('/', authenticate_1.default, (0, authorize_1.default)(['admin']), upload.single('banner_image'), (0, upload_banner_image_1.default)('post'), (0, express_validator_1.body)('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 180 })
    .withMessage('Title must be less than 180 characters'), (0, express_validator_1.body)('content').trim().notEmpty().withMessage('Content is required'), (0, express_validator_1.body)('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be one of the value, status or published'), validation_error_1.default, create_blog_1.default);
router.get('/', authenticate_1.default, (0, authorize_1.default)(['admin', 'user']), (0, express_validator_1.query)('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 to 50'), (0, express_validator_1.query)('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Query must be a positive integer'), validation_error_1.default, get_all_blogs_1.default);
router.get('/:blogId', authenticate_1.default, (0, authorize_1.default)(['admin']), (0, express_validator_1.param)('blogId')
    .notEmpty()
    .withMessage('Blog id is required')
    .isMongoId()
    .withMessage('Invalid blog id'), validation_error_1.default, get_blog_1.default);
router.delete('/:blogId', authenticate_1.default, (0, authorize_1.default)(['admin']), (0, express_validator_1.param)('blogId')
    .notEmpty()
    .withMessage('Blog id is required')
    .isMongoId()
    .withMessage('Invalid blog id'), validation_error_1.default, delete_blog_1.default);
router.get('/user/:userId', authenticate_1.default, (0, authorize_1.default)(['admin']), (0, express_validator_1.query)('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 to 50'), (0, express_validator_1.query)('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Query must be a positive integer'), (0, express_validator_1.param)('userId')
    .notEmpty()
    .withMessage('User id is required')
    .isMongoId()
    .withMessage('Invalid user id'), validation_error_1.default, get_blogs_by_user_1.default);
router.get('/:slug', authenticate_1.default, (0, authorize_1.default)(['admin', 'user']), (0, express_validator_1.param)('slug').notEmpty().withMessage('Slug is required'), validation_error_1.default, get_blog_by_slug_1.default);
exports.default = router;
