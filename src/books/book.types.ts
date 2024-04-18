import { User } from '../users/user.types';

export interface Book {
  _id: string;
  title: string;
  author: User;
  genre: string;
  coverImage: string; // cloudinary url
  file: string; // cloudinary url
  createdAt: Date;
  updatedAt: Date;
}
