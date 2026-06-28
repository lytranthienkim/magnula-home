// Get Collection By ID Controller

import db from '../../../config/db.js';

export const getCollectionById = async (req, res) => {
  try {
    const { Collection } = db.models;
    const { id } = req.params;

    // findByPk with paranoid: true automatically excludes soft-deleted records
    const collection = await Collection.findByPk(id, {
      include: [
        {
          association: 'images',
          attributes: ['id', 'imageUrl'],
        },
      ],
    });

    if (!collection) {
      return res.status(404).json({
        success: false,
        error: 'Collection not found',
      });
    }

    res.status(200).json({
      success: true,
      data: collection,
    });
  } catch (error) {
    console.error('Get collection error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch collection',
    });
  }
};
