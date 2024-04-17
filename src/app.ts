import express from 'express';
import { globalErrorHandler } from './middleware/globalErrorHandler';
import userRouter from './users/user.router';

const app = express();

app.use(express.json());

//routus
app.get('/', (req, res, next) => {
  res.json({
    message: 'Hello World',
  });
});

//routes registration
app.use("/api/v1/users", userRouter)

// global error handler

app.use(globalErrorHandler);

export default app;
