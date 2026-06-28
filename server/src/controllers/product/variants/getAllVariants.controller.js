// Get All Product Variants Controller

import db from '../../../config/db.js';

export const getAllVariants = async (req, res) => {
  try {
    const { ProductVariant, Product } = db.models;

    const variants = await ProductVariant.findAll({
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
      data: variants,
      total: variants.length,
    });
  } catch (error) {
    console.error('Get all variants error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
