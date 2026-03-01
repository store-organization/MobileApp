import jwt from 'jsonwebtoken';
import { envConfig } from '../config/env.config.js';

export const genrateToken = (userId) => {
  try {
    console.log('JWT SECRET in genToken:', envConfig.JWT_SECRET_KEY);
    const token = jwt.sign({ userId }, envConfig.JWT_SECRET_KEY, {
      expiresIn: '7d',
    });
    return token;
  } catch (error) {
    console.log(`Token error ${error}`);
  }
};
