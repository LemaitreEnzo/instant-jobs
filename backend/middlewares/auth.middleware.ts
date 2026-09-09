import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../src/models/users.model";
import cookieParser from 'cookie-parser';
import getEnv from "../utils/envHelper";
import bcrypt from "bcryptjs";


declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const tokenName = getEnv('TOKEN');
  const secret = getEnv('SECRET');
  res.json(req.cookies);
  try {
    if (req.cookies.tokenName) {
      const token = req.cookies.tokenName;
      const decoded = jwt.verify(token, secret);
      console.log(token);
    }
    // next();
  } catch (error) {
    res.status(500).json(error);
  }
};

export default authenticateUser;
