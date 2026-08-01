import db from '../../../config/db.js';
import { invalidateProductCache } from '../../../middleware/cache/cacheInvalidation.js';

export const createProductVariant = async (req, res) => {
  try {
    const { Product, ProductVariant } = db.models;
    const { id } = req.params;
    const { overallSize, seatSize, price, stockQuantity } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    if (!price) {
      return res.status(400).json({
        success: false,
        error: 'Price is required',
      });
    }

    const variant = await ProductVariant.create({
      productId: id,
      overallSize,
      seatSize,
      price: parseFloat(price),
      stockQuantity: stockQuantity || 0,
    });

    await invalidateProductCache();

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
