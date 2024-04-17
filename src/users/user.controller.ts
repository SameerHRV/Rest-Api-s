import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import userModel from './user.model';
import bcrypt from 'bcrypt';

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  // Validation
  try {
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

    const newUser = await userModel.create({
      username,
      email,
      password,
    });

    if (!newUser) {
      const error = createHttpError(400, 'User not created');
      return next(error);
    }

    //password hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    newUser.password = hashedPassword;

    await newUser.save();

    // jwt token
    

    res.status(201).json({
      message: 'User created successfully',
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

export { createUser };
