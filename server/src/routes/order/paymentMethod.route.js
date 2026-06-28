import express from 'express';
import {
  getAllPaymentMethods,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  restorePaymentMethod,
  updatePaymentMethodStatus
} from '../../controllers/order/paymentMethods/index.js';
import { verifyToken, checkPermission } from '../../middleware/auth/index.js';

const router = express.Router();

// GET /api/payment-methods - Get all payment methods (PUBLIC - no auth required for guests)
router.get('/', getAllPaymentMethods);

// POST /api/payment-methods - Create payment method
router.post('/', verifyToken, checkPermission('payment_methods:create'), createPaymentMethod);

// PUT /api/payment-methods/:id - Update payment method
router.put('/:id', verifyToken, checkPermission('payment_methods:update'), updatePaymentMethod);

// PATCH /api/payment-methods/:id/status - Update payment method status (activate/deactivate)
router.patch('/:id/status', verifyToken, checkPermission('payment_methods:update'), updatePaymentMethodStatus);

// DELETE /api/payment-methods/:id - Delete payment method (soft delete)
router.delete('/:id', verifyToken, checkPermission('payment_methods:delete'), deletePaymentMethod);

// POST /api/payment-methods/:id/restore - Restore payment method
router.post('/:id/restore', verifyToken, checkPermission('payment_methods:update'), restorePaymentMethod);

export default router;
