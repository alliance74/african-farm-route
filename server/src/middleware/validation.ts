import { body, param, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User validation rules
export const validateUserRegistration = [
  body('full_name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  body('phone')
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('user_type')
    .isIn(['farmer', 'driver'])
    .withMessage('User type must be either farmer or driver'),
  handleValidationErrors
];

export const validateUserLogin = [
  body('phone')
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Vehicle validation rules
export const validateVehicleRegistration = [
  body('vehicle_type')
    .isIn(['pickup', 'truck', 'van', 'motorcycle', 'tractor'])
    .withMessage('Invalid vehicle type'),
  body('make')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Vehicle make must be between 2 and 50 characters'),
  body('model')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Vehicle model must be between 2 and 50 characters'),
  body('year')
    .isInt({ min: 1990, max: new Date().getFullYear() + 1 })
    .withMessage('Please provide a valid year'),
  body('plate_number')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Plate number must be between 3 and 20 characters'),
  body('capacity')
    .isFloat({ min: 0.1, max: 50 })
    .withMessage('Capacity must be between 0.1 and 50 tons'),
  body('rate_per_km')
    .isFloat({ min: 1 })
    .withMessage('Rate per km must be a positive number'),
  handleValidationErrors
];

// Booking validation rules
export const validateBookingCreation = [
  body('pickup_location')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Pickup location must be between 5 and 200 characters'),
  body('delivery_location')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Delivery location must be between 5 and 200 characters'),
  body('goods_type')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Goods type must be between 2 and 100 characters'),
  body('goods_weight')
    .isFloat({ min: 0.1 })
    .withMessage('Goods weight must be a positive number'),
  body('scheduled_date')
    .isISO8601()
    .withMessage('Please provide a valid date'),
  body('scheduled_time')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Please provide a valid time in HH:MM format'),
  handleValidationErrors
];

// Pagination validation
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  handleValidationErrors
];

// ID parameter validation
export const validateId = [
  param('id')
    .isUUID()
    .withMessage('Invalid ID format'),
  handleValidationErrors
];