import rateLimit from 'express-rate-limit';
import { config } from '../config/config';

// General rate limiter
export const generalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    success: false,
    message: 'Too many requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiter for auth endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Booking creation limiter
export const bookingLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // 3 bookings per minute
  message: {
    success: false,
    message: 'Too many booking requests, please wait before creating another booking'
  },
  standardHeaders: true,
  legacyHeaders: false,
});