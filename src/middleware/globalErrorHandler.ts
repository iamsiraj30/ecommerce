import { ErrorRequestHandler } from "express";
import jwt from "jsonwebtoken";

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  let statusCode = 500;
  let message = "Something went wrong";

  if ("statusCode" in error) {
    statusCode = error.statusCode;
    message = error.message;
  }
  

    // JWT Expired
  if (error instanceof jwt.TokenExpiredError) {
    statusCode = 401;
    message = "Token expired";
  }

  // JWT Invalid
  if (error instanceof jwt.JsonWebTokenError) {
    statusCode = 401;
    message = "Invalid token";
  }


  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default globalErrorHandler;
