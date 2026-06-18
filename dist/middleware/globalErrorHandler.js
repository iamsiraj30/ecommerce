"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const globalErrorHandler = (error, req, res, next) => {
    let statusCode = 500;
    let message = "Something went wrong";
    if ("statusCode" in error) {
        statusCode = error.statusCode;
        message = error.message;
    }
    // JWT Expired
    if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
        statusCode = 401;
        message = "Token expired";
    }
    // JWT Invalid
    if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
        statusCode = 401;
        message = "Invalid token";
    }
    res.status(statusCode).json({
        success: false,
        message,
        error,
    });
};
exports.default = globalErrorHandler;
