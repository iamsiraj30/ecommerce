"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../lib/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const auth_service_1 = __importDefault(require("./auth.service"));
// create new user 
const createUser = (0, catchAsync_1.default)(async (req, res) => {
    const { name, email, password } = req.body;
    if (!name) {
        throw new AppError_1.default(401, "Name is required");
    }
    if (!email) {
        throw new AppError_1.default(401, "Email is required");
    }
    if (!password) {
        throw new AppError_1.default(400, "Password is required");
    }
    const existUser = await prisma_1.prisma.user.findUnique({
        where: { email },
    });
    if (existUser) {
        throw new AppError_1.default(401, "User already exists");
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const user = await auth_service_1.default.createUserIntoDB(req.body, hashedPassword);
    res.status(201).json({
        success: true,
        message: "User created successfully",
        data: user,
    });
});
// login user
const loginUser = (0, catchAsync_1.default)(async (req, res) => {
    const { email, password } = req.body;
    // Find user
    const user = await prisma_1.prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        throw new AppError_1.default(400, "Invalid credentials");
    }
    //  Check password
    const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new AppError_1.default(401, "Invalid credentials");
    }
    // Create JWT token
    const jwtPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
    };
    // Access Token
    const accessToken = jsonwebtoken_1.default.sign(jwtPayload, process.env.JWT_ACCESS_SECRET, {
        expiresIn: "15m",
    });
    res.status(200).json({
        success: true,
        message: "login successfull",
        data: {
            accessToken,
            user,
        },
    });
});
const authController = {
    createUser,
    loginUser,
};
exports.default = authController;
