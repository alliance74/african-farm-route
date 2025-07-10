import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { ApiResponse } from '../types';

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { full_name, phone, email, password, user_type } = req.body;

      const result = await AuthService.registerUser({
        full_name,
        phone,
        email,
        password,
        user_type
      });

      const response: ApiResponse = {
        success: true,
        message: 'User registered successfully',
        data: {
          user: result.user,
          token: result.token
        }
      };

      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: error instanceof Error ? error.message : 'Registration failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      res.status(400).json(response);
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { phone, password } = req.body;

      const result = await AuthService.loginUser(phone, password);

      const response: ApiResponse = {
        success: true,
        message: 'Login successful',
        data: {
          user: result.user,
          token: result.token
        }
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: error instanceof Error ? error.message : 'Login failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      res.status(401).json(response);
    }
  }

  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const user = await AuthService.getUserById(userId);

      if (!user) {
        const response: ApiResponse = {
          success: false,
          message: 'User not found'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: 'Profile fetched successfully',
        data: user
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to fetch profile',
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      res.status(500).json(response);
    }
  }

  static async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const updates = req.body;

      // Remove sensitive fields that shouldn't be updated via this endpoint
      delete updates.password;
      delete updates.password_hash;
      delete updates.user_type;
      delete updates.id;

      const user = await AuthService.updateUserProfile(userId, updates);

      const response: ApiResponse = {
        success: true,
        message: 'Profile updated successfully',
        data: user
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to update profile',
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      res.status(400).json(response);
    }
  }
}