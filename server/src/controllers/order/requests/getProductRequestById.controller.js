import db from '../../../config/db.js';

export const getProductRequestById = async (req, res) => {
  try {
    const { ProductRequest, Product, ProductVariant } = db.models;
    const { id } = req.params;

    const request = await ProductRequest.findByPk(id, {
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

    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Request not found',
      });
    }

    res.json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.error('Get request error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product request',
      details: error.message,
    });
  }
};
