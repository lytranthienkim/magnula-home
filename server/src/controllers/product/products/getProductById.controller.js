// Get Product By ID Controller - Fetch product details by ID

import db from '../../../config/db.js';
import { Op } from 'sequelize';

export const getProductById = async (req, res) => {
  try {
    const {
      Collection,
      Product,
      ProductVariant,
      ProductImage,
      Material,
      FabricType,
      RoomSuitability,
    } = db.models;
    const { id } = req.params;

    // Xây dựng WHERE clause - loại bỏ discontinued products
    const whereClause = {
      deletedAt: null,
      id,
      status: { [Op.ne]: 'discontinued' } // Loại bỏ discontinued products
    };

    const product = await Product.findOne({
      where: whereClause,
      include: [
        {
          model: Collection,
          attributes: ['id', 'collectionName', 'colorHex'],
        },
        {
          model: Material,
          attributes: ['id', 'name', 'description'],
        },
        {
          model: FabricType,
          attributes: ['id', 'name', 'description'],
        },
        {
          model: RoomSuitability,
          attributes: ['id', 'name', 'description'],
        },
        {
          model: ProductVariant,
          as: 'variants',
          attributes: ['id', 'overallSize', 'seatSize', 'price', 'stockQuantity'],
        },
        {
          model: ProductImage,
          as: 'images',
          attributes: ['id', 'imageUrl', 'isMain'],
          where: { deletedAt: null },
          required: false,
        },
      ],
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
