import path from 'node:path';
import express from 'express';
import { createBook } from './book.controller';
import multer from 'multer';
import authenticate from '../middleware/authenticate';

const bookRouter = express.Router();

const upload = multer({
  dest: path.resolve(__dirname, '../../public/data/uploads'),
  limits: {
    fileSize: 1024 * 1024 * 10, // 10 MB
  },
});

bookRouter.post(
  '/',
  authenticate,
  upload.fields([
    {
      name: 'coverImage',
      maxCount: 1,
    },
    {
      name: 'file',
      maxCount: 1,
    },
  ]),
  createBook
);

export default bookRouter;
