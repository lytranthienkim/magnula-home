import db from '../../../config/db.js';

export const updateOrderStatus = async (req, res) => {
  try {
    const { Order } = db.models;
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required',
      });
    }

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

    await order.update({ status });

    res.json({
      success: true,
      data: order,
      message: `Order status updated to ${status}`,
    });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update order status',
      details: error.message,
    });
  }
};
