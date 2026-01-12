"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const validationError = (req, res, next) => {
    const result = (0, express_validator_1.validationResult)(req);
    if (!result.isEmpty()) {
        res.status(400).json({
            code: 'ValidationError',
            errors: result.array()
        });
        return;
    }
    next();
};
exports.default = validationError;
