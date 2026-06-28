// Update Payment Method Status Controller - Activate/Deactivate only

import db from '../../../config/db.js';

export const updatePaymentMethodStatus = async (req, res) => {
  try {
    const { PaymentMethod } = db.models;
    const { id } = req.params;
    const { isActive } = req.body;

    // Validate input
    if (isActive === undefined || typeof isActive !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'isActive (boolean) is required',
      });
    }

    // Get payment method
    const paymentMethod = await PaymentMethod.findByPk(id);
    if (!paymentMethod) {
      return res.status(404).json({
        success: false,
        error: 'Payment method not found',
      });
    }

    // Check current status
    if (paymentMethod.isActive === isActive) {
      return res.status(400).json({
        success: false,
        error: `Payment method is already ${isActive ? 'activated' : 'deactivated'}`,
      });
    }

    // Update status
    await paymentMethod.update({ isActive });

    res.json({
      success: true,
      data: {
        paymentMethodId: paymentMethod.id,
        name: paymentMethod.name,
        isActive: paymentMethod.isActive,
      },
      message: `Payment method "${paymentMethod.name}" ${isActive ? 'activated' : 'deactivated'} successfully`,
    });
  } catch (error) {
    console.error('Update payment method status error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
