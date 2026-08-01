import db from '../../../config/db.js';

export const updatePaymentMethodStatus = async (req, res) => {
  try {
    const { PaymentMethod } = db.models;
    const { id } = req.params;
    const { isActive } = req.body;

    if (isActive === undefined || typeof isActive !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'isActive (boolean) is required',
      });
    }

    const paymentMethod = await PaymentMethod.findByPk(id);
    if (!paymentMethod) {
      return res.status(404).json({
        success: false,
        error: 'Payment method not found',
      });
    }

    if (paymentMethod.isActive === isActive) {
      return res.status(400).json({
        success: false,
        error: `Payment method is already ${isActive ? 'activated' : 'deactivated'}`,
      });
    }

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
