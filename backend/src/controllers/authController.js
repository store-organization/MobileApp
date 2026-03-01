import UserDb from '../models/userModel.js';
import { body, validationResult } from 'express-validator';
import { SendMail } from '../services/mail.js';
import { genrateToken } from '../utils/token.js';
import crypto from 'crypto';

import {
  comparedPassword,
  createCookies,
  genrateOtp,
  hashPassword,
  newUserCreated,
} from '../utils/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/* ==============================
   REGISTER CONTROLLER
================================ */

export const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { name, email, password } = req.body;

  const existingUser = await UserDb.findOne({ email });
  if (existingUser)
    return res.status(400).json({ message: 'User already exists' });

  const hashedPassword = await hashPassword(password);

  const otp = genrateOtp();

  const otpExpire = new Date(Date.now() + 10 * 60 * 1000);

  newUserCreated(name, email, hashedPassword, otp, otpExpire);

  SendMail(email, otp);

  res.status(201).json({
    success: true,
    message: 'Registered successfully. OTP sent to email.',
  });
});

/* ==============================
   VERIFY OTP CONTROLLER
================================ */

export const verifyOtp = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { email, otp } = req.body;

  const user = await UserDb.findOne({ email });

  if (!user) return res.status(400).json({ message: 'User not found' });

  if (user.isVerified)
    return res.status(400).json({ message: 'User already verified' });

  if (user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

  user.isVerified = true;
  user.otp = null;
  user.otpExpire = null;

  await user.save();

  let token = await genrateToken(user._id);

  console.log('signup token', token);
  await createCookies(token, res);

  res.status(200).json({
    success: true,
    message: 'User verified successfully',
  });
});

// LOGIN CONTROLLER

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 🔎 Find User
  const user = await UserDb.findOne({ email });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Email ',
    });
  }

  // 🔐 Compare Password
  const isMatch = await comparedPassword(password, user.password);

  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: 'Invalid  Password',
    });
  }

  if (user.isVerified === false)
    return res.status(400).json({ message: 'User not verified' });

  const otp = genrateOtp();

  const otpExpire = new Date(Date.now() + 10 * 60 * 1000);

  user.otp = otp;
  user.otpExpire = otpExpire;

  await user.save();

  // 📧 Send OTP
  SendMail(email, otp);

  res.status(200).json({
    success: true,
    message: 'OTP sent to your email',
  });
});

export const verifyOtpLogin = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { email, otp } = req.body;

  const user = await UserDb.findOne({ email });

  if (!user) return res.status(400).json({ message: 'User not found' });

  if (user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

  if (user.isVerified === false)
    return res.status(400).json({ message: 'User not verified' });

  user.isVerified = true;
  user.otp = null;
  user.otpExpire = null;

  await user.save();

  let token = await genrateToken(user._id);

  console.log('signup token', token);
  await createCookies(token, res);

  res.status(200).json({
    success: true,
    message: 'User verified successfully',
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // 1️⃣ Check user exist
  const user = await UserDb.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // 2️⃣ Check user is verified
  if (user.isVerified !== true) {
    return res.status(400).json({
      message: 'Please verify your account first before resetting password',
    });
  }

  // 3️⃣ Generate 6 digit OTP
  const otp = genrateOtp();
  // 4️⃣ Save OTP in DB
  user.otp = otp;
  user.otpExpire = Date.now() + 2 * 60 * 1000; // 2 min expiry
  await user.save();

  // 5️⃣ Send OTP response (abhi direct bhej raha hu testing ke liye)
  SendMail(email, otp);
  res.status(200).json({
    message: 'OTP sent successfully',
    success: true,
  });
});

export const verifyResetOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  // 1️⃣ Check user
  const user = await UserDb.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // 2️⃣ Check OTP match
  if (user.otp !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  // 3️⃣ Check OTP expiry
  if (user.otpExpire < Date.now()) {
    return res.status(400).json({ message: 'OTP expired' });
  }

  // 4️⃣ Generate temporary reset token
  const resetToken = crypto.randomBytes(32).toString('hex');

  user.resetToken = resetToken;
  user.resetTokenExpire = Date.now() + 2 * 60 * 1000; // 2 min
  await user.save();

  res.status(200).json({
    message: 'OTP verified successfully',
    resetToken,
    success: true,
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword } = req.body;

  // 1️⃣ Find user
  const user = await UserDb.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // 2️⃣ Check reset token exist
  if (!user.resetToken) {
    return res.status(400).json({ message: 'Reset session not found' });
  }

  // 3️⃣ Check reset token expiry
  if (user.resetTokenExpire < Date.now()) {
    return res.status(400).json({ message: 'Reset token expired' });
  }

  // 4️⃣ Hash new password
  const hashNewPassword = await hashPassword(newPassword);

  // 5️⃣ Clear reset token
  user.resetToken = null;
  user.resetTokenExpire = null;
  user.otp = null;
  user.otpExpire = null;
  user.password = hashNewPassword;

  await user.save();

  res.status(200).json({
    message: 'Password reset successfully',
    success: true,
  });
});
