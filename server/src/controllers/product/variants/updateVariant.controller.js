// Update Variant Controller - Update product variant info

import db from '../../../config/db.js';

export const updateVariant = async (req, res) => {
  try {
    const { ProductVariant } = db.models;
    const { variantId } = req.params;
    const { price, stockQuantity, overallSize, seatSize } = req.body;

    const variant = await ProductVariant.findByPk(variantId);
    if (!variant) {
      return res.status(404).json({
        success: false,
        error: 'Variant not found',
      });
    }

    // Update fields
    if (price) variant.price = parseFloat(price);
    if (stockQuantity !== undefined) variant.stockQuantity = stockQuantity;
    if (overallSize) variant.overallSize = overallSize;
    if (seatSize) variant.seatSize = seatSize;

    await variant.save();

    res.json({
      success: true,
      data: variant,
    });
  } catch (error) {
    console.error('Update variant error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
