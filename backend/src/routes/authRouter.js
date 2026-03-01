import express from 'express';
import {
  forgotPassword,
  loginUser,
  register,
  resetPassword,
  verifyOtp,
  verifyOtpLogin,
  verifyResetOtp,
} from '../controllers/authController.js';
import {
  loginValidation,
  registerValidation,
  resetPasswordValidation,
  verifyOtpValidation,
} from '../validation/authValidation.js';
import {
  loginLimiter,
  OTPLimiter,
  registerLimiter,
} from '../middleware/rateLimitMiddleware.js';

const authRouter = express.Router();
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register new user and send OTP
 *     tags: [Auth]
 *     description: Register a new user with name, email and password. OTP will be sent to email for verification.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               name:
 *                 type: string
 *                 example: Rahul
 *               email:
 *                 type: string
 *                 example: rahul@gmail.com
 *               password:
 *                 type: string
 *                 example: Rahul@123
 *               confirmPassword:
 *                 type: string
 *                 example: Rahul@123
 *     responses:
 *       201:
 *         description: Registered successfully. OTP sent to email.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Registered successfully. OTP sent to email.
 *       400:
 *         description: Validation error or user already exists
 *       500:
 *         description: Server error
 */
authRouter.post('/register', registerLimiter, registerValidation, register);
/**
 * @swagger
 * /api/auth/verifyotp:
 *   post:
 *     summary: Verify user OTP
 *     tags: [Auth]
 *     description: Verify user account using email and OTP and set authentication token in HTTP-only cookie.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 example: rahul@gmail.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: User verified successfully and token set in cookie
 *         headers:
 *           Set-Cookie:
 *             description: JWT token stored in HTTP-only cookie
 *             schema:
 *               type: string
 *               example: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9; HttpOnly; Path=/; Max-Age=604800
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: User verified successfully
 *       400:
 *         description: Invalid OTP / User not found / Already verified
 *       500:
 *         description: Server error
 */

authRouter.post('/verifyotp', OTPLimiter, verifyOtpValidation, verifyOtp);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User Login and Send OTP
 *     description: User login karega email aur password se. Agar credentials sahi hain to OTP email par bheja jayega.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: Password@123
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: OTP sent to your email
 *       400:
 *         description: Invalid credentials or user not verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid Email
 */

authRouter.post('/login', loginLimiter, loginValidation, loginUser);

/**
 * @swagger
 * /api/auth/verify-otp-login:
 *   post:
 *     summary: Verify Login OTP
 *     description: User email aur OTP bhejkar login complete karega. OTP sahi hone par JWT token generate hoga aur cookie set hogi.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               otp:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: User verified successfully and token generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User verified successfully
 *       400:
 *         description: Validation error or invalid OTP
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid OTP
 */

authRouter.post(
  '/verify-otp-login',
  OTPLimiter,
  verifyOtpValidation,
  verifyOtpLogin,
);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Send OTP for forgot password
 *     tags: [Auth]
 *     description: Generates 6 digit OTP if user is verified
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@gmail.com
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP sent successfully
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: User not verified
 *       404:
 *         description: User not found
 */
authRouter.post('/forgot-password', OTPLimiter, forgotPassword);

/**
 * @swagger
 * /api/auth/verify-reset-otp:
 *   post:
 *     summary: Verify OTP for password reset
 *     tags: [Auth]
 *     description: Verify 6 digit OTP and generate reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@gmail.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid or expired OTP
 *       404:
 *         description: User not found
 */
authRouter.post('/verify-reset-otp', verifyOtpValidation, verifyResetOtp);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [Auth]
 *     description: Reset password after OTP verification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@gmail.com
 *               newPassword:
 *                 type: string
 *                 example: Password@123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Reset session not valid
 *       404:
 *         description: User not found
 */
authRouter.post('/reset-password', resetPasswordValidation, resetPassword);

export default authRouter;
