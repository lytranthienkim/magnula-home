// Get All Product Requests Controller - Fetch all active product requests

import db from '../../../config/db.js';

export const getAllProductRequests = async (req, res) => {
  try {
    const { ProductRequest, Product, ProductVariant } = db.models;

    const requests = await ProductRequest.findAll({
      where: { deletedAt: null },
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
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: requests,
    });
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product requests',
      details: error.message,
    });
  }
};
