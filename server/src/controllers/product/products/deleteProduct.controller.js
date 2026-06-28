// Delete Product (Soft Delete) Controller - Mark as deleted

import db from '../../../config/db.js';

export const deleteProduct = async (req, res) => {
  try {
    const { Product } = db.models;
    const { id } = req.params;

    const product = await Product.findByPk(id, { paranoid: false });
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    // Soft delete using destroy() - proper way with paranoid: true
    await product.destroy();

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
