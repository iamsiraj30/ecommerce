"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
const prisma_1 = require("./lib/prisma");
dotenv_1.default.config();
const PORT = process.env.PORT || 8080;
async function startServer() {
    try {
        await prisma_1.prisma.$connect();
        console.log("Connected to the database successfully.");
        app_1.default.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error("Error starting the server:", error);
        await prisma_1.prisma.$disconnect();
        process.exit(1);
    }
}
startServer();
