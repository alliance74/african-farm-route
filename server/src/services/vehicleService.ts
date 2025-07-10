import { supabase } from '../config/database';
import { Vehicle } from '../types';

export class VehicleService {
  static async registerVehicle(driverId: string, vehicleData: {
    vehicle_type: string;
    make: string;
    model: string;
    year: number;
    plate_number: string;
    capacity: number;
    specialization?: string;
    rate_per_km: number;
    // New fields for future use
    full_name?: string;
    phone_number?: string;
    email?: string;
    license_number?: string;
    experience?: string;
    service_areas?: string;
    availability?: string;
    additional_info?: string;
  }): Promise<Vehicle> {
    // Check if driver already has a vehicle with this plate number
    const { data: existingVehicle } = await supabase
      .from('vehicles')
      .select('id')
      .eq('plate_number', vehicleData.plate_number)
      .single();

    if (existingVehicle) {
      throw new Error('Vehicle with this plate number already exists');
    }

    const { data: vehicle, error } = await supabase
      .from('vehicles')
      .insert({
        driver_id: driverId,
        ...vehicleData,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      throw new Error('Failed to register vehicle: ' + error.message);
    }

    return vehicle;
  }

  static async getVehiclesByDriver(driverId: string): Promise<Vehicle[]> {
    const { data: vehicles, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('driver_id', driverId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error('Failed to fetch vehicles: ' + error.message);
    }

    return vehicles || [];
  }

  static async getAvailableVehicles(filters?: {
    vehicle_type?: string;
    min_capacity?: number;
    max_rate?: number;
    service_area?: string;
  }): Promise<Vehicle[]> {
    let query = supabase
      .from('vehicles')
      .select(`
        *,
        driver:users!vehicles_driver_id_fkey (
          id,
          full_name,
          phone,
          rating,
          is_available,
          service_areas
        )
      `)
      .eq('is_active', true);

    if (filters?.vehicle_type) {
      query = query.eq('vehicle_type', filters.vehicle_type);
    }

    if (filters?.min_capacity) {
      query = query.gte('capacity', filters.min_capacity);
    }

    if (filters?.max_rate) {
      query = query.lte('rate_per_km', filters.max_rate);
    }

    const { data: vehicles, error } = await query.order('rate_per_km', { ascending: true });

    if (error) {
      throw new Error('Failed to fetch available vehicles: ' + error.message);
    }

    // Filter by service area if provided
    let filteredVehicles = vehicles || [];
    if (filters?.service_area) {
      filteredVehicles = vehicles?.filter(vehicle => 
        vehicle.driver?.service_areas?.includes(filters.service_area)
      ) || [];
    }

    return filteredVehicles;
  }

  static async updateVehicle(vehicleId: string, driverId: string, updates: Partial<Vehicle>): Promise<Vehicle> {
    const { data: vehicle, error } = await supabase
      .from('vehicles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', vehicleId)
      .eq('driver_id', driverId)
      .select()
      .single();

    if (error) {
      throw new Error('Failed to update vehicle: ' + error.message);
    }

    return vehicle;
  }

  static async deleteVehicle(vehicleId: string, driverId: string): Promise<void> {
    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', vehicleId)
      .eq('driver_id', driverId);

    if (error) {
      throw new Error('Failed to delete vehicle: ' + error.message);
    }
  }

  static async getVehicleById(vehicleId: string): Promise<Vehicle | null> {
    const { data: vehicle, error } = await supabase
      .from('vehicles')
      .select(`
        *,
        driver:users!vehicles_driver_id_fkey (
          id,
          full_name,
          phone,
          rating,
          is_available
        )
      `)
      .eq('id', vehicleId)
      .single();

    if (error) {
      return null;
    }

    return vehicle;
  }
}