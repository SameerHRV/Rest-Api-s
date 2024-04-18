import express from 'express';
import { registerUser, loginUser } from './user.controller';

const userRouter = express.Router();

// routes registration
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

export default userRouter;
