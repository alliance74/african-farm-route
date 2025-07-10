import { Router } from 'express';
import authRoutes from './authRoutes';
import vehicleRoutes from './vehicleRoutes';
import bookingRoutes from './bookingRoutes';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AgriMove API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/bookings', bookingRoutes);

export default router;