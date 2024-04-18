import { config as conf } from 'dotenv';

conf();

const _config = {
  port: process.env.PORT || 5000,
  dbUri: process.env.MONGODB_URI,
  env: process.env.NODE_ENV,
  jwtSecret: process.env.JWT_SECRET,
};

export const config = Object.freeze(_config);
