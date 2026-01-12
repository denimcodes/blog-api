"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const user_1 = __importDefault(require("./user"));
const blog_1 = __importDefault(require("./blog"));
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.json({
        message: 'API is live',
        status: 'ok',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
    });
});
router.use('/auth', auth_1.default);
router.use('/users', user_1.default);
router.use('/blogs', blog_1.default);
exports.default = router;
