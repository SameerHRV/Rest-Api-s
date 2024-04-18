import mongoose, { Schema } from 'mongoose';
import { Book } from './book.types';

const bookSchema = new Schema<Book>(
  {
    title: {
      type: String,
      required: [true, 'Title is required.'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required.'],
    },
    genre: {
      type: String,
      required: [true, 'Genre is required.'],
    },
    coverImage: {
      type: String,
      required: [true, 'Cover image is required.'],
    },
    file: {
      type: String,
      required: [true, 'File is required.'],
    },
  },
  { timestamps: true }
);

export default mongoose.model<Book>('Book', bookSchema, 'books');
