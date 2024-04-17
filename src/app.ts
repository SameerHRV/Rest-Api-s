import express from 'express';
import { globalErrorHandler } from './middleware/globalErrorHandler';

const app = express();

//routus
app.get('/', (req, res, next) => {
  res.json({
    message: 'Hello World',
  });
});

// global error handler

app.use(globalErrorHandler);

export default app;
