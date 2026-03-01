import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { envConfig } from './env.config.js';
dotenv.config();

export const ConnectDb = async () => {
  try {
    await mongoose.connect(envConfig.DB_URI);
    console.log('Database successfully connected!');
  } catch (error) {
    console.log(error);
  }
};
