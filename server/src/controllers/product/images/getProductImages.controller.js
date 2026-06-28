// Get Product Images Controller - Fetch all images for a product

import db from '../../../config/db.js';

export const getProductImages = async (req, res) => {
  try {
    const { Product, ProductImage } = db.models;
    const { id } = req.params;

    // Check product exists
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    // Get images, main image first (exclude deleted)
    const images = await ProductImage.findAll({
      where: { productId: id, deletedAt: null },
      order: [['isMain', 'DESC'], ['createdAt', 'ASC']],
    });

    res.json({
      success: true,
      data: images,
    });
  } catch (error) {
    console.error('Get images error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
