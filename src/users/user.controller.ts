import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import userModel from './user.model';
import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { config } from '../config/config';

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
      password: hashedPassword,
    });

    if (!newUser) {
      const error = createHttpError(400, 'User not created');
      return next(error);
    }

    // generate JWT token
    const token = sign({ sub: newUser._id }, config.jwtSecret as string, {
      expiresIn: '7d',
    });

    // send response
    res
      .status(201)
      .json({ accessToken: token, message: 'User created successfully' });
  } catch (error) {
    console.log('Error while creating user', error);
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validation
    const { email, password } = req.body;
    if (!email || !password) {
      const error = createHttpError(400, 'All fields are required');
      return next(error);
    }

    // Database call
    const user = await userModel.findOne({ email });
    if (!user) {
      return next(createHttpError(400, 'User not found'));
    }

    // password check
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return next(createHttpError(401, 'Invalid password'));
    }

    // create new access token
    const token = sign({ sub: user._id }, config.jwtSecret as string, {
      expiresIn: '7d',
      algorithm: 'HS256',
    });

    // send response
    res
      .status(200)
      .json({ accessToken: token, message: 'User Login Successfully' });
  } catch (error) {
    console.log('Error while login user', error);
  }
};

export { registerUser, loginUser };
