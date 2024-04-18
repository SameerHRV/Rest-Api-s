import { create } from 'domain';
import { config } from '../config/config';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';

export interface AuthRequest extends Request {
  userId: string;
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }

  try {
    const parsedToken = token.split(' ')[1];
    const decodedToken = jwt.verify(parsedToken, config.jwtSecret as string);
    const _req = req as AuthRequest;
    _req.userId = decodedToken.sub as string;



    next();
  } catch (error) {
    return next(createHttpError(401, 'Token Expired'));
  }
};

export default authenticate;
