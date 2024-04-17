import mongoose from 'mongoose';
import { config } from './config';

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => {
      console.log('MongoDB Successfully connected');
    });

    mongoose.connection.on('error', (err) => {
      console.log('MongoDB connection error: ', err);
    });

    const connectionInstance = await mongoose.connect(config.dbUri as string);
    console.log('MONGODB CONNECTED: ', connectionInstance.connection.host);
  } catch (error) {
    console.log('MONGODB CONNECTION ERROR: ', error);
    process.exit(1);
  }
};

export { connectDB }
