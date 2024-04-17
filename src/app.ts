import express from 'express';

const app = express();

//routus
app.get('/', (req, res, next) => {
  res.json({
    message: 'Hello World',
  });
});

export default app;
