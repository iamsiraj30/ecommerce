import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync";
import AppError from "../../errors/AppError";
import authService from "./auth.service";

// create new user 
const createUser = catchAsync(async (req: Request, res: Response) => {
  const {
    name,
    email,
    password
  } = req.body;

  if (!name) {
    throw new AppError(401,"Name is required");
  }

  if (!email) {
    throw new AppError(401,"Email is required");
  }

  if (!password) {
    throw new AppError(400,"Password is required");
  }

  const existUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existUser) {
    throw new AppError(401,"User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await authService.createUserIntoDB(req.body,hashedPassword)


  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: user,
  });
});


// login user
const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    throw new AppError(400, "Invalid credentials");
  }

  //  Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError(401, "Invalid credentials");
  }

  // Create JWT token
  const jwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  // Access Token
  const accessToken = jwt.sign(
    jwtPayload,
    process.env.JWT_ACCESS_SECRET as string,
    {
      expiresIn: "15m",
    },
  );

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

export default authController;
