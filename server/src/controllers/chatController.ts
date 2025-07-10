import { Request, Response } from 'express';
import { ChatService } from '../services/chatService';
import { ApiResponse } from '../types';
import { AuthRequest } from '../middleware/auth';
import { BookingService } from '../services/bookingService';

export class ChatController {
  static async createOrGetChatRoom(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      let { other_user_id, booking_id } = req.body;

      // Determine farmer and driver IDs based on user types
      let farmerId: string, driverId: string;
      
      if (req.user!.user_type === 'farmer') {
        farmerId = userId;
        driverId = other_user_id;
      } else if (req.user!.user_type === 'driver') {
        farmerId = other_user_id;
        driverId = userId;
      } else {
        const response: ApiResponse = {
          success: false,
          message: 'Only farmers and drivers can create chat rooms'
        };
        res.status(403).json(response);
        return;
      }

      // If no booking_id, create a new booking with minimal placeholder data
      if (!booking_id) {
        const booking = await BookingService.createBooking(farmerId, {
          pickup_location: 'TBD',
          delivery_location: 'TBD',
          goods_type: 'TBD',
          goods_weight: 1,
          scheduled_date: new Date().toISOString().slice(0, 10),
          scheduled_time: '09:00',
        });
        booking_id = booking.id;
      }

      const room = await ChatService.createOrGetChatRoom(farmerId, driverId, booking_id);

      const response: ApiResponse = {
        success: true,
        message: 'Chat room created/retrieved successfully',
        data: room
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to create/get chat room',
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      res.status(400).json(response);
    }
  }

  static async getUserChatRooms(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const rooms = await ChatService.getUserChatRooms(userId);

      const response: ApiResponse = {
        success: true,
        message: 'Chat rooms fetched successfully',
        data: rooms
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to fetch chat rooms',
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      res.status(500).json(response);
    }
  }

  static async getChatRoom(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const roomId = req.params.id;

      const room = await ChatService.getChatRoomById(roomId, userId);

      if (!room) {
        const response: ApiResponse = {
          success: false,
          message: 'Chat room not found or access denied'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: 'Chat room fetched successfully',
        data: room
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to fetch chat room',
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      res.status(500).json(response);
    }
  }

  static async getRoomMessages(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const roomId = req.params.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;

      const messages = await ChatService.getRoomMessages(roomId, userId, page, limit);

      const response: ApiResponse = {
        success: true,
        message: 'Messages fetched successfully',
        data: messages
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to fetch messages',
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      res.status(500).json(response);
    }
  }

  static async markMessagesAsRead(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const roomId = req.params.id;
      const { message_ids } = req.body;

      await ChatService.markMessagesAsRead(roomId, userId, message_ids);

      const response: ApiResponse = {
        success: true,
        message: 'Messages marked as read'
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to mark messages as read',
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      res.status(400).json(response);
    }
  }

  static async sendPriceOffer(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const roomId = req.params.id;
      const { amount, currency, message, valid_until } = req.body;

      const chatMessage = await ChatService.sendPriceOffer(roomId, userId, {
        amount,
        currency,
        message,
        valid_until
      });

      const response: ApiResponse = {
        success: true,
        message: 'Price offer sent successfully',
        data: chatMessage
      };

      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to send price offer',
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      res.status(400).json(response);
    }
  }

  static async closeChatRoom(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const roomId = req.params.id;

      await ChatService.closeChatRoom(roomId, userId);

      const response: ApiResponse = {
        success: true,
        message: 'Chat room closed successfully'
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to close chat room',
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      res.status(400).json(response);
    }
  }

  static async deleteChatRoom(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const roomId = req.params.id;
      await ChatService.deleteChatRoom(roomId, userId);
      const response: ApiResponse = {
        success: true,
        message: 'Chat room deleted successfully'
      };
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to delete chat room',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(400).json(response);
    }
  }
}