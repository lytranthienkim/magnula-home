import db from '../../../config/db.js';

export const getOrderByOrderCode = async (req, res) => {
  try {
    const { Order, OrderItem, Product, ProductVariant, PaymentMethod } = db.models;
    const { orderCode } = req.params;

    const order = await Order.findOne({
      where: { orderCode },
      include: [
        {
          model: PaymentMethod,
          attributes: ['id', 'name', 'description'],
        },
        {
          model: OrderItem,
          as: 'items',
          attributes: ['id', 'productId', 'productVariantId', 'quantity', 'priceAtPurchase'],
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
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Get order by code error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
