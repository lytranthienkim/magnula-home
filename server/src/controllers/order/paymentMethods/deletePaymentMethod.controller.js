// Delete Payment Method Controller - Soft delete with order reference check

import db from '../../../config/db.js';

export const deletePaymentMethod = async (req, res) => {
  try {
    const { PaymentMethod, Order } = db.models;
    const { id } = req.params;

    // Get payment method
    const paymentMethod = await PaymentMethod.findByPk(id);
    if (!paymentMethod) {
      return res.status(404).json({
        success: false,
        error: 'Payment method not found',
      });
    }

    // Check if any order uses this payment method
    const orderCount = await Order.count({
      where: { paymentMethodId: id, deletedAt: null },
    });

    if (orderCount > 0) {
      return res.status(403).json({
        success: false,
        error: `Cannot delete payment method "${paymentMethod.name}" because there are ${orderCount} orders using it`,
      });
    }

    // Safe to soft delete using Sequelize's destroy method
    await paymentMethod.destroy();

    // Verify deletion was successful
    const deletedPaymentMethod = await PaymentMethod.findByPk(id, { paranoid: false });
    if (!deletedPaymentMethod || !deletedPaymentMethod.deletedAt) {
      return res.status(500).json({
        success: false,
        error: 'Failed to delete payment method - verification failed',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment method deleted successfully',
    });
  } catch (error) {
    console.error('Delete payment method error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete payment method',
    });
  }
};
