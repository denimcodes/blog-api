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
const user_1 = __importDefault(require("../../../models/user"));
const winston_1 = require("../../../lib/winston");
const updateCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const { username, email, password, firstName, lastName, website, facebook, linkedin, x, instagram, youtube, } = req.body;
    try {
        const user = yield user_1.default.findById(userId).select('+password -__v').exec();
        if (!user) {
            return res.status(401).json({
                code: 'NotFound',
                message: 'User not found',
            });
        }
        if (username)
            user.username = username;
        if (email)
            user.email = email;
        if (password)
            user.password = password;
        if (firstName)
            user.firstName = firstName;
        if (lastName)
            user.lastName = lastName;
        if (!user.socialLinks)
            user.socialLinks = {};
        if (website)
            user.socialLinks.website = website;
        if (facebook)
            user.socialLinks.facebook = facebook;
        if (linkedin)
            user.socialLinks.linkedin = linkedin;
        if (x)
            user.socialLinks.x = x;
        if (instagram)
            user.socialLinks.instagram = instagram;
        if (youtube)
            user.socialLinks.youtube = youtube;
        yield user.save();
        winston_1.logger.info('User updated successfully', user);
        return res.status(200).json({
            user,
        });
    }
    catch (err) {
        return res.status(500).json({
            code: 'ServerError',
            message: 'Internal server error',
            error: err,
        });
    }
});
exports.default = updateCurrentUser;
