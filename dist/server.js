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
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
const mongoose_1 = require("./lib/mongoose");
const winston_1 = require("./lib/winston");
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, mongoose_1.connectToDb)();
        app_1.default.listen(config_1.default.PORT, () => {
            winston_1.logger.info(`Server running: http://localhost:${config_1.default.PORT}`);
        });
    }
    catch (err) {
        winston_1.logger.error('Failed to start the server', err);
        if (config_1.default.NODE_ENV === 'production') {
            process.exit(1);
        }
    }
}))();
const handleServerShutdown = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, mongoose_1.disconnectFromDb)();
        winston_1.logger.warn('Server SHUTDOWN');
        process.exit(0);
    }
    catch (err) {
        winston_1.logger.error('Error during server shutdown', err);
    }
});
process.on('SIGTERM', handleServerShutdown);
process.on('SIGINT', handleServerShutdown);
