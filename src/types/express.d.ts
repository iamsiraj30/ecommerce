import "express";

export type UserRole = "ADMIN" | "USER";
declare module "express" {
  export interface Request {
    user?: {
      userId: string;
      email: string;
      role: string;
    };
  }
}