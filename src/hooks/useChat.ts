import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { ChatRoom, ChatMessage } from '@/types/chat';
import { useToast } from '@/hooks/use-toast';

interface UseChatProps {
  token: string;
  userId: string;
}

export const useChat = ({ token, userId }: UseChatProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [currentRoom, setCurrentRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<string>('');
  const { toast } = useToast();

  // Helper to get token
  const getToken = () => localStorage.getItem('token');

  // Initialize socket connection
  useEffect(() => {
    if (!token) return;

    const newSocket = io(process.env.NODE_ENV === 'production' 
      ? 'wss://your-api-domain.com' 
      : 'ws://localhost:3001', {
      auth: { token }
    });

    newSocket.on('connect', () => {
      setConnected(true);
      console.log('Connected to chat server');
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
      console.log('Disconnected from chat server');
    });

    newSocket.on('message_received', (message: ChatMessage) => {
      setMessages(prev => [...prev, message]);
      
      // Show notification if message is not from current user
      if (message.sender_id !== userId) {
        toast({
          title: "New message",
          description: `${message.sender?.full_name}: ${message.content.substring(0, 50)}...`
        });
      }
    });

    newSocket.on('message_sent', (message: ChatMessage) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('user_typing', (data: { room_id: string; user_id: string; user_name: string }) => {
      if (data.user_id !== userId && currentRoom?.id === data.room_id) {
        setIsTyping(true);
        setTypingUser(data.user_name);
      }
    });

    newSocket.on('user_stopped_typing', (data: { room_id: string; user_id: string }) => {
      if (data.user_id !== userId && currentRoom?.id === data.room_id) {
        setIsTyping(false);
        setTypingUser('');
      }
    });

    newSocket.on('error', (error: { message: string }) => {
      toast({
        title: "Chat Error",
        description: error.message,
        variant: "destructive"
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [token, userId, currentRoom?.id, toast]);

  // Fetch chat rooms
  const fetchRooms = useCallback(async () => {
    try {
      const response = await fetch('/api/v1/chat/rooms', {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRooms(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch chat rooms:', error);
    }
  }, []);

  // Create or get chat room
  const createOrGetRoom = useCallback(async (otherUserId: string, bookingId?: string) => {
    try {
      const response = await fetch('/api/v1/chat/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          other_user_id: otherUserId,
          booking_id: bookingId
        })
      });

      if (response.ok) {
        const data = await response.json();
        const room = data.data;
        
        // Add to rooms if not already present
        setRooms(prev => {
          const exists = prev.find(r => r.id === room.id);
          if (exists) return prev;
          return [room, ...prev];
        });

        return room;
      }
    } catch (error) {
      console.error('Failed to create/get chat room:', error);
      toast({
        title: "Error",
        description: "Failed to create chat room",
        variant: "destructive"
      });
    }
    return null;
  }, [toast]);

  // Join room
  const joinRoom = useCallback(async (room: ChatRoom) => {
    if (!socket) return;

    // Leave current room if any
    if (currentRoom) {
      socket.emit('leave_room', currentRoom.id);
    }

    // Join new room
    socket.emit('join_room', room.id);
    setCurrentRoom(room);

    // Fetch messages for this room
    try {
      const response = await fetch(`/api/v1/chat/rooms/${room.id}/messages`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }

    // Mark messages as read
    try {
      await fetch(`/api/v1/chat/rooms/${room.id}/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        }
      });
    } catch (error) {
      console.error('Failed to mark messages as read:', error);
    }
  }, [socket, currentRoom, token]);

  // Send message
  const sendMessage = useCallback((content: string, messageType: string = 'text', metadata: any = {}) => {
    if (!socket || !currentRoom) return;

    socket.emit('send_message', {
      room_id: currentRoom.id,
      message_type: messageType,
      content,
      metadata
    });
  }, [socket, currentRoom]);

  // Send typing indicators
  const startTyping = useCallback(() => {
    if (!socket || !currentRoom) return;
    socket.emit('typing_start', currentRoom.id);
  }, [socket, currentRoom]);

  const stopTyping = useCallback(() => {
    if (!socket || !currentRoom) return;
    socket.emit('typing_stop', currentRoom.id);
  }, [socket, currentRoom]);

  // Leave room
  const leaveRoom = useCallback(() => {
    if (!socket || !currentRoom) return;

    socket.emit('leave_room', currentRoom.id);
    setCurrentRoom(null);
    setMessages([]);
    setIsTyping(false);
    setTypingUser('');
  }, [socket, currentRoom]);

  return {
    connected,
    rooms,
    currentRoom,
    messages,
    isTyping,
    typingUser,
    fetchRooms,
    createOrGetRoom,
    joinRoom,
    leaveRoom,
    sendMessage,
    startTyping,
    stopTyping
  };
};