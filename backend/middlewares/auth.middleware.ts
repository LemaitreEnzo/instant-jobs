import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
// import { User } from "../src/models/users.model";
// import cookieParser from 'cookie-parser';
import getEnv from "../utils/envHelper";
// import bcrypt from "bcryptjs";

declare global {
  namespace Express {
    interface Request {
      user?: { uuid: string; role: string };
    }
  }
}

const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const tokenName = getEnv("TOKEN");
  const secret = getEnv("SECRET");
  try {
    if (req.cookies[tokenName]) {
      // const { organizationid } = req.params;
      const token = req.cookies[tokenName];
      const decoded = jwt.verify(token, secret) as {
        uuid: string;
        role: string;
      };
      req.user = decoded;

      // if (
      //   await User.findOne({ where: { organizationid, uuid: req.user.uuid } })
      // ) {
      //   res.status(200).json({ message: "Access granted" });
      // }
      next();
    } else {
      next();
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};

export default authenticateUser;
