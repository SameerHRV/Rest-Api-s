import mongoose from 'mongoose';
import { User } from './user.types';

const userSchema = new mongoose.Schema<User>(
  {
    username: {
      type: String,
      unique: true,
      required: [true, 'Username is required.'],
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required.'],
    },
    password: {
      type: String,
      unique: true,
      required: [true, 'Password is required.'],
    },
  }, 
  { timestamps: true }
);

export default mongoose.model<User>('User', userSchema);
