import { supabase } from '../config/database';
import { ChatRoom, ChatMessage, PriceOffer } from '../types/chat';

export class ChatService {
  static async createOrGetChatRoom(
    farmerId: string,
    driverId: string,
    bookingId?: string
  ): Promise<ChatRoom> {
    // Check if room already exists
    let query = supabase
      .from('chat_rooms')
      .select(`
        *,
        farmer:users!chat_rooms_farmer_id_fkey (id, full_name, phone, profile_image),
        driver:users!chat_rooms_driver_id_fkey (id, full_name, phone, profile_image),
        booking:bookings (id, pickup_location, delivery_location, goods_type, status)
      `)
      .eq('farmer_id', farmerId)
      .eq('driver_id', driverId);

    if (bookingId) {
      query = query.eq('booking_id', bookingId);
    }

    const { data: existingRoom } = await query.single();

    if (existingRoom) {
      return existingRoom;
    }

    // Create new room
    const { data: newRoom, error } = await supabase
      .from('chat_rooms')
      .insert({
        farmer_id: farmerId,
        driver_id: driverId,
        booking_id: bookingId,
        status: 'active'
      })
      .select(`
        *,
        farmer:users!chat_rooms_farmer_id_fkey (id, full_name, phone, profile_image),
        driver:users!chat_rooms_driver_id_fkey (id, full_name, phone, profile_image),
        booking:bookings (id, pickup_location, delivery_location, goods_type, status)
      `)
      .single();

    if (error) {
      throw new Error('Failed to create chat room: ' + error.message);
    }

    return newRoom;
  }

  static async getUserChatRooms(userId: string): Promise<ChatRoom[]> {
    const { data: rooms, error } = await supabase
      .from('chat_rooms')
      .select(`
        *,
        farmer:users!chat_rooms_farmer_id_fkey (id, full_name, phone, profile_image),
        driver:users!chat_rooms_driver_id_fkey (id, full_name, phone, profile_image),
        booking:bookings (id, pickup_location, delivery_location, goods_type, status)
      `)
      .or(`farmer_id.eq.${userId},driver_id.eq.${userId}`)
      .order('updated_at', { ascending: false });

    if (error) {
      throw new Error('Failed to fetch chat rooms: ' + error.message);
    }

    if (!rooms || rooms.length === 0) {
      return [];
    }

    // Get last message and unread count for each room
    const roomsWithDetails = await Promise.all(
      rooms.map(async (room) => {
        const [lastMessage, unreadCount] = await Promise.all([
          this.getLastMessage(room.id),
          this.getUnreadCount(room.id, userId)
        ]);

        return {
          ...room,
          last_message: lastMessage,
          unread_count: unreadCount
        };
      })
    );

    return roomsWithDetails;
  }

  static async getChatRoomById(roomId: string, userId: string): Promise<ChatRoom | null> {
    const { data: room, error } = await supabase
      .from('chat_rooms')
      .select(`
        *,
        farmer:users!chat_rooms_farmer_id_fkey (id, full_name, phone, profile_image),
        driver:users!chat_rooms_driver_id_fkey (id, full_name, phone, profile_image),
        booking:bookings (id, pickup_location, delivery_location, goods_type, status)
      `)
      .eq('id', roomId)
      .or(`farmer_id.eq.${userId},driver_id.eq.${userId}`)
      .single();

    if (error || !room) {
      return null;
    }

    return room;
  }

  static async sendMessage(
    roomId: string,
    senderId: string,
    messageType: string,
    content: string,
    metadata: any = {}
  ): Promise<ChatMessage> {
    const { data: message, error } = await supabase
      .from('chat_messages')
      .insert({
        room_id: roomId,
        sender_id: senderId,
        message_type: messageType,
        content,
        metadata
      })
      .select(`
        *,
        sender:users!chat_messages_sender_id_fkey (id, full_name, user_type, profile_image)
      `)
      .single();

    if (error) {
      throw new Error('Failed to send message: ' + error.message);
    }

    return message;
  }

  static async getRoomMessages(
    roomId: string,
    userId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<ChatMessage[]> {
    const offset = (page - 1) * limit;

    // Verify user has access to this room
    const room = await this.getChatRoomById(roomId, userId);
    if (!room) {
      throw new Error('Chat room not found or access denied');
    }

    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select(`
        *,
        sender:users!chat_messages_sender_id_fkey (id, full_name, user_type, profile_image)
      `)
      .eq('room_id', roomId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error('Failed to fetch messages: ' + error.message);
    }

    return (messages || []).reverse(); // Return in chronological order
  }

  static async markMessagesAsRead(
    roomId: string,
    userId: string,
    messageIds?: string[]
  ): Promise<void> {
    let query = supabase
      .from('chat_messages')
      .update({ is_read: true })
      .eq('room_id', roomId)
      .neq('sender_id', userId); // Don't mark own messages as read

    if (messageIds && messageIds.length > 0) {
      query = query.in('id', messageIds);
    }

    const { error } = await query;

    if (error) {
      throw new Error('Failed to mark messages as read: ' + error.message);
    }
  }

  static async sendPriceOffer(
    roomId: string,
    senderId: string,
    offer: PriceOffer
  ): Promise<ChatMessage> {
    const content = `Price offer: ${offer.currency} ${offer.amount}${offer.message ? ` - ${offer.message}` : ''}`;
    
    return this.sendMessage(
      roomId,
      senderId,
      'price_offer',
      content,
      {
        price: offer.amount,
        currency: offer.currency,
        message: offer.message,
        valid_until: offer.valid_until
      }
    );
  }

  static async sendBookingUpdate(
    roomId: string,
    senderId: string,
    bookingId: string,
    status: string,
    message: string
  ): Promise<ChatMessage> {
    return this.sendMessage(
      roomId,
      senderId,
      'booking_update',
      message,
      {
        booking_id: bookingId,
        new_status: status
      }
    );
  }

  static async closeChatRoom(roomId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('chat_rooms')
      .update({ status: 'closed', updated_at: new Date().toISOString() })
      .eq('id', roomId)
      .or(`farmer_id.eq.${userId},driver_id.eq.${userId}`);

    if (error) {
      throw new Error('Failed to close chat room: ' + error.message);
    }
  }

  static async deleteChatRoom(roomId: string, userId: string): Promise<void> {
    // Ensure user is a participant
    const room = await this.getChatRoomById(roomId, userId);
    if (!room) {
      throw new Error('Chat room not found or access denied');
    }
    // Delete all messages in the room
    const { error: msgError } = await supabase
      .from('chat_messages')
      .delete()
      .eq('room_id', roomId);
    if (msgError) {
      throw new Error('Failed to delete chat messages: ' + msgError.message);
    }
    // Delete the room itself
    const { error: roomError } = await supabase
      .from('chat_rooms')
      .delete()
      .eq('id', roomId);
    if (roomError) {
      throw new Error('Failed to delete chat room: ' + roomError.message);
    }
  }

  private static async getLastMessage(roomId: string): Promise<ChatMessage | null> {
    const { data: message } = await supabase
      .from('chat_messages')
      .select(`
        *,
        sender:users!chat_messages_sender_id_fkey (id, full_name, user_type, profile_image)
      `)
      .eq('room_id', roomId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    return message || null;
  }

  private static async getUnreadCount(roomId: string, userId: string): Promise<number> {
    const { count } = await supabase
      .from('chat_messages')
      .select('*', { count: 'exact', head: true })
      .eq('room_id', roomId)
      .eq('is_read', false)
      .neq('sender_id', userId);

    return count || 0;
  }
}