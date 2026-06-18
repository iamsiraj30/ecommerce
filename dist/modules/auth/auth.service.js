"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../lib/prisma");
const createUserIntoDB = async (payload, hasPassword) => {
    const user = await prisma_1.prisma.user.create({
        data: {
            name: payload.name,
            email: payload.email,
            password: hasPassword,
            phone: payload.phone,
            address: payload.address,
            age: payload.age,
            //   status: payload.status,
            isVerified: payload.isVerified,
        },
        select: {
            id: true,
            name: true,
            email: true,
            profileImg: true,
            phone: true,
            address: true,
            age: true,
            role: true,
            status: true,
        },
    });
    return user;
};
const authService = {
    createUserIntoDB,
};
exports.default = authService;
