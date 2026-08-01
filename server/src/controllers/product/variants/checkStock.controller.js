import db from '../../../config/db.js';

export const checkStock = async (req, res) => {
  try {
    const { Product, ProductVariant } = db.models;
    const { variantId, quantity } = req.body;

    if (!variantId || !quantity) {
      return res.status(400).json({
        success: false,
        error: 'Variant ID and quantity are required',
      });
    }

    const variant = await ProductVariant.findByPk(variantId, {
      include: [{ model: Product }],
    });

    if (!variant) {
      return res.status(404).json({
        success: false,
        error: 'Variant not found',
      });
    }

    const hasStock = variant.stockQuantity >= quantity;
    const remainingStock = Math.max(0, variant.stockQuantity - quantity);

    res.json({
      success: true,
      data: {
        variantId,
        productName: variant.Product.productName,
        requestedQuantity: quantity,
        availableStock: variant.stockQuantity,
        hasStock,
        remainingStock,
      },
    });
  } catch (error) {
    console.error('Check stock error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
