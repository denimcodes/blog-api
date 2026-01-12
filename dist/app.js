"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
const config_1 = __importDefault(require("./config"));
const express_late_limit_1 = __importDefault(require("./lib/express_late_limit"));
const v1_1 = __importDefault(require("./routes/v1"));
const winston_1 = require("./lib/winston");
const app = (0, express_1.default)();
const corsOptions = {
    origin(origin, callback) {
        if (config_1.default.NODE_ENV === 'development' ||
            !origin ||
            config_1.default.WHITELIST_ORIGINS.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error(`CORS Error: ${origin} is not allowed by CORS`), false);
            winston_1.logger.warn(`CORS Error: ${origin} is not allowed by CORS`);
        }
    },
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, compression_1.default)());
app.use((0, helmet_1.default)());
app.use(express_late_limit_1.default);
app.use('/api/v1', v1_1.default);
exports.default = app;
