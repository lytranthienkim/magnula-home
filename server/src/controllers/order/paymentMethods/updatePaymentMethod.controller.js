// Update Payment Method Controller

import db from '../../../config/db.js';

export const updatePaymentMethod = async (req, res) => {
  try {
    const { PaymentMethod } = db.models;
    const { id } = req.params;
    const { code, name, description } = req.body;

    // Get payment method
    const paymentMethod = await PaymentMethod.findByPk(id);
    if (!paymentMethod) {
      return res.status(404).json({
        success: false,
        error: 'Payment method not found',
      });
    }

    // Check if new code already exists (if code is being updated)
    if (code && code !== paymentMethod.code) {
      const existing = await PaymentMethod.findOne({ where: { code }, paranoid: false });
      if (existing) {
        return res.status(409).json({
          success: false,
          error: `Payment method with code "${code}" already exists`,
        });
      }
    }

    // Update payment method
    await paymentMethod.update({
      code: code || paymentMethod.code,
      name: name || paymentMethod.name,
      description: description !== undefined ? description : paymentMethod.description,
    });

    res.json({
      success: true,
      data: paymentMethod,
      message: 'Payment method updated successfully',
    });
  } catch (error) {
    console.error('Update payment method error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
