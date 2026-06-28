// Create Product Variant Controller - Create new product variant

import db from '../../../config/db.js';

export const createProductVariant = async (req, res) => {
  try {
    const { Product, ProductVariant } = db.models;
    const { id } = req.params;
    const { overallSize, seatSize, price, stockQuantity } = req.body;

    // Check product exists
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    // Validate input
    if (!price) {
      return res.status(400).json({
        success: false,
        error: 'Price is required',
      });
    }

    // Create new variant
    const variant = await ProductVariant.create({
      productId: id,
      overallSize,
      seatSize,
      price: parseFloat(price),
      stockQuantity: stockQuantity || 0,
    });

    res.status(201).json({
      success: true,
      data: variant,
    });
  } catch (error) {
    console.error('Create variant error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
