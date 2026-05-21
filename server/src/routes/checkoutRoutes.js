import express from 'express';
import * as checkoutController from '../controllers/checkoutController.js';

const router = express.Router();

router.post('/checkout', checkoutController.createOrder);

export default router;