import { Router } from 'express';
import { VehicleController } from '../controllers/vehicleController';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validateVehicleRegistration, validateId } from '../middleware/validation';

const router = Router();

// Public routes
router.get('/available', VehicleController.getAvailableVehicles);
router.get('/:id', validateId, VehicleController.getVehicleById);

// Driver-only routes
router.post(
  '/register',
  authenticateToken,
  requireRole(['driver']),
  validateVehicleRegistration,
  VehicleController.registerVehicle
);

router.get(
  '/my/vehicles',
  authenticateToken,
  requireRole(['driver']),
  VehicleController.getMyVehicles
);

router.put(
  '/:id',
  authenticateToken,
  requireRole(['driver']),
  validateId,
  VehicleController.updateVehicle
);

router.delete(
  '/:id',
  authenticateToken,
  requireRole(['driver']),
  validateId,
  VehicleController.deleteVehicle
);

export default router;