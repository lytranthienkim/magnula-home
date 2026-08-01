import db from '../../../config/db.js';
import { invalidateProductCache } from '../../../middleware/cache/cacheInvalidation.js';

export const restoreProduct = async (req, res) => {
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

    if (!product.deletedAt) {
      return res.status(400).json({
        success: false,
        error: 'Product is not deleted',
      });
    }

    await product.restore();

    const restoredProduct = await Product.findByPk(id);
    if (!restoredProduct) {
      return res.status(500).json({
        success: false,
        error: 'Failed to restore product - verification failed',
      });
    }

    await invalidateProductCache();

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
