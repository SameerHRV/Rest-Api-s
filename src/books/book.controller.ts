import fs from 'node:fs';
import path from 'node:path';
import { NextFunction, Request, Response } from 'express';
import cloudinary from '../config/clousinary';
import createHttpError from 'http-errors';
import bookModel from './book.model';
import { AuthRequest } from '../middleware/authenticate';

// create book
const createBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, genre } = req.body;

    const files = req.files as {
      [filename: string]: Express.Multer.File[];
    };

    // cover image file upload
    const coverImageMineType = files.coverImage[0].mimetype.split('/').at(-1);
    const fileName = files.coverImage[0].filename;
    const filePath = path.resolve(
      __dirname,
      '../../public/data/uploads',
      fileName
    );
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: 'book-cover',
      format: coverImageMineType,
    });

    // PDF file upload
    const bookFileName = files.file[0].filename;
    const bookFilePath = path.resolve(
      __dirname,
      '../../public/data/uploads',
      bookFileName
    );
    const bookUploadResult = await cloudinary.uploader.upload(bookFilePath, {
      resource_type: 'raw',
      filename_override: bookFileName,
      folder: 'book-pdf',
      format: 'pdf',
    });

    const _req = req as AuthRequest;

    // create book
    const newBook = await bookModel.create({
      title,
      genre,
      author: _req.userId,
      coverImage: uploadResult.secure_url,
      file: bookUploadResult.secure_url,
    });

    console.log(newBook.genre);

    // Delete temp files
    await fs.promises.unlink(filePath);
    await fs.promises.unlink(bookFilePath);

    res.status(201).json({
      id: newBook._id,
      message: 'Book created successfully',
    });
  } catch (error) {
    console.log('Error while creating book', error);
    return next(createHttpError(500, 'Error while creating book'));
  }
};

// update book
const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;
  const bookId = req.params.bookId;

  const book = await bookModel.findOne({ _id: bookId });

  if (!book) {
    return next(createHttpError(404, 'Book not found'));
  }

  // Check access
  const _req = req as AuthRequest;
  if (book.author.toString() !== _req.userId) {
    return next(createHttpError(403, 'You can not update others book.'));
  }

  // check if image field is exists.
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  let completeCoverImage = '';
  if (files.coverImage) {
    const filename = files.coverImage[0].filename;
    const converMimeType = files.coverImage[0].mimetype.split('/').at(-1);
    // send files to cloudinary
    const filePath = path.resolve(
      __dirname,
      '../../public/data/uploads/' + filename
    );
    completeCoverImage = filename;
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: completeCoverImage,
      folder: 'book-covers',
      format: converMimeType,
    });

    completeCoverImage = uploadResult.secure_url;
    await fs.promises.unlink(filePath);
  }

  // check if file field is exists.
  let completeFileName = '';
  if (files.file) {
    const bookFilePath = path.resolve(
      __dirname,
      '../../public/data/uploads/' + files.file[0].filename
    );

    const bookFileName = files.file[0].filename;
    completeFileName = bookFileName;

    const uploadResultPdf = await cloudinary.uploader.upload(bookFilePath, {
      resource_type: 'raw',
      filename_override: completeFileName,
      folder: 'book-pdfs',
      format: 'pdf',
    });

    completeFileName = uploadResultPdf.secure_url;
    await fs.promises.unlink(bookFilePath);
  }

  const updatedBook = await bookModel.findOneAndUpdate(
    {
      _id: bookId,
    },
    {
      title: title,
      genre: genre,
      coverImage: completeCoverImage ? completeCoverImage : book.coverImage,
      file: completeFileName ? completeFileName : book.file,
    },
    { new: true }
  );

  res.json(updatedBook);
};

// list books
const listBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // add pagination
    const books = await bookModel.find();

    res.status(200).json({
      books: books,
      message: 'Book list successfully',
    });
  } catch (error) {
    return next(createHttpError(500, 'Error while listing books'));
  }
};
// get single book
const getsingleBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookId = req.params.bookId;
    const book = await bookModel.findOne({ _id: bookId });
    if (!book) {
      return next(createHttpError(404, 'Book not found'));
    }
    res.status(200).json({
      book: book,
      message: 'Book successfully',
    });
  } catch (error) {
    return next(createHttpError(500, 'Error while getting single book'));
  }
};

export { createBook, updateBook, listBooks, getsingleBook };
