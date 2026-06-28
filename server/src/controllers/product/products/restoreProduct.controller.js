// Restore Product Controller - Restore soft-deleted product

import db from '../../../config/db.js';

export const restoreProduct = async (req, res) => {
  try {
    const { Product } = db.models;
    const { id } = req.params;

    // Find the soft-deleted product
    const product = await Product.findByPk(id, { paranoid: false });
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    // Check if product is actually deleted
    if (!product.deletedAt) {
      return res.status(400).json({
        success: false,
        error: 'Product is not deleted',
      });
    }

    // Restore the product
    await product.restore();

    // Verify restoration
    const restoredProduct = await Product.findByPk(id);
    if (!restoredProduct) {
      return res.status(500).json({
        success: false,
        error: 'Failed to restore product - verification failed',
      });
    }

    res.json({
      success: true,
      data: {
        productId: restoredProduct.id,
        productName: restoredProduct.productName,
      },
      message: `Product "${restoredProduct.productName}" restored successfully`,
    });
  } catch (error) {
    console.error('Restore product error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
