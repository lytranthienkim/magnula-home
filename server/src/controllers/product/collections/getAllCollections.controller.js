// Get All Collections Controller

import db from '../../../config/db.js';
import { Op } from 'sequelize';

export const getAllCollections = async (req, res) => {
  try {
    const { Collection } = db.models;

    // Check if requesting deleted items
    const isDeleted = req.query.deleted === 'true';

    const collections = await Collection.findAll({
      where: isDeleted
        ? { deletedAt: { [Op.not]: null } } // Only deleted items
        : { deletedAt: null }, // Only active items
      paranoid: !isDeleted, // Disable paranoid mode to include deleted items when requested
      include: [
        {
          association: 'images',
          attributes: ['id', 'imageUrl'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      data: collections,
    });
  } catch (error) {
    console.error('Get collections error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch collections',
    });
  }
};
