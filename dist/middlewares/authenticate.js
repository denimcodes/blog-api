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
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = require("../lib/jwt");
const winston_1 = require("../lib/winston");
const jsonwebtoken_1 = require("jsonwebtoken");
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer '))) {
        res.status(401).json({
            code: 'AuthenticationError',
            message: 'Access denied, no token provided',
        });
        return;
    }
    const [_, token] = authHeader.split(' ');
    try {
        const jwtPaylod = (0, jwt_1.verifyAccessToken)(token);
        req.userId = jwtPaylod.userId;
    }
    catch (err) {
        if (err instanceof jsonwebtoken_1.TokenExpiredError) {
            res.status(401).json({
                code: 'AuthenticationError',
                message: 'Token expired, please refresh the token',
            });
            return;
        }
        if (err instanceof jsonwebtoken_1.JsonWebTokenError) {
            res.status(401).json({
                code: 'AuthenticationError',
                message: 'Access token invalid',
            });
            return;
        }
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal server error',
            error: err,
        });
        winston_1.logger.error('Error during authentication', err);
    }
    next();
});
exports.default = authenticate;
