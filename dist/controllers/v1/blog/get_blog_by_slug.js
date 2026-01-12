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
const getBlogBySlug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug } = req.params;
    try {
        const blog = yield blog_1.default.findOne({ slug });
        if (!blog) {
            return res.status(404).json({ code: 'NotFound', error: 'Blog not found' });
        }
        res.json(blog);
    }
    catch (err) {
        res
            .status(500)
            .json({ code: 'ServerError', error: 'Internal Server Error' });
        winston_1.logger.error('Error while getting blog by slug', err);
    }
});
exports.default = getBlogBySlug;
