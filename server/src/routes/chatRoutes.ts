import { Router } from 'express';
import { ChatController } from '../controllers/chatController';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validateId, validatePagination } from '../middleware/validation';
import { body } from 'express-validator';

const router = Router();

// Validation middleware for chat operations
const validateChatRoomCreation = [
  body('other_user_id')
    .isUUID()
    .withMessage('Invalid user ID'),
  body('booking_id')
    .optional()
    .isUUID()
    .withMessage('Invalid booking ID'),
];

const validatePriceOffer = [
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),
  body('currency')
    .isLength({ min: 3, max: 3 })
    .withMessage('Currency must be a 3-letter code'),
  body('message')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Message must be less than 500 characters'),
  body('valid_until')
    .optional()
    .isISO8601()
    .withMessage('Valid until must be a valid date'),
];

const validateMarkAsRead = [
  body('message_ids')
    .optional()
    .isArray()
    .withMessage('Message IDs must be an array'),
  body('message_ids.*')
    .optional()
    .isUUID()
    .withMessage('Each message ID must be a valid UUID'),
];

// Protected routes for farmers and drivers
router.post(
  '/rooms',
  authenticateToken,
  requireRole(['farmer', 'driver']),
  validateChatRoomCreation,
  ChatController.createOrGetChatRoom
);

router.get(
  '/rooms',
  authenticateToken,
  requireRole(['farmer', 'driver']),
  ChatController.getUserChatRooms
);

router.get(
  '/rooms/:id',
  authenticateToken,
  requireRole(['farmer', 'driver']),
  validateId,
  ChatController.getChatRoom
);

router.get(
  '/rooms/:id/messages',
  authenticateToken,
  requireRole(['farmer', 'driver']),
  validateId,
  validatePagination,
  ChatController.getRoomMessages
);

router.post(
  '/rooms/:id/read',
  authenticateToken,
  requireRole(['farmer', 'driver']),
  validateId,
  validateMarkAsRead,
  ChatController.markMessagesAsRead
);

router.post(
  '/rooms/:id/price-offer',
  authenticateToken,
  requireRole(['farmer', 'driver']),
  validateId,
  validatePriceOffer,
  ChatController.sendPriceOffer
);

router.put(
  '/rooms/:id/close',
  authenticateToken,
  requireRole(['farmer', 'driver']),
  validateId,
  ChatController.closeChatRoom
);

export default router;