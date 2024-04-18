import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import userModel from './user.model';
import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { config } from '../config/config';

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validation
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      const error = createHttpError(400, 'All fields are required');
      return next(error);
    }

    //Database call
    const user = await userModel.findOne({ email });
    if (user) {
      const error = createHttpError(400, 'User already exists');
      return next(error);
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // store user in database
    const newUser = await userModel.create({
      username,
      email,
      password,
    });

    if (!newUser) {
      const error = createHttpError(400, 'User not created');
      return next(error);
    }

    // generate JWT token
    const token = sign({ sub: newUser._id }, config.jwtSecret!, {
      expiresIn: '7d',
    });

    // send response
    res
      .status(201)
      .json({ accessToken: token, message: 'User created successfully' });
  } catch (error) {
    console.log(error);
  }
};

export { createUser };
