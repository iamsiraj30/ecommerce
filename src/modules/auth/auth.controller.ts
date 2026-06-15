import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const createUser = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      password,
      profileImg,
      phone,
      address,
      age,
      status,
      isVerified,
    } = req.body;

    if (!name) {
      throw new Error("Name is required");
    }

    if (!email) {
      throw new Error("Email is required");
    }

    if (!password) {
      throw new Error("Password is required");
    }

    const existUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        profileImg,
        phone,
        address,
        age,
        status,
        isVerified,
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

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Email already exists",
      });
    }
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    //  Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
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
  } catch (error: any) {
    res.status(401).json({
      success: false,
      error: error.message,
    });
  }
};

const authController = {
  createUser,
  loginUser,
};

export default authController;
