// Get Collection Images By Collection ID Controller

import db from '../../../config/db.js';

export const getCollectionImagesByCollectionId = async (req, res) => {
  try {
    const { CollectionImage, Collection } = db.models;
    const { collectionId } = req.params;

    // Verify collection exists
    const collection = await Collection.findByPk(collectionId);
    if (!collection) {
      return res.status(404).json({
        success: false,
        error: 'Collection not found',
      });
    }

    const images = await CollectionImage.findAll({
      where: { collectionId },
      order: [['createdAt', 'ASC']],
    });

    res.json({
      success: true,
      data: images,
      total: images.length,
    });
  } catch (error) {
    console.error('Get collection images error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
