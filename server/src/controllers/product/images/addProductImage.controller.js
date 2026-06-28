// Add Product Image Controller - Add image to product

import db from '../../../config/db.js';

export const addProductImage = async (req, res) => {
  try {
    const { Product, ProductImage } = db.models;
    const { id } = req.params;
    const { imageUrl, isMain } = req.body;

    // Check product exists
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    // Validate URL
    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        error: 'Image URL is required',
      });
    }

    // Check how many images this product already has
    const existingImagesCount = await ProductImage.count({
      where: { productId: id, deletedAt: null },
    });

    // If this is the first image, automatically set as main
    let shouldBeMain = existingImagesCount === 0 ? true : isMain || false;

    // If main image, unset main from other images
    if (shouldBeMain) {
      await ProductImage.update(
        { isMain: false },
        { where: { productId: id, deletedAt: null } }
      );
    }

    // Create image
    const image = await ProductImage.create({
      productId: id,
      imageUrl,
      isMain: shouldBeMain,
    });

    res.status(201).json({
      success: true,
      data: image,
    });
  } catch (error) {
    console.error('Add image error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
