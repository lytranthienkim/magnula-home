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

router.get('/', getAllPaymentMethods);

router.post('/', verifyToken, checkPermission('payment_methods:create'), createPaymentMethod);
router.post('/:id/restore', verifyToken, checkPermission('payment_methods:update'), restorePaymentMethod);

router.put('/:id', verifyToken, checkPermission('payment_methods:update'), updatePaymentMethod);

router.patch('/:id/status', verifyToken, checkPermission('payment_methods:update'), updatePaymentMethodStatus);

router.delete('/:id', verifyToken, checkPermission('payment_methods:delete'), deletePaymentMethod);

export default router;
