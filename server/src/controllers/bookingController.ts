import { Request, Response } from 'express';
import { BookingService } from '../services/bookingService';
import { NotificationService } from '../services/notificationService';
import { ApiResponse } from '../types';
import { AuthRequest } from '../middleware/auth';

export class BookingController {
  static async createBooking(req: AuthRequest, res: Response): Promise<void> {
    try {
      const farmerId = req.user!.id;
      const bookingData = req.body;

      const booking = await BookingService.createBooking(farmerId, bookingData);

      // Send notifications about new booking
      await NotificationService.notifyBookingCreated(booking);

      const response: ApiResponse = {
        success: true,
        message: 'Booking created successfully',
        data: booking
      };

      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: error instanceof Error ? error.message : 'Booking creation failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      res.status(400).json(response);
    }
  }

  static async getMyBookings(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const userType = req.user!.user_type;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;

      const result = await BookingService.getBookingsByUser(userId, userType, page, limit, status);

      res.status(200).json(result);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to fetch bookings',
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      res.status(500).json(response);
    }
  }

  static async getBookingById(req: Request, res: Response): Promise<void> {
    try {
      const bookingId = req.params.id;
      const booking = await BookingService.getBookingById(bookingId);

      if (!booking) {
        const response: ApiResponse = {
          success: false,
          message: 'Booking not found'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: 'Booking fetched successfully',
        data: booking
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to fetch booking',
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      res.status(500).json(response);
    }
  }

  static async updateBookingStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const bookingId = req.params.id;
      const { status } = req.body;
      const userId = req.user!.id;
      const userType = req.user!.user_type;

      const booking = await BookingService.updateBookingStatus(bookingId, status, userId, userType);

      // Send notifications based on status change
      if (status === 'confirmed') {
        await NotificationService.notifyBookingConfirmed(booking);
      } else {
        await NotificationService.notifyBookingStatusUpdate(booking);
      }

      const response: ApiResponse = {
        success: true,
        message: 'Booking status updated successfully',
        data: booking
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to update booking status',
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      res.status(400).json(response);
    }
  }

  static async assignDriver(req: AuthRequest, res: Response): Promise<void> {
    try {
      const bookingId = req.params.id;
      const { driver_id, vehicle_id } = req.body;

      const booking = await BookingService.assignDriverToBooking(bookingId, driver_id, vehicle_id);

      await NotificationService.notifyBookingConfirmed(booking);

      const response: ApiResponse = {
        success: true,
        message: 'Driver assigned successfully',
        data: booking
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to assign driver',
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      res.status(400).json(response);
    }
  }

  static async cancelBooking(req: AuthRequest, res: Response): Promise<void> {
    try {
      const bookingId = req.params.id;
      const userId = req.user!.id;

      const booking = await BookingService.cancelBooking(bookingId, userId);

      await NotificationService.notifyBookingStatusUpdate(booking);

      const response: ApiResponse = {
        success: true,
        message: 'Booking cancelled successfully',
        data: booking
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to cancel booking',
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      res.status(400).json(response);
    }
  }

  static async getAvailableBookings(req: AuthRequest, res: Response): Promise<void> {
    try {
      const driverId = req.user!.id;
      const bookings = await BookingService.getAvailableBookings(driverId);

      const response: ApiResponse = {
        success: true,
        message: 'Available bookings fetched successfully',
        data: bookings
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to fetch available bookings',
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      res.status(500).json(response);
    }
  }
}