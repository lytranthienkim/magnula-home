import db from '../../../config/db.js';

export const getAllPaymentMethods = async (req, res) => {
  try {
    const { PaymentMethod } = db.models;
    const { includeInactive } = req.query;

    const where = includeInactive ? {} : { isActive: true };
    const paranoid = !includeInactive;

    const paymentMethods = await PaymentMethod.findAll({
      where,
      paranoid,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: paymentMethods,
      count: paymentMethods.length,
    });
  } catch (error) {
    console.error('Get all payment methods error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
