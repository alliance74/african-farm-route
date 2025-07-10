import { Router } from 'express';
import { BookingController } from '../controllers/bookingController';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validateBookingCreation, validateId, validatePagination } from '../middleware/validation';
import { bookingLimiter } from '../middleware/rateLimiter';

const router = Router();

// Protected routes for all authenticated users
router.get(
  '/my',
  authenticateToken,
  validatePagination,
  BookingController.getMyBookings
);

router.get(
  '/:id',
  authenticateToken,
  validateId,
  BookingController.getBookingById
);

// Farmer-only routes
router.post(
  '/',
  authenticateToken,
  requireRole(['farmer']),
  bookingLimiter,
  validateBookingCreation,
  BookingController.createBooking
);

router.put(
  '/:id/cancel',
  authenticateToken,
  validateId,
  BookingController.cancelBooking
);

// Driver-only routes
router.get(
  '/available/list',
  authenticateToken,
  requireRole(['driver']),
  BookingController.getAvailableBookings
);

router.put(
  '/:id/status',
  authenticateToken,
  requireRole(['driver']),
  validateId,
  BookingController.updateBookingStatus
);

// Admin-only routes
router.put(
  '/:id/assign',
  authenticateToken,
  requireRole(['admin']),
  validateId,
  BookingController.assignDriver
);

export default router;