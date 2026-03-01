import bcrypt from 'bcryptjs';
import UserDb from '../models/userModel.js';

// Function to generate a 6-digit OTP
export const genrateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Function to hash a password using bcrypt
export const hashPassword = (password) => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};
// Function to create a new user in the database with OTP and verification status
export const newUserCreated = async (
  name,
  email,
  hashedPassword,
  otp,
  otpExpire,
) => {
  await UserDb.create({
    name,
    email,
    password: hashedPassword,
    otp,
    otpExpire,
    isVerified: false,
  });
};
// Function to create HTTP-only cookie with the authentication token
export const createCookies = async (token, res) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

//
export const comparedPassword = async (password, dbpassword) => {
  console.log('Comparing password:', password);
  console.log('Users password from DB:', dbpassword);
  return await bcrypt.compare(password, dbpassword);
};
