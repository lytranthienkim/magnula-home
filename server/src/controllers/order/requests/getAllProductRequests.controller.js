import db from '../../../config/db.js';

export const getAllProductRequests = async (req, res) => {
  try {
    const { ProductRequest, Product, ProductVariant } = db.models;

    const limit = req.query.limit ? Math.min(parseInt(req.query.limit, 10), 100) : 10;
    const offset = req.query.offset ? Math.max(parseInt(req.query.offset, 10), 0) : 0;

    const { count, rows: requests } = await ProductRequest.findAndCountAll({
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
      limit,
      offset,
    });

    res.json({
      success: true,
      data: requests,
      total: count,
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
