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
const cloudinary_1 = __importDefault(require("../lib/cloudinary"));
const winston_1 = require("../lib/winston");
const MAX_FILE_SIZE = 2 * 1024 * 1024;
const uploadBannerImage = (method) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        if (method === 'put' && !req.file) {
            return next();
        }
        if (!req.file) {
            return res.status(400).json({
                code: 'ValidationError',
                message: 'Banner image is required',
            });
        }
        if (req.file.size > MAX_FILE_SIZE) {
            return res.status(413).json({
                code: 'ValidationError',
                message: 'File size must be less than 2MB',
            });
        }
        try {
            const { blogId } = req.params;
            const data = yield (0, cloudinary_1.default)(req.file.buffer);
            if (!data) {
                res.status(500).json({
                    code: 'ServerError',
                    message: 'Internal server error',
                });
                winston_1.logger.error('Error while uploading banner image to cloudinary', {
                    blogId,
                });
                return;
            }
            const newBanner = {
                publicId: data.public_id,
                url: data.secure_url,
                width: data.width,
                height: data.width,
            };
            winston_1.logger.info('Blog banner uploaded to cloudinary', {
                banner: newBanner,
            });
            req.body.banner = newBanner;
            next();
        }
        catch (err) {
            res.status(err.http_code).json({
                code: err.http_code < 500 ? 'ValidationError' : err.name,
                message: err.message,
            });
            winston_1.logger.error('Error while uploading banner image to Cloudinary', err);
        }
    });
};
exports.default = uploadBannerImage;
