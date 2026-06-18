"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("./auth.controller"));
const authRouter = (0, express_1.Router)();
authRouter.post('/register', auth_controller_1.default.createUser);
authRouter.post('/login', auth_controller_1.default.loginUser);
exports.default = authRouter;
