import fs from 'node:fs';
import path from 'node:path';
import { NextFunction, Request, Response } from 'express';
import cloudinary from '../config/clousinary';
import createHttpError from 'http-errors';
import bookModel from './book.model';
import { AuthRequest } from '../middleware/authenticate';

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
    })

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

export { createBook };
