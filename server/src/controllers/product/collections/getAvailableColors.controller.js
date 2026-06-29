// Get Available Colors Controller - Get all unique colors from active collections

import db from '../../../config/db.js';

export const getAvailableColors = async (req, res) => {
  try {
    const { Collection } = db.models;

    const collections = await Collection.findAll({
      where: { deletedAt: null }, // Only active collections
      attributes: ['colorHex'],
      order: [['colorHex', 'ASC']],
    });

    // Extract unique colors
    const colors = collections.map((c) => c.colorHex).filter((color, index, self) => self.indexOf(color) === index);

    res.status(200).json({
      success: true,
      data: colors,
    });
  } catch (error) {
    console.error('Get available colors error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch available colors',
    });
  }
};
