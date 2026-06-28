// Restore Payment Method Controller - Restore soft-deleted payment method

import db from '../../../config/db.js';

export const restorePaymentMethod = async (req, res) => {
  try {
    const { PaymentMethod } = db.models;
    const { id } = req.params;

    // Find the soft-deleted payment method
    const paymentMethod = await PaymentMethod.findByPk(id, { paranoid: false });
    if (!paymentMethod) {
      return res.status(404).json({
        success: false,
        error: 'Payment method not found',
      });
    }

    // Check if payment method is actually deleted
    if (!paymentMethod.deletedAt) {
      return res.status(400).json({
        success: false,
        error: 'Payment method is not deleted',
      });
    }

    // Restore the payment method
    await paymentMethod.restore();

    // Verify restoration
    const restoredPaymentMethod = await PaymentMethod.findByPk(id);
    if (!restoredPaymentMethod) {
      return res.status(500).json({
        success: false,
        error: 'Failed to restore payment method - verification failed',
      });
    }

    res.json({
      success: true,
      data: {
        paymentMethodId: restoredPaymentMethod.id,
        name: restoredPaymentMethod.name,
      },
      message: `Payment method "${restoredPaymentMethod.name}" restored successfully`,
    });
  } catch (error) {
    console.error('Restore payment method error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
