// Get All Product Images Controller

import db from '../../../config/db.js';

export const getAllImages = async (req, res) => {
  try {
    const { ProductImage, Product } = db.models;

    const images = await ProductImage.findAll({
      include: [
        {
          model: Product,
          attributes: ['id', 'productName'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: images,
      total: images.length,
    });
  } catch (error) {
    console.error('Get all images error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
