// Get All Orders Controller - Fetch all orders with search

import db from '../../../config/db.js';
import { buildCompleteOrderSearch } from '../../../utils/orderSearch.js';

export const getAllOrders = async (req, res) => {
  try {
    const { Order, OrderItem, Product, ProductVariant, PaymentMethod } = db.models;

    // Build WHERE clause from query params (phone, orderCode, email, status)
    // Note: Orders are immutable - no soft delete support
    const searchWhere = buildCompleteOrderSearch(req.query);

    const orders = await Order.findAll({
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
    });

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
