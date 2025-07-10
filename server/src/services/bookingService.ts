import { supabase } from '../config/database';
import { Booking, PaginatedResponse } from '../types';

export class BookingService {
  static async createBooking(farmerId: string, bookingData: {
    pickup_location: string;
    delivery_location: string;
    pickup_coordinates?: { lat: number; lng: number };
    delivery_coordinates?: { lat: number; lng: number };
    goods_type: string;
    goods_weight: number;
    scheduled_date: string;
    scheduled_time: string;
    special_instructions?: string;
    vehicle_id?: string;
  }): Promise<Booking> {
    let price = 0;
    let distance_km = 0;

    // If vehicle is specified, calculate price
    if (bookingData.vehicle_id) {
      const { data: vehicle } = await supabase
        .from('vehicles')
        .select('rate_per_km')
        .eq('id', bookingData.vehicle_id)
        .single();

      if (vehicle && bookingData.pickup_coordinates && bookingData.delivery_coordinates) {
        distance_km = this.calculateDistance(
          bookingData.pickup_coordinates,
          bookingData.delivery_coordinates
        );
        price = distance_km * vehicle.rate_per_km;
      }
    }

    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        farmer_id: farmerId,
        ...bookingData,
        price,
        distance_km,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      throw new Error('Failed to create booking: ' + error.message);
    }

    return booking;
  }

  static async getBookingsByUser(
    userId: string,
    userType: string,
    page: number = 1,
    limit: number = 10,
    status?: string
  ): Promise<PaginatedResponse<Booking>> {
    const offset = (page - 1) * limit;
    
    let query = supabase
      .from('bookings')
      .select(`
        *,
        farmer:users!bookings_farmer_id_fkey (id, full_name, phone),
        driver:users!bookings_driver_id_fkey (id, full_name, phone),
        vehicle:vehicles (id, vehicle_type, make, model, plate_number)
      `, { count: 'exact' });

    if (userType === 'farmer') {
      query = query.eq('farmer_id', userId);
    } else if (userType === 'driver') {
      query = query.eq('driver_id', userId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data: bookings, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error('Failed to fetch bookings: ' + error.message);
    }

    const totalPages = Math.ceil((count || 0) / limit);

    return {
      success: true,
      message: 'Bookings fetched successfully',
      data: bookings || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages
      }
    };
  }

  static async getBookingById(bookingId: string): Promise<Booking | null> {
    const { data: booking, error } = await supabase
      .from('bookings')
      .select(`
        *,
        farmer:users!bookings_farmer_id_fkey (id, full_name, phone, email),
        driver:users!bookings_driver_id_fkey (id, full_name, phone, email),
        vehicle:vehicles (id, vehicle_type, make, model, plate_number, capacity)
      `)
      .eq('id', bookingId)
      .single();

    if (error) {
      return null;
    }

    return booking;
  }

  static async updateBookingStatus(
    bookingId: string,
    status: string,
    userId?: string,
    userType?: string
  ): Promise<Booking> {
    const updates: any = {
      status,
      updated_at: new Date().toISOString()
    };

    // If driver is accepting the booking
    if (status === 'confirmed' && userId && userType === 'driver') {
      updates.driver_id = userId;
    }

    const { data: booking, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', bookingId)
      .select()
      .single();

    if (error) {
      throw new Error('Failed to update booking status: ' + error.message);
    }

    return booking;
  }

  static async assignDriverToBooking(bookingId: string, driverId: string, vehicleId: string): Promise<Booking> {
    // Calculate price based on vehicle rate
    const { data: vehicle } = await supabase
      .from('vehicles')
      .select('rate_per_km')
      .eq('id', vehicleId)
      .single();

    const { data: booking } = await supabase
      .from('bookings')
      .select('pickup_coordinates, delivery_coordinates')
      .eq('id', bookingId)
      .single();

    let price = 0;
    let distance_km = 0;

    if (vehicle && booking?.pickup_coordinates && booking?.delivery_coordinates) {
      distance_km = this.calculateDistance(
        booking.pickup_coordinates,
        booking.delivery_coordinates
      );
      price = distance_km * vehicle.rate_per_km;
    }

    const { data: updatedBooking, error } = await supabase
      .from('bookings')
      .update({
        driver_id: driverId,
        vehicle_id: vehicleId,
        price,
        distance_km,
        status: 'confirmed',
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) {
      throw new Error('Failed to assign driver to booking: ' + error.message);
    }

    return updatedBooking;
  }

  static async cancelBooking(bookingId: string, userId: string): Promise<Booking> {
    const { data: booking, error } = await supabase
      .from('bookings')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId)
      .or(`farmer_id.eq.${userId},driver_id.eq.${userId}`)
      .select()
      .single();

    if (error) {
      throw new Error('Failed to cancel booking: ' + error.message);
    }

    return booking;
  }

  static async getAvailableBookings(driverId: string): Promise<Booking[]> {
    // Get driver's service areas
    const { data: driver } = await supabase
      .from('users')
      .select('service_areas')
      .eq('id', driverId)
      .single();

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        *,
        farmer:users!bookings_farmer_id_fkey (id, full_name, phone)
      `)
      .eq('status', 'pending')
      .is('driver_id', null)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error('Failed to fetch available bookings: ' + error.message);
    }

    return bookings || [];
  }

  private static calculateDistance(
    coord1: { lat: number; lng: number },
    coord2: { lat: number; lng: number }
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(coord2.lat - coord1.lat);
    const dLng = this.toRadians(coord2.lng - coord1.lng);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(coord1.lat)) * Math.cos(this.toRadians(coord2.lat)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}