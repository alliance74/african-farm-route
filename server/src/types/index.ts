export interface User {
  id: string;
  email?: string;
  phone: string;
  full_name: string;
  user_type: 'farmer' | 'driver' | 'admin';
  created_at: string;
  updated_at: string;
  is_verified: boolean;
  profile_image?: string;
}

export interface Driver extends User {
  license_number?: string;
  experience_years?: number;
  rating: number;
  total_trips: number;
  total_earnings: number;
  is_available: boolean;
  service_areas: string[];
}

export interface Vehicle {
  id: string;
  driver_id: string;
  vehicle_type: string;
  make: string;
  model: string;
  year: number;
  plate_number: string;
  capacity: number;
  specialization?: string;
  rate_per_km: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  farmer_id: string;
  driver_id?: string;
  vehicle_id?: string;
  pickup_location: string;
  delivery_location: string;
  pickup_coordinates?: { lat: number; lng: number };
  delivery_coordinates?: { lat: number; lng: number };
  goods_type: string;
  goods_weight: number;
  scheduled_date: string;
  scheduled_time: string;
  status: 'pending' | 'confirmed' | 'in_transit' | 'delivered' | 'cancelled';
  price: number;
  distance_km?: number;
  special_instructions?: string;
  created_at: string;
  updated_at: string;
}

export interface BookingRating {
  id: string;
  booking_id: string;
  farmer_id: string;
  driver_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}