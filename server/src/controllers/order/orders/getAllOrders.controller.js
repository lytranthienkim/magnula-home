import db from '../../../config/db.js';
import { buildCompleteOrderSearch } from '../../../utils/orderSearch.js';

export const getAllOrders = async (req, res) => {
  try {
    const { Order, OrderItem, Product, ProductVariant, PaymentMethod } = db.models;

    const limit = req.query.limit ? Math.min(parseInt(req.query.limit, 10), 100) : 10;
    const offset = req.query.offset ? Math.max(parseInt(req.query.offset, 10), 0) : 0;

    const searchWhere = buildCompleteOrderSearch(req.query);

    const { count, rows: orders } = await Order.findAndCountAll({
      where: searchWhere,
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
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    res.json({
      success: true,
      data: orders,
      total: count,
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
