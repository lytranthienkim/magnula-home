import db from '../../../config/db.js';

export const createPaymentMethod = async (req, res) => {
  try {
    const { PaymentMethod } = db.models;
    const { code, name, description } = req.body;

    if (!code || !name) {
      return res.status(400).json({
        success: false,
        error: 'code and name are required',
      });
    }

    const existing = await PaymentMethod.findOne({ where: { code }, paranoid: false });
    if (existing) {
      return res.status(409).json({
        success: false,
        error: `Payment method with code "${code}" already exists`,
      });
    }

    const paymentMethod = await PaymentMethod.create({
      code,
      name,
      description,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      data: paymentMethod,
      message: 'Payment method created successfully',
    });
  } catch (error) {
    console.error('Create payment method error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
