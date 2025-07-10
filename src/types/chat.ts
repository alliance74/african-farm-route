export interface ChatRoom {
  id: string;
  booking_id?: string;
  farmer_id: string;
  driver_id: string;
  status: 'active' | 'closed';
  created_at: string;
  updated_at: string;
  farmer?: {
    id: string;
    full_name: string;
    phone: string;
    profile_image?: string;
  };
  driver?: {
    id: string;
    full_name: string;
    phone: string;
    profile_image?: string;
  };
  booking?: {
    id: string;
    pickup_location: string;
    delivery_location: string;
    goods_type: string;
    status: string;
  };
  last_message?: ChatMessage;
  unread_count?: number;
}

export interface ChatMessage {
  id: string;
  room_id: string;
  sender_id: string;
  message_type: 'text' | 'price_offer' | 'booking_update' | 'system';
  content: string;
  metadata: {
    price?: number;
    currency?: string;
    booking_id?: string;
    coordinates?: { lat: number; lng: number };
    [key: string]: any;
  };
  is_read: boolean;
  created_at: string;
  sender?: {
    id: string;
    full_name: string;
    user_type: string;
    profile_image?: string;
  };
}

export interface PriceOffer {
  amount: number;
  currency: string;
  message?: string;
  valid_until?: string;
}