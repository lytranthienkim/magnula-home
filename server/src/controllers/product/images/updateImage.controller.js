// Update Image Controller - Update product image

import db from '../../../config/db.js';

export const updateImage = async (req, res) => {
  try {
    const { ProductImage } = db.models;
    const { imageId } = req.params;
    const { imageUrl, isMain } = req.body;

    const image = await ProductImage.findByPk(imageId);
    if (!image) {
      return res.status(404).json({
        success: false,
        error: 'Image not found',
      });
    }

    // If setting as main image, unset main from other images
    if (isMain) {
      await ProductImage.update(
        { isMain: false },
        { where: { productId: image.productId } }
      );
    }

    // Update fields
    if (imageUrl) image.imageUrl = imageUrl;
    if (isMain !== undefined) image.isMain = isMain;

    await image.save();

    res.json({
      success: true,
      data: image,
    });
  } catch (error) {
    console.error('Update image error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
