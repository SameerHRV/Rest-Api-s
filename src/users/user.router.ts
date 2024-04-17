import express from 'express';
import { createUser } from './user.controller';

const userRouter = express.Router();

// routus
userRouter.post('/register', createUser);

export default userRouter;
