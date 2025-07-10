import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { ChatService } from '../services/chatService';
import { ChatSocketEvents } from '../types/chat';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userType?: string;
}

export class ChatSocketHandler {
  private io: SocketIOServer;
  private connectedUsers: Map<string, string> = new Map(); // userId -> socketId
  private typingUsers: Map<string, Set<string>> = new Map(); // roomId -> Set of userIds

  constructor(io: SocketIOServer) {
    this.io = io;
    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware() {
    this.io.use(async (socket: AuthenticatedSocket, next) => {
      try {
        const token = socket.handshake.auth.token;
        
        if (!token) {
          return next(new Error('Authentication token required'));
        }

        const decoded = jwt.verify(token, config.jwtSecret) as any;
        socket.userId = decoded.userId;
        socket.userType = decoded.user_type;
        
        next();
      } catch (error) {
        next(new Error('Invalid authentication token'));
      }
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: AuthenticatedSocket) => {
      console.log(`User ${socket.userId} connected to chat`);
      
      if (socket.userId) {
        this.connectedUsers.set(socket.userId, socket.id);
      }

      // Join room
      socket.on('join_room', async (roomId: string) => {
        try {
          if (!socket.userId) return;

          const room = await ChatService.getChatRoomById(roomId, socket.userId);
          if (!room) {
            socket.emit('error', { message: 'Chat room not found or access denied' });
            return;
          }

          socket.join(roomId);
          console.log(`User ${socket.userId} joined room ${roomId}`);
        } catch (error) {
          socket.emit('error', { message: 'Failed to join room' });
        }
      });

      // Leave room
      socket.on('leave_room', (roomId: string) => {
        socket.leave(roomId);
        this.removeUserFromTyping(roomId, socket.userId!);
        console.log(`User ${socket.userId} left room ${roomId}`);
      });

      // Send message
      socket.on('send_message', async (data: {
        room_id: string;
        message_type: string;
        content: string;
        metadata?: any;
      }) => {
        try {
          if (!socket.userId) return;

          const message = await ChatService.sendMessage(
            data.room_id,
            socket.userId,
            data.message_type,
            data.content,
            data.metadata || {}
          );

          // Emit to all users in the room
          this.io.to(data.room_id).emit('message_received', message);
          
          // Confirm to sender
          socket.emit('message_sent', message);

        } catch (error) {
          socket.emit('error', { 
            message: 'Failed to send message',
            code: 'SEND_MESSAGE_ERROR'
          });
        }
      });

      // Mark messages as read
      socket.on('mark_as_read', async (data: { 
        room_id: string; 
        message_ids: string[] 
      }) => {
        try {
          if (!socket.userId) return;

          await ChatService.markMessagesAsRead(
            data.room_id,
            socket.userId,
            data.message_ids
          );

          // Notify other users in the room
          socket.to(data.room_id).emit('messages_marked_read', {
            room_id: data.room_id,
            message_ids: data.message_ids,
            user_id: socket.userId
          });

        } catch (error) {
          socket.emit('error', { message: 'Failed to mark messages as read' });
        }
      });

      // Typing indicators
      socket.on('typing_start', async (roomId: string) => {
        if (!socket.userId) return;

        this.addUserToTyping(roomId, socket.userId);
        
        // Get user info for typing indicator
        const userInfo = await this.getUserInfo(socket.userId);
        
        socket.to(roomId).emit('user_typing', {
          room_id: roomId,
          user_id: socket.userId,
          user_name: userInfo?.full_name || 'User'
        });
      });

      socket.on('typing_stop', (roomId: string) => {
        if (!socket.userId) return;

        this.removeUserFromTyping(roomId, socket.userId);
        
        socket.to(roomId).emit('user_stopped_typing', {
          room_id: roomId,
          user_id: socket.userId
        });
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`User ${socket.userId} disconnected from chat`);
        
        if (socket.userId) {
          this.connectedUsers.delete(socket.userId);
          
          // Remove from all typing indicators
          this.typingUsers.forEach((users, roomId) => {
            if (users.has(socket.userId!)) {
              this.removeUserFromTyping(roomId, socket.userId!);
              socket.to(roomId).emit('user_stopped_typing', {
                room_id: roomId,
                user_id: socket.userId
              });
            }
          });
        }
      });
    });
  }

  private addUserToTyping(roomId: string, userId: string) {
    if (!this.typingUsers.has(roomId)) {
      this.typingUsers.set(roomId, new Set());
    }
    this.typingUsers.get(roomId)!.add(userId);
  }

  private removeUserFromTyping(roomId: string, userId: string) {
    const users = this.typingUsers.get(roomId);
    if (users) {
      users.delete(userId);
      if (users.size === 0) {
        this.typingUsers.delete(roomId);
      }
    }
  }

  private async getUserInfo(userId: string) {
    try {
      // This would typically come from your user service
      // For now, we'll return a basic structure
      return { full_name: 'User' };
    } catch (error) {
      return null;
    }
  }

  // Public method to send notifications to specific users
  public notifyUser(userId: string, event: string, data: any) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.io.to(socketId).emit(event, data);
    }
  }

  // Public method to notify all users in a room
  public notifyRoom(roomId: string, event: string, data: any) {
    this.io.to(roomId).emit(event, data);
  }
}