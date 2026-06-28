// Delete Image (Soft Delete) Controller

import db from '../../../config/db.js';
import { Op } from 'sequelize';

export const deleteImage = async (req, res) => {
  try {
    const { ProductImage } = db.models;
    const { imageId } = req.params;

    const image = await ProductImage.findByPk(imageId, { paranoid: false });
    if (!image) {
      return res.status(404).json({
        success: false,
        error: 'Image not found',
      });
    }

    // Check if this is the last non-deleted image for the product
    const remainingImagesCount = await ProductImage.count({
      where: {
        productId: image.productId,
        deletedAt: null,
        id: { [Op.ne]: imageId } // Exclude current image
      },
    });

    if (remainingImagesCount === 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete the last image of a product. A product must have at least one image.',
      });
    }

    // Soft delete using destroy() - proper way with paranoid: true
    await image.destroy();

    res.json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
