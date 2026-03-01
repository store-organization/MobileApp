import rateLimit from 'express-rate-limit';

export const registerLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minute
  max: 5, // 5 request allowed
  message: 'Too many registration attempts. Try again later.',
});

export const OTPLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minute
  max: 5, // 5 request allowed
  message: 'Too many OTP attempts. Try again later.',
});

export const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minute
  max: 5, // 5 request allowed
  message: 'Too many login attempts. Try again later.',
});
