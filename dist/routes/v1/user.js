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
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const authenticate_1 = __importDefault(require("../../middlewares/authenticate"));
const authorize_1 = __importDefault(require("../../middlewares/authorize"));
const get_current_user_1 = __importDefault(require("../../controllers/v1/user/get_current_user"));
const update_current_user_1 = __importDefault(require("../../controllers/v1/user/update_current_user"));
const user_1 = __importDefault(require("../../models/user"));
const validation_error_1 = __importDefault(require("../../middlewares/validation_error"));
const delete_current_user_1 = __importDefault(require("../../controllers/v1/user/delete_current_user"));
const get_all_users_1 = __importDefault(require("../../controllers/v1/user/get_all_users"));
const delete_user_1 = __importDefault(require("../../controllers/v1/user/delete_user"));
const router = (0, express_1.Router)();
router.get('/current', authenticate_1.default, (0, authorize_1.default)(['admin', 'user']), get_current_user_1.default);
router.put('/current', authenticate_1.default, (0, authorize_1.default)(['admin', 'user']), (0, express_validator_1.body)('username')
    .optional()
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage('Username must be between 2 and 20 characters')
    .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    const exists = yield user_1.default.exists({ username: value });
    if (exists) {
        throw new Error('This username is already in use');
    }
})), (0, express_validator_1.body)('email')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Email must be less than 50 characters')
    .isEmail()
    .withMessage('Invalid email address')
    .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    const exists = yield user_1.default.exists({ email: value });
    if (exists) {
        throw new Error('This email is already in use');
    }
})), (0, express_validator_1.body)('password')
    .optional()
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password must be atleast 6 characters long'), (0, express_validator_1.body)('firstName')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('First name must be less than 20 characters'), (0, express_validator_1.body)('lastName')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Last name must be less than 20 characters'), (0, express_validator_1.body)(['website, facebook, instagram, youtube, x, linkedin'])
    .optional()
    .trim()
    .isURL()
    .withMessage('Invalid URL')
    .isLength({ max: 1000 })
    .withMessage('Url must be less than 1000 characters'), validation_error_1.default, update_current_user_1.default);
router.delete('/current', authenticate_1.default, (0, authorize_1.default)(['admin', 'user']), delete_current_user_1.default);
router.get('/', authenticate_1.default, (0, authorize_1.default)(['admin']), (0, express_validator_1.query)('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 to 50'), (0, express_validator_1.query)('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Query must be a positive integer'), validation_error_1.default, get_all_users_1.default);
router.delete('/:userId', authenticate_1.default, (0, authorize_1.default)(['admin']), (0, express_validator_1.param)('userId').notEmpty().isMongoId().withMessage('Invalid user id'), delete_user_1.default);
exports.default = router;
