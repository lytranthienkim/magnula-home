import db from '../../../config/db.js';

export const getOrderItems = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { Order, OrderItem, Product, ProductVariant } = db.models;

    // Verify order exists
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    // Get all items for this order
    const items = await OrderItem.findAll({
      where: { orderId },
      include: [
        {
          model: Product,
          attributes: ['id', 'productName', 'status'],
        },
        {
          model: ProductVariant,
          attributes: ['id', 'overallSize', 'seatSize', 'price', 'stockQuantity'],
        },
      ],
    });

    res.json({ success: true, data: items });
  } catch (error) {
    console.error('Get order items error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
