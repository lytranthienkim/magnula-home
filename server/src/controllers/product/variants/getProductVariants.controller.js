// Get Product Variants Controller - Fetch all variants for a product

import db from '../../../config/db.js';

export const getProductVariants = async (req, res) => {
  try {
    const { Product, ProductVariant } = db.models;
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    const variants = await ProductVariant.findAll({
      where: { productId: id, deletedAt: null },
      order: [['price', 'ASC']],
    });

    res.json({
      success: true,
      data: variants,
    });
  } catch (error) {
    console.error('Get variants error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
