import { Request, Response } from 'express';
import { VehicleService } from '../services/vehicleService';
import { ApiResponse } from '../types';
import { AuthRequest } from '../middleware/auth';

export class VehicleController {
  static async registerVehicle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const driverId = req.user!.id;
      const vehicleData = req.body;

      const vehicle = await VehicleService.registerVehicle(driverId, vehicleData);

      const response: ApiResponse = {
        success: true,
        message: 'Vehicle registered successfully',
        data: vehicle
      };

      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: error instanceof Error ? error.message : 'Vehicle registration failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      res.status(400).json(response);
    }
  }

  static async getMyVehicles(req: AuthRequest, res: Response): Promise<void> {
    try {
      const driverId = req.user!.id;
      const vehicles = await VehicleService.getVehiclesByDriver(driverId);

      const response: ApiResponse = {
        success: true,
        message: 'Vehicles fetched successfully',
        data: vehicles
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to fetch vehicles',
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      res.status(500).json(response);
    }
  }

  static async getAvailableVehicles(req: Request, res: Response): Promise<void> {
    try {
      const filters = {
        vehicle_type: req.query.vehicle_type as string,
        min_capacity: req.query.min_capacity ? parseFloat(req.query.min_capacity as string) : undefined,
        max_rate: req.query.max_rate ? parseFloat(req.query.max_rate as string) : undefined,
        service_area: req.query.service_area as string,
      };

      const vehicles = await VehicleService.getAvailableVehicles(filters);

      const response: ApiResponse = {
        success: true,
        message: 'Available vehicles fetched successfully',
        data: vehicles
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to fetch available vehicles',
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      res.status(500).json(response);
    }
  }

  static async getVehicleById(req: Request, res: Response): Promise<void> {
    try {
      const vehicleId = req.params.id;
      const vehicle = await VehicleService.getVehicleById(vehicleId);

      if (!vehicle) {
        const response: ApiResponse = {
          success: false,
          message: 'Vehicle not found'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: 'Vehicle fetched successfully',
        data: vehicle
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to fetch vehicle',
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      res.status(500).json(response);
    }
  }

  static async updateVehicle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const vehicleId = req.params.id;
      const driverId = req.user!.id;
      const updates = req.body;

      const vehicle = await VehicleService.updateVehicle(vehicleId, driverId, updates);

      const response: ApiResponse = {
        success: true,
        message: 'Vehicle updated successfully',
        data: vehicle
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to update vehicle',
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      res.status(400).json(response);
    }
  }

  static async deleteVehicle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const vehicleId = req.params.id;
      const driverId = req.user!.id;

      await VehicleService.deleteVehicle(vehicleId, driverId);

      const response: ApiResponse = {
        success: true,
        message: 'Vehicle deleted successfully'
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Failed to delete vehicle',
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      res.status(400).json(response);
    }
  }
}